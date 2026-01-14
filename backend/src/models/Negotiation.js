const mongoose = require('mongoose');

const negotiationSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // pricing
  initialPrice: { type: Number, required: true },
  currentOfferPrice: { type: Number, required: true },
  sellerAcceptedPrice: { type: Number, default: null },
  
  // status
  status: {
    type: String,
    enum: ['active', 'accepted', 'rejected', 'closed'],
    default: 'active'
  },
  
  // messages/counter-offers
  messages: [
    {
      senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      senderType: { type: String, enum: ['buyer', 'seller'] },
      content: String,
      offerPrice: Number,
      timestamp: { type: Date, default: Date.now }
    }
  ],
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Negotiation', negotiationSchema);
