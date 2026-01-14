const mongoose = require('mongoose');

const apiKeySchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  keyName: { type: String, required: true }, // e.g., "Production API"
  apiKey: { type: String, required: true, unique: true }, // hashed in production
  
  permissions: {
    type: [String],
    enum: ['read:products', 'read:orders', 'write:products', 'webhook:events'],
    default: ['read:products', 'read:orders']
  },
  
  isActive: { type: Boolean, default: true },
  lastUsedAt: Date,
  
  webhookUrl: String, // for push events (order updates, etc)
  
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) } // 1 year
});

module.exports = mongoose.model('APIKey', apiKeySchema);
