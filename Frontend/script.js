// E4A frontend script - integrated with backend API
// Backend API base URL - use relative path so it works on any domain/port
const API_BASE = '/api';
let PRODUCTS = [];

// Fallback products (used if backend unavailable)
const FALLBACK_PRODUCTS = [
  { id: 1, name: "Samsung Galaxy S24", price: 99, image: "images/Samsung_Galaxy_s24.jpg", category: "Phones", description: "Latest Samsung flagship with powerful camera and performance." },
  { id: 2, name: "iPhone 15 Pro", price: 99, image: "images/iphone-15-pro-kleuren-2.jpg", category: "Phones", description: "Apple's pro lineup with top-tier performance and camera." },
  { id: 3, name: "Nike Air Max 270", price: 20, image: "images/Nike_Air_Max_270_Sneakers_Black.webp", category: "Fashion", description: "Comfortable everyday sneakers." },
  { id: 4, name: "Adidas Running Sneakers", price: 80, image: "images/Adidas-mesh-x-02.webp", category: "Fashion", description: "Lightweight running shoes." },
  { id: 5, name: "HP Pavilion 15 Laptop", price: 100, image: "images/Hp-pavilion-laptop-15.png", category: "Computers", description: "Reliable laptop for work and study." },
  { id: 6, name: "MacBook Air M2", price: 199, image: "images/Apple_MacBook_Air_M2.webp", category: "Computers", description: "Apple's ultralight notebook with great battery life." },
  { id: 7, name: "Smart LED TV 50-inch", price: 49, image: "images/LG_50_Inch_50UK6470.webp", category: "Electronics", description: "Crisp 4K display with smart features." },
  { id: 8, name: "Beats Studio Headphones", price: 50, image: "images/Beats_studio_3_gray.jpg", category: "Accessories", description: "High-quality over-ear headphones." },
  { id: 9, name: "Leather Wallet", price: 20, image: "images/Leather-wallet-for-men-men.jpg", category: "Accessories", description: "Handcrafted leather wallet." },
  { id: 10, name: "Handcrafted Basket", price: 15, image: "images/Handcraft_Small_Flower_Basket.jpg", category: "Home", description: "Beautifully woven basket from artisans." },
  { id: 11, name: "African Print Shirt", price: 25, image: "images/4Pcs-African-Embroidery-Print-Dress-Cotton-Dashiki.avif", category: "Fashion", description: "Vibrant African print shirt." },
  { id: 12, name: "Desk Lamp", price: 30, image: "images/Desk_Lamp.jpeg", category: "Home", description: "Stylish adjustable desk lamp." },
  { id: 13, name: "Wireless Earbuds", price: 35, image: "images/Wireless_Earbuds.webp", category: "Accessories", description: "Compact earbuds with great sound." },
  { id: 14, name: "Portable Power Bank", price: 20, image: "images/Portable_Powerbank.jpg", category: "Electronics", description: "Keep your devices charged on the move." },
  { id: 15, name: "Google Pixel 8", price: 85, image: "https://via.placeholder.com/400x300/4285F4/ffffff?text=Google+Pixel+8", category: "Phones", description: "Google's flagship phone with AI features." },
  { id: 16, name: "OnePlus 12", price: 75, image: "https://via.placeholder.com/400x300/F50514/ffffff?text=OnePlus+12", category: "Phones", description: "Fast and smooth Android experience." },
  { id: 17, name: "Puma Sports Shoes", price: 65, image: "https://via.placeholder.com/400x300/FFCC00/000000?text=Puma+Sports", category: "Fashion", description: "Stylish athletic footwear." },
  { id: 18, name: "Tommy Hilfiger Shirt", price: 45, image: "https://via.placeholder.com/400x300/0055B8/ffffff?text=Tommy+Hilfiger", category: "Fashion", description: "Classic designer casual wear." },
  { id: 19, name: "Dell XPS 13", price: 155, image: "https://via.placeholder.com/400x300/007DB8/ffffff?text=Dell+XPS+13", category: "Computers", description: "Compact and powerful ultrabook." },
  { id: 20, name: "Lenovo ThinkPad", price: 120, image: "https://via.placeholder.com/400x300/E81E1E/ffffff?text=Lenovo+ThinkPad", category: "Computers", description: "Professional business laptop." },
  { id: 21, name: "ASUS VivoBook", price: 95, image: "https://via.placeholder.com/400x300/000000/ffffff?text=ASUS+VivoBook", category: "Computers", description: "Budget-friendly everyday laptop." },
  { id: 22, name: "Samsung 65-inch QLED", price: 180, image: "https://via.placeholder.com/400x300/1a1a1a/ffffff?text=Samsung+QLED", category: "Electronics", description: "Premium 4K QLED television." },
  { id: 23, name: "LG OLED 55-inch", price: 165, image: "https://via.placeholder.com/400x300/000000/ffffff?text=LG+OLED", category: "Electronics", description: "Ultra HD OLED display." },
  { id: 24, name: "Sony Bravia 48-inch", price: 140, image: "https://via.placeholder.com/400x300/000000/ffffff?text=Sony+Bravia", category: "Electronics", description: "High-end Sony television." },
  { id: 25, name: "Sony WH-1000XM5", price: 75, image: "https://via.placeholder.com/400x300/000000/ffffff?text=Sony+WH1000XM5", category: "Accessories", description: "Premium noise-canceling headphones." },
  { id: 26, name: "Phone Charger", price: 15, image: "https://via.placeholder.com/400x300/FFCC00/000000?text=Phone+Charger", category: "Accessories", description: "Fast charging phone charger." },
  { id: 27, name: "Screen Protector", price: 10, image: "https://via.placeholder.com/400x300/E6E6FA/000000?text=Screen+Protector", category: "Accessories", description: "Tempered glass screen protection." },
  { id: 28, name: "Wall Clock", price: 22, image: "https://via.placeholder.com/400x300/C0C0C0/000000?text=Wall+Clock", category: "Home", description: "Modern wall clock for any room." },
  { id: 29, name: "Throw Pillow", price: 18, image: "https://via.placeholder.com/400x300/FF69B4/ffffff?text=Throw+Pillow", category: "Home", description: "Comfortable decorative pillow." }
  ,
  { id: 30, name: "Modern 3-Seater Sofa", price: 120, image: "https://via.placeholder.com/400x300/8B5E3C/ffffff?text=3-Seater+Sofa", category: "Furniture", description: "Comfortable modern sofa, 3-seater with durable fabric." },
  { id: 31, name: "Solid Wood Dining Table", price: 180, image: "https://via.placeholder.com/400x300/6B4C3B/ffffff?text=Dining+Table", category: "Furniture", description: "6-seater solid wood dining table." },
  { id: 32, name: "Stand Mixer - 5L", price: 85, image: "https://via.placeholder.com/400x300/DAA520/000000?text=Stand+Mixer", category: "Kitchen", description: "Versatile 5L stand mixer for baking and cooking." },
  { id: 33, name: "Non-stick Cookware Set (7pcs)", price: 65, image: "https://via.placeholder.com/400x300/333333/ffffff?text=Cookware+Set", category: "Kitchen", description: "Durable non-stick pots and pans for everyday cooking." },
  { id: 34, name: "Microwave Oven 20L", price: 75, image: "https://via.placeholder.com/400x300/000000/ffffff?text=Microwave+20L", category: "Kitchen", description: "Compact 20L microwave oven with grill function." },
  { id: 35, name: "Queen Mattress 10in", price: 145, image: "https://via.placeholder.com/400x300/708090/ffffff?text=Queen+Mattress", category: "Furniture", description: "Comfortable 10-inch queen mattress with medium firmness." },
  { id: 36, name: "5-Shelf Bookshelf", price: 55, image: "https://via.placeholder.com/400x300/8FBC8F/ffffff?text=Bookshelf", category: "Furniture", description: "Sturdy bookshelf for living room or study." },
  { id: 37, name: "Curtain Set (2 panels)", price: 28, image: "https://via.placeholder.com/400x300/483D8B/ffffff?text=Curtain+Set", category: "Home", description: "Light-filtering curtains, set of 2 panels." },
  { id: 38, name: "Electric Kettle 1.7L", price: 22, image: "https://via.placeholder.com/400x300/FF4500/ffffff?text=Electric+Kettle", category: "Kitchen", description: "Fast-boil 1.7L electric kettle with auto shut-off." },
  { id: 39, name: "High-Speed Blender", price: 48, image: "https://via.placeholder.com/400x300/2F4F4F/ffffff?text=Blender", category: "Kitchen", description: "Powerful blender for smoothies and sauces." },
  { id: 40, name: "French Door Refrigerator 25cu", price: 650, image: "https://via.placeholder.com/400x300/C0C0C0/000000?text=Refrigerator", category: "Appliances", description: "25cu ft French door fridge with ice maker." },
  { id: 41, name: "Electric Drill 20V", price: 45, image: "https://via.placeholder.com/400x300/FF6347/ffffff?text=Drill", category: "Tools", description: "Cordless 20V electric drill for DIY projects." },
  { id: 42, name: "Washing Machine 8kg", price: 320, image: "https://via.placeholder.com/400x300/696969/ffffff?text=Washing+Machine", category: "Appliances", description: "Front-load washing machine, 8kg capacity." },
  { id: 43, name: "Mountain Bicycle 21-Speed", price: 180, image: "https://via.placeholder.com/400x300/228B22/ffffff?text=Mountain+Bike", category: "Vehicles", description: "21-speed mountain bike with suspension." },
  { id: 44, name: "Electric Scooter 30km range", price: 220, image: "https://via.placeholder.com/400x300/FF1493/ffffff?text=E-Scooter", category: "Vehicles", description: "Portable electric scooter, 30km range, top speed 25km/h." },
  { id: 45, name: "Car Jump Starter 2000A", price: 35, image: "https://via.placeholder.com/400x300/FFD700/000000?text=Jump+Starter", category: "Auto Accessories", description: "Portable 2000A car jump starter with USB charging." },
  { id: 46, name: "Air Compressor 150psi", price: 60, image: "https://via.placeholder.com/400x300/333333/ffffff?text=Air+Compressor", category: "Tools", description: "Portable 150psi air compressor for pumps and tools." },
  { id: 47, name: "Electric Generator 3500W", price: 280, image: "https://via.placeholder.com/400x300/8B4513/ffffff?text=Generator", category: "Tools", description: "3500W portable generator for home backup." },
  { id: 48, name: "Road Bicycle Carbon", price: 320, image: "https://via.placeholder.com/400x300/DC143C/ffffff?text=Road+Bike", category: "Vehicles", description: "Carbon frame road bike, 16-speed, lightweight." },
  { id: 49, name: "Motorcycle Helmet DOT", price: 55, image: "https://via.placeholder.com/400x300/000000/ffffff?text=Helmet", category: "Auto Accessories", description: "DOT-certified motorcycle helmet, full-face." },
  { id: 50, name: "Car Air Filter Pack (3)", price: 18, image: "https://via.placeholder.com/400x300/CCCCCC/000000?text=Air+Filters", category: "Auto Accessories", description: "Pack of 3 car air filters, universal fit." },
  { id: 51, name: "Smart Thermostat WiFi", price: 95, image: "https://via.placeholder.com/400x300/1E90FF/ffffff?text=Thermostat", category: "Home", description: "WiFi-enabled smart thermostat with scheduling." },
  { id: 52, name: "Oven Toaster Convection 4-Slice", price: 65, image: "https://via.placeholder.com/400x300/8B7355/ffffff?text=Toaster+Oven", category: "Kitchen", description: "Convection toaster oven for baking and roasting." },
  { id: 53, name: "Coffee Maker 12-cup", price: 32, image: "https://via.placeholder.com/400x300/6F4E37/ffffff?text=Coffee+Maker", category: "Kitchen", description: "Programmable coffee maker, 12-cup capacity." },
  { id: 54, name: "Food Processor 10-cup", price: 58, image: "https://via.placeholder.com/400x300/DAA520/000000?text=Food+Processor", category: "Kitchen", description: "Multi-function food processor with stainless bowl." },
  { id: 55, name: "Dishwasher 16-place", price: 410, image: "https://via.placeholder.com/400x300/C0C0C0/000000?text=Dishwasher", category: "Appliances", description: "16-place setting dishwasher with energy save." },
  { id: 56, name: "Bed Frame Queen Metal", price: 135, image: "https://via.placeholder.com/400x300/8B4513/ffffff?text=Bed+Frame", category: "Furniture", description: "Queen-size metal bed frame with headboard." },
  { id: 57, name: "Office Chair Ergonomic", price: 145, image: "https://via.placeholder.com/400x300/000000/ffffff?text=Office+Chair", category: "Furniture", description: "Ergonomic office chair with lumbar support and armrests." },
  { id: 58, name: "Standing Desk Adjustable", price: 220, image: "https://via.placeholder.com/400x300/696969/ffffff?text=Standing+Desk", category: "Furniture", description: "Electric adjustable standing desk, 48x24in." },
  { id: 59, name: "Ceiling Fan 52in 5-blade", price: 75, image: "https://via.placeholder.com/400x300/A9A9A9/000000?text=Ceiling+Fan", category: "Home", description: "5-blade ceiling fan with light kit and remote." },
  { id: 60, name: "Humidifier Ultrasonic 3L", price: 28, image: "https://via.placeholder.com/400x300/87CEEB/000000?text=Humidifier", category: "Home", description: "3L ultrasonic humidifier for bedrooms." },
  { id: 61, name: "Air Purifier HEPA Filter", price: 85, image: "https://via.placeholder.com/400x300/F0F8FF/000000?text=Air+Purifier", category: "Home", description: "HEPA air purifier for allergens and dust." },
  { id: 62, name: "Vacuum Cleaner Upright", price: 165, image: "https://via.placeholder.com/400x300/2F4F4F/ffffff?text=Vacuum", category: "Home", description: "Upright vacuum cleaner with HEPA filter." },
  { id: 63, name: "Steam Mop Hard Floor", price: 95, image: "https://via.placeholder.com/400x300/696969/ffffff?text=Steam+Mop", category: "Home", description: "Steam mop for hard floor cleaning without chemicals." },
  { id: 64, name: "Pressure Washer 2000PSI", price: 165, image: "https://via.placeholder.com/400x300/FF6347/ffffff?text=Pressure+Washer", category: "Tools", description: "2000PSI portable pressure washer for outdoor cleaning." },
  { id: 65, name: "Leaf Blower 40V Cordless", price: 78, image: "https://via.placeholder.com/400x300/228B22/ffffff?text=Leaf+Blower", category: "Tools", description: "Cordless 40V leaf blower for yard maintenance." },
  { id: 66, name: "Lawn Mower Robot Auto", price: 380, image: "https://via.placeholder.com/400x300/32CD32/ffffff?text=Robot+Mower", category: "Tools", description: "Autonomous robotic lawn mower with app control." },
  { id: 67, name: "Garden Hose Reel 100ft", price: 35, image: "https://via.placeholder.com/400x300/90EE90/ffffff?text=Hose+Reel", category: "Tools", description: "Wall-mounted 100ft garden hose reel with spray." },
  { id: 68, name: "Paint Sprayer Electric", price: 42, image: "https://via.placeholder.com/400x300/FF69B4/ffffff?text=Paint+Sprayer", category: "Tools", description: "Electric paint sprayer for walls and furniture." },
  { id: 69, name: "Hand Tool Set 100-piece", price: 55, image: "https://via.placeholder.com/400x300/8B0000/ffffff?text=Tool+Set", category: "Tools", description: "Comprehensive 100-piece hand tool set with storage." },
  { id: 70, name: "Ladder Aluminum 6ft", price: 45, image: "https://via.placeholder.com/400x300/C0C0C0/000000?text=Ladder", category: "Tools", description: "6ft aluminum ladder, lightweight and portable." },
  { id: 71, name: "Oscillating Fan 12in", price: 22, image: "https://via.placeholder.com/400x300/D3D3D3/000000?text=Fan", category: "Home", description: "12-inch oscillating fan with 3 speed settings." },
  { id: 72, name: "Space Heater 1500W", price: 35, image: "https://via.placeholder.com/400x300/FF4500/ffffff?text=Space+Heater", category: "Home", description: "1500W ceramic space heater with thermostat." },
  { id: 73, name: "Portable AC Unit 10000BTU", price: 280, image: "https://via.placeholder.com/400x300/00CED1/ffffff?text=AC+Unit", category: "Home", description: "Portable air conditioner, 10000BTU, whisper quiet." },
  { id: 74, name: "Power Strip 6-outlet surge", price: 12, image: "https://via.placeholder.com/400x300/333333/ffffff?text=Power+Strip", category: "Electronics", description: "6-outlet surge protector power strip." },
  { id: 75, name: "Extension Cord 50ft 12AWG", price: 18, image: "https://via.placeholder.com/400x300/FF6347/ffffff?text=Extension+Cord", category: "Electronics", description: "Heavy-duty 50ft extension cord, 12AWG gauge." },
  { id: 76, name: "USB Hub 7-port powered", price: 22, image: "https://via.placeholder.com/400x300/000000/ffffff?text=USB+Hub", category: "Electronics", description: "7-port powered USB hub with individual switches." },
  { id: 77, name: "HDMI Cable 4K 25ft", price: 14, image: "https://via.placeholder.com/400x300/FFD700/000000?text=HDMI+Cable", category: "Electronics", description: "4K HDMI cable, 25ft length, gold-plated connectors." },
  { id: 78, name: "Webcam 1080p HD USB", price: 32, image: "https://via.placeholder.com/400x300/000000/ffffff?text=Webcam", category: "Electronics", description: "1080p HD webcam with auto-focus and mic." },
  { id: 79, name: "Desk Lamp LED Adjustable", price: 28, image: "https://via.placeholder.com/400x300/FFD700/000000?text=LED+Lamp", category: "Home", description: "LED desk lamp with 3 color temperatures and USB." },
  { id: 80, name: "Night Light Motion Sensor", price: 8, image: "https://via.placeholder.com/400x300/FF69B4/ffffff?text=Night+Light", category: "Home", description: "Motion-sensor night light, energy efficient." }
];

