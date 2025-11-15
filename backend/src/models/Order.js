const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: [{ type: Object }],
  total: { type: Number, default: 0 },
  contact: { type: Object },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
