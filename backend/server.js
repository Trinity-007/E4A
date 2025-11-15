const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Paths
const FRONTEND_DIR = path.join(__dirname, '..', 'Frontend');
const IMAGES_DIR = path.join(FRONTEND_DIR, 'images');
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(__dirname, 'users.json');
const ORDERS_FILE = path.join(__dirname, 'orders.json');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');

// Ensure data files exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '[]');
if (!fs.existsSync(ORDERS_FILE)) fs.writeFileSync(ORDERS_FILE, '[]');
if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });

// Multer for image uploads (field name: 'image')
const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, IMAGES_DIR); },
  filename: function (req, file, cb) { cb(null, Date.now() + '_' + file.originalname.replace(/\s+/g, '_')); }
});
const upload = multer({ storage });

// Serve frontend static files
app.use(express.static(FRONTEND_DIR));

// API: products
app.get('/api/products', (req, res) => {
  fs.readFile(PRODUCTS_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read products' });
    try { return res.json(JSON.parse(data)); } catch (e) { return res.status(500).json({ error: 'Invalid products JSON' }); }
  });
});

// API: upload image
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  // return a relative path usable by frontend
  const relPath = path.join('images', path.basename(req.file.path));
  res.json({ success: true, path: relPath });
});

// API: auth register
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password || !name) return res.status(400).json({ error: 'Missing fields' });
  const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8') || '[]');
  if (users.find(u => u.email === email)) return res.status(409).json({ error: 'Email already registered' });
  users.push({ name, email, password });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  res.json({ success: true, user: { name, email } });
});

// API: auth login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8') || '[]');
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ success: true, user: { name: user.name, email: user.email } });
});

// API: create order
app.post('/api/orders', (req, res) => {
  const { items, contact, total } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'No items' });
  const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8') || '[]');
  const id = 'ORD-' + Date.now();
  const order = { id, items, total: total || items.reduce((s,i)=>s+(i.price||0),0), contact: contact || null, createdAt: new Date().toISOString() };
  orders.push(order);
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
  res.json({ success: true, order });
});

// API: list orders
app.get('/api/orders', (req, res) => {
  const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8') || '[]');
  res.json(orders);
});

// Fallback to index.html for SPA-style routes
app.get('*', (req, res) => {
  const indexPath = path.join(FRONTEND_DIR, 'index.html');
  if (fs.existsSync(indexPath)) return res.sendFile(indexPath);
  return res.status(404).send('Not found');
});

app.listen(PORT, () => console.log(`E4A backend running on http://localhost:${PORT}`));