// Load products from backend
async function loadProducts() {
  try {
    const res = await fetch(`${API_BASE}/products`);
    if (res.ok) {
      PRODUCTS = await res.json();
      console.log('✓ Loaded', PRODUCTS.length, 'products from backend');
      return;
    }
  } catch (e) {
    console.warn('Backend unavailable, using fallback products:', e.message);
  }
  PRODUCTS = FALLBACK_PRODUCTS;
}

// Utilities
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

// CART (localStorage based)
let CART = JSON.parse(localStorage.getItem('e4a_cart')) || [];
function saveCart() { localStorage.setItem('e4a_cart', JSON.stringify(CART)); updateCartCount(); }
function updateCartCount() {
  const el = document.getElementById('cart-count') || document.querySelector('#cart-count');
  if (el) el.textContent = CART.length;
}

// RENDERERS
function renderFeatured() {
  const grid = document.getElementById('featured-grid');
  if (!grid) return;
  grid.innerHTML = '';
  PRODUCTS.slice(0, 8).forEach(p => grid.appendChild(productCardElement(p)));
}

function renderShop(items = PRODUCTS) {
  const grid = document.getElementById('shop-grid') || document.getElementById('shop-products') || document.getElementById('shop-grid');
  if (!grid) return;
  grid.innerHTML = '';
  items.forEach(p => grid.appendChild(productCardElement(p, true)));
}

