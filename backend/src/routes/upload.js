const express = require('express');
const multer = require('multer');
const path = require('path');

const FRONTEND_IMAGES = path.join(__dirname, '..', '..', 'Frontend', 'images');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, FRONTEND_IMAGES),
  filename: (req, file, cb) => cb(null, Date.now() + '_' + file.originalname.replace(/\s+/g, '_'))
});
const upload = multer({ storage });

const router = express.Router();

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const rel = path.join('images', req.file.filename);
  res.json({ success: true, path: rel });
});

module.exports = router;
