const express = require('express');
const APIKey = require('../models/APIKey');
const Product = require('../models/Product');
const Order = require('../models/Order');
const crypto = require('crypto');

const router = express.Router();

// Generate API Key
router.post('/keys', async (req, res) => {
  try {
    const { sellerId, keyName, permissions } = req.body;

    if (!sellerId || !keyName) {
      return res.status(400).json({ error: 'Missing sellerId or keyName' });
    }

    // Generate unique API key
    const apiKey = crypto.randomBytes(32).toString('hex');

    const newKey = new APIKey({
      sellerId,
      keyName,
      apiKey,
      permissions: permissions || ['read:products', 'read:orders']
    });

    const saved = await newKey.save();

    // Return key only once (user should store securely)
    res.json({ success: true, key: saved, apiKey, message: 'Save this API key securely!' });
  } catch (err) {
    console.error('[api] error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get seller's API keys
router.get('/keys/:sellerId', async (req, res) => {
  try {
    const { sellerId } = req.params;
    const keys = await APIKey.find({ sellerId }).select('-apiKey'); // don't return actual key
    res.json(keys);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Revoke API key
router.delete('/keys/:keyId', async (req, res) => {
  try {
    const { keyId } = req.params;
    const key = await APIKey.findById(keyId);
    if (!key) return res.status(404).json({ error: 'Key not found' });

    key.isActive = false;
    await key.save();

    res.json({ success: true, message: 'API key revoked' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Middleware: Validate API Key
async function authenticateAPIKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) {
    return res.status(401).json({ error: 'Missing API key' });
  }

  const keyDoc = await APIKey.findOne({ apiKey, isActive: true });
  if (!keyDoc) {
    return res.status(403).json({ error: 'Invalid or revoked API key' });
  }

  // Update last used
  keyDoc.lastUsedAt = new Date();
  await keyDoc.save();

  req.apiKey = keyDoc;
  req.sellerId = keyDoc.sellerId;
  next();
}

// API: Get seller's products (public endpoint, but returns seller-specific data)
router.get('/products', authenticateAPIKey, async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.sellerId })
      .select('name price category description image sellerId');

    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Get seller's orders
router.get('/orders', authenticateAPIKey, async (req, res) => {
  try {
    // Find orders that include this seller's products
    const orders = await Order.find({})
      .populate('items')
      .limit(100);

    // Filter for seller's products only
    const sellerOrders = orders.filter(order =>
      order.items && order.items.some(item => item.sellerId && item.sellerId.toString() === req.sellerId.toString())
    );

    res.json({
      success: true,
      count: sellerOrders.length,
      orders: sellerOrders
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Update product listing
router.put('/products/:productId', authenticateAPIKey, async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, price, description, image } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Verify seller owns this product
    if (product.sellerId.toString() !== req.sellerId.toString()) {
      return res.status(403).json({ error: 'Unauthorized to update this product' });
    }

    // Update fields
    if (name) product.name = name;
    if (price) product.price = price;
    if (description) product.description = description;
    if (image) product.image = image;

    const updated = await product.save();
    res.json({ success: true, product: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API Documentation endpoint
router.get('/docs', (req, res) => {
  res.json({
    message: 'E4A Seller API Documentation',
    baseUrl: 'http://localhost:3000/api/seller',
    authentication: {
      type: 'Header',
      header: 'x-api-key',
      example: 'x-api-key: YOUR_API_KEY_HERE'
    },
    endpoints: [
      {
        method: 'GET',
        path: '/products',
        description: 'Get all your products',
        requires: 'read:products'
      },
      {
        method: 'GET',
        path: '/orders',
        description: 'Get orders for your products',
        requires: 'read:orders'
      },
      {
        method: 'PUT',
        path: '/products/:productId',
        description: 'Update product details',
        requires: 'write:products'
      },
      {
        method: 'POST',
        path: '/keys',
        description: 'Generate new API key',
        body: { sellerId: 'string', keyName: 'string', permissions: 'array' }
      }
    ]
  });
});

module.exports = router;