function productCardElement(p, showCategory = false) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.innerHTML = `
    <img src="${p.image}" alt="${p.name}" loading="lazy" />
    <h3>${p.name}</h3>
    <p class="muted">${showCategory ? p.category : ''}</p>
    <div class="product-meta">
      <div class="price">$${p.price}</div>
      <div>
        <button class="btn small" onclick="viewProduct(${p.id})">View</button>
        <button class="btn gold" onclick="addToCart(${p.id})">Add</button>
      </div>
    </div>`;
  return card;
}

// PRODUCT DETAIL
function viewProduct(id) {
  window.location = `product.html?id=${id}`;
}

function renderProductDetail(id) {
  const container = document.getElementById('product-detail');
  if (!container) return;
  const product = PRODUCTS.find(p => p.id === Number(id));
  if (!product) {
    container.innerHTML = '<p>Product not found.</p>'; return;
  }
  container.innerHTML = `
    <div class="content-card product-full">
      <div style="display:flex;gap:20px;flex-wrap:wrap">
        <img src="${product.image}" alt="${product.name}" style="max-width:480px;width:100%;border-radius:8px" />
        <div style="flex:1">
          <h1>${product.name}</h1>
          <p class="muted">${product.category}</p>
          <h2 style="color:#06112b;margin-top:12px">$${product.price}</h2>
          <p style="margin:14px 0">${product.description}</p>
          <div style="display:flex;gap:10px">
            <button class="btn gold" onclick="addToCart(${product.id})">Add to Cart</button>
            <button class="btn" onclick="window.location='shop.html'">Continue Shopping</button>
          </div>
        </div>
      </div>
    </div>`;
}

