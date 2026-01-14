const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  verificationType: {
    type: String,
    enum: ['identity', 'phone', 'address', 'seller_business'],
    required: true
  },
  
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  
  // verification details
  documentUrl: String, // uploaded document/photo
  documentType: String, // id card, passport, etc.
  verificationCode: String, // generated code for manual verification
  
  // admin notes
  rejectionReason: String,
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: Date,
  
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) } // 1 year
});

module.exports = mongoose.model('Verification', verificationSchema);
