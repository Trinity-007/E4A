const express = require('express');
const Order = require('../models/Order');

const router = express.Router();

router.post('/', async (req, res) => {
  const { items, contact, total } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'No items' });
  const order = new Order({ items, contact, total });
  await order.save();
  res.json({ success: true, order });
});

router.get('/', async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 }).limit(200);
  res.json(orders);
});

module.exports = router;