// CART FUNCTIONS
function addToCart(id) {
  const p = PRODUCTS.find(x => x.id === Number(id));
  if (!p) return alert('Product not found');
  CART.push(p);
  saveCart();
  alert(`${p.name} added to cart`);
}

function removeFromCart(id) {
  CART = CART.filter(x => x.id !== Number(id));
  saveCart();
  renderCartPage();
}

function renderCartPage() {
  const container = document.getElementById('cart-items');
  const summary = document.getElementById('cart-summary');
  if (!container || !summary) return;
  container.innerHTML = '';
  let total = 0;
  CART.forEach(item => {
    total += item.price;
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <div style="flex:1">
        <h3>${item.name}</h3>
        <p class="muted">${item.category}</p>
      </div>
      <div style="text-align:right">
        <div>$${item.price}</div>
        <button class="btn" onclick="removeFromCart(${item.id})">Remove</button>
      </div>`;
    container.appendChild(el);
  });
  summary.innerHTML = `<div class="cart-summary"><strong>Total:</strong> $${total}</div>`;
}

// Orders (localStorage-based simple checkout)
function getOrders() {
  return JSON.parse(localStorage.getItem('e4a_orders')) || [];
}

function saveOrders(orders) {
  localStorage.setItem('e4a_orders', JSON.stringify(orders));
}

function checkout() {
  if (!CART || CART.length === 0) return alert('Your cart is empty');
  const current = getCurrentUser();
  let contact = current ? { name: current.name, email: current.email } : null;
  if (!contact) {
    const name = prompt('Enter your full name for this order:');
    if (!name) return alert('Checkout cancelled');
    const email = prompt('Enter your email for order confirmation:');
    if (!email) return alert('Checkout cancelled');
    contact = { name, email };
  }

  const total = CART.reduce((s, i) => s + i.price, 0);
  const orderData = { items: CART.slice(), contact, total };

  // Try backend first
  fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  })
    .then(res => res.json())
    .then(data => {
      if (data.success || data.order) {
        CART = [];
        saveCart();
        renderOrderConfirmation(data.order);
      } else {
        throw new Error(data.error || 'Order failed');
      }
    })
    .catch(err => {
      console.warn('Backend unavailable, saving locally:', err.message);
      // Fallback to localStorage
      const id = 'ORD-' + Date.now();
      const order = { id, items: CART.slice(), total, contact, createdAt: new Date().toISOString() };
      const orders = getOrders();
      orders.push(order);
      saveOrders(orders);
      CART = [];
      saveCart();
      renderOrderConfirmation(order);
    });
}

function renderOrderConfirmation(order) {
  const main = document.querySelector('main');
  if (!main) return alert('Order placed: ' + order.id);
  main.innerHTML = `
    <section class="content-card order-confirmation">
      <h1>Thank you — Order ${order.id}</h1>
      <p>We've received your order. A confirmation will be sent to <strong>${order.contact.email}</strong>.</p>
      <h3>Order summary</h3>
      <ul style="text-align:left;margin:12px 0">${order.items.map(it => `<li>${it.name} — $${it.price}</li>`).join('')}</ul>
      <p><strong>Total: $${order.total}</strong></p>
      <div style="display:flex;gap:10px;margin-top:18px">
        <a class="btn" href="shop.html">Continue Shopping</a>
        <a class="btn gold" href="index.html">Go Home</a>
      </div>
    </section>`;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// SEARCH & FILTER
function liveSearch(query) {
  const q = String(query || '').trim().toLowerCase();
  // if empty, show all products
  if (!q) {
    renderShop(PRODUCTS);
    return;
  }
  // search across name, category, description
  const matches = PRODUCTS.filter(p => {
    const searchText = (p.name + ' ' + p.category + ' ' + (p.description || '')).toLowerCase();
    return searchText.includes(q);
  });
  renderShop(matches);
  // if shop page, show result count
  const shopGrid = document.getElementById('shop-grid');
  if (shopGrid && matches.length === 0) {
    shopGrid.innerHTML = '<p style="text-align:center;color:#666;padding:40px">No products found for "' + q + '". Try a different search.</p>';
  }
}

function filterByCategory(cat) {
  // clear any search input on category filter
  const searchInput = document.getElementById('global-search-shop');
  if (searchInput) searchInput.value = '';
  
  if (!cat || cat === 'All') {
    renderShop(PRODUCTS);
  } else {
    const filtered = PRODUCTS.filter(p => p.category === cat);
    renderShop(filtered);
  }
}

// CATEGORIES BAR
function renderCategories() {
  const bar = document.getElementById('categories-bar');
  const select = document.getElementById('category-filter');
  if (!bar && !select) return;
  const cats = ['All', ...Array.from(new Set(PRODUCTS.map(p => p.category)))];
  if (bar) {
    bar.innerHTML = '';
    cats.forEach(c => {
      const btn = document.createElement('button');
      btn.className = 'cat';
      btn.textContent = c;
      btn.onclick = () => { filterByCategory(c); window.scrollTo({top: document.querySelector('.products').offsetTop-80, behavior:'smooth'}); };
      bar.appendChild(btn);
    });
  }
  if (select) {
    select.innerHTML = cats.map(c => `<option value="${c}">${c}</option>`).join('');
    select.onchange = (e) => filterByCategory(e.target.value);
  }
}

// AUTH & USER MANAGEMENT (Backend-integrated)
function getCurrentUser() {
  const token = localStorage.getItem('e4a_token');
  const user = localStorage.getItem('e4a_user');
  if (!token || !user) return null;
  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
}

function handleSignup() {
  const form = document.getElementById('signup-form');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const errorEl = document.getElementById('signup-error');

    if (!name || !email || !password) {
      if (errorEl) { errorEl.textContent = 'All fields required'; errorEl.style.display = 'block'; }
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (res.ok && (data.success || data.token)) {
        localStorage.setItem('e4a_token', data.token || '');
        localStorage.setItem('e4a_user', JSON.stringify(data.user || { name, email }));
        alert('Account created! Redirecting...');
        window.location = 'index.html';
      } else {
        if (errorEl) { errorEl.textContent = data.error || 'Signup failed'; errorEl.style.display = 'block'; }
      }
    } catch (err) {
      console.error('Signup error:', err);
      if (errorEl) { errorEl.textContent = 'Network error. Try again.'; errorEl.style.display = 'block'; }
    }
  });
}

function handleSignin() {
  const form = document.getElementById('signin-form');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signin-email').value.trim();
    const password = document.getElementById('signin-password').value;
    const errorEl = document.getElementById('signin-error');

    if (!email || !password) {
      if (errorEl) { errorEl.textContent = 'All fields required'; errorEl.style.display = 'block'; }
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && (data.success || data.token)) {
        localStorage.setItem('e4a_token', data.token || '');
        localStorage.setItem('e4a_user', JSON.stringify(data.user || { email }));
        alert('Signed in! Redirecting...');
        window.location = 'index.html';
      } else {
        if (errorEl) { errorEl.textContent = data.error || 'Invalid credentials'; errorEl.style.display = 'block'; }
      }
    } catch (err) {
      console.error('Signin error:', err);
      if (errorEl) { errorEl.textContent = 'Network error. Try again.'; errorEl.style.display = 'block'; }
    }
  });
}

function handleContact() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Message sent (demo). We will contact you soon.');
    form.reset();
  });
}

// INIT - run on each page load
function initE4A() {
  // Load products from backend first, then render
  loadProducts().then(() => {
    updateCartCount();
    renderCategories();
    renderFeatured();
    renderShop();

    // ... rest of initialization (search, auth, etc) ...
    setupSearchHandlers();
    setupPageHandlers();
  });
}

function setupSearchHandlers() {
  // Global search on home page (global-search)
  const gs = document.getElementById('global-search');
  if (gs) {
    // Live search only if on a page with shop grid (home + shop)
    gs.addEventListener('input', (e) => {
      if (document.getElementById('shop-grid')) {
        liveSearch(e.target.value);
      }
    });
    
    // Search button click: navigate to shop with query if on home, or search directly if on shop
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        const q = String(gs.value || '').trim();
        if (!q) return;
        if (window.location.pathname.includes('shop.html')) {
          liveSearch(q);
        } else {
          window.location = `shop.html?q=${encodeURIComponent(q)}`;
        }
      });
    }
    
    // Enter key support
    gs.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const q = String(gs.value || '').trim();
        if (!q) return;
        if (window.location.pathname.includes('shop.html')) {
          liveSearch(q);
        } else {
          window.location = `shop.html?q=${encodeURIComponent(q)}`;
        }
      }
    });
  }

  // Shop page search (global-search-shop)
  const gss = document.getElementById('global-search-shop');
  if (gss) {
    gss.addEventListener('input', (e) => liveSearch(e.target.value));
    
    const shopSearchBtn = document.getElementById('search-btn-shop');
    if (shopSearchBtn) {
      shopSearchBtn.addEventListener('click', () => liveSearch(gss.value));
    }
    
    gss.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        liveSearch(gss.value);
      }
    });
  }

  // Apply URL query parameter (?q=) on shop page
  try {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q && window.location.pathname.includes('shop.html')) {
      const shopInput = document.getElementById('global-search-shop');
      if (shopInput) shopInput.value = decodeURIComponent(q);
      liveSearch(q);
      // scroll to products
      setTimeout(() => {
        const productsSection = document.querySelector('.products');
        if (productsSection) {
          window.scrollTo({ top: productsSection.offsetTop - 80, behavior: 'smooth' });
        }
      }, 100);
    }
  } catch (err) {
    console.warn('URL param parsing error:', err);
  }
}

function setupPageHandlers() {
  handleSignin();
  handleSignup();
  handleContact();

  // product detail page render
  if (window.location.pathname.includes('product.html')) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    renderProductDetail(id);
  }

  // cart page render
  if (window.location.pathname.includes('cart.html')) {
    renderCartPage();
    const clearBtn = document.getElementById('clear-cart');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        CART = [];
        saveCart();
        renderCartPage();
      });
    }
    const checkoutBtn = document.getElementById('checkout');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', checkout);
    }
  }
}

// Run init on DOMContentLoaded
document.addEventListener('DOMContentLoaded', initE4A);
