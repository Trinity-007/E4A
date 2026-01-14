const express = require('express');
const Negotiation = require('../models/Negotiation');
const Product = require('../models/Product');
const User = require('../models/User');

const router = express.Router();

// Create a new negotiation (buyer initiates)
router.post('/', async (req, res) => {
  try {
    const { productId, offeredPrice } = req.body;
    const buyerId = req.body.buyerId; // in production, extract from JWT token
    
    console.log('[negotiations] Creating negotiation - productId:', productId, 'type:', typeof productId, 'buyerId:', buyerId);
    
    if (!productId || !offeredPrice || !buyerId) {
      return res.status(400).json({ error: 'Missing productId, offeredPrice, or buyerId' });
    }

    // Try to find product by _id first (MongoDB ObjectId), then by numeric id
    let product;
    try {
      product = await Product.findById(productId);
      console.log('[negotiations] Found product by _id:', product?._id);
    } catch (e) {
      // If findById fails (invalid ObjectId format), try finding by numeric id
      console.log('[negotiations] findById failed, trying numeric id:', e.message);
      product = await Product.findOne({ id: Number(productId) });
      console.log('[negotiations] Found product by numeric id:', product?._id);
    }
    
    if (!product) {
      console.log('[negotiations] Product not found for productId:', productId);
      return res.status(404).json({ error: 'Product not found' });
    }

    // Use MongoDB _id for the negotiation
    const productIdToStore = product._id;

    // Create negotiation
    const negotiation = new Negotiation({
      productId: productIdToStore,
      buyerId,
      sellerId: product.sellerId || 'system', // assume products have sellerId
      initialPrice: product.price,
      currentOfferPrice: offeredPrice,
      messages: [{
        senderId: buyerId,
        senderType: 'buyer',
        content: `Interested in buying at $${offeredPrice}`,
        offerPrice: offeredPrice
      }]
    });

    const saved = await negotiation.save();
    console.log('[negotiations] Negotiation created:', saved._id);
    res.json({ success: true, negotiation: saved });
  } catch (err) {
    console.error('[negotiations] error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get negotiations for a user (buyer or seller)
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get negotiations where user is buyer or seller
    const negotiations = await Negotiation.find({
      $or: [{ buyerId: userId }, { sellerId: userId }]
    })
      .populate('productId', 'name price image')
      .populate('buyerId', 'name email')
      .populate('sellerId', 'name email')
      .sort({ updatedAt: -1 });

    res.json(negotiations);
  } catch (err) {
    console.error('[negotiations] error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get a specific negotiation
router.get('/:id', async (req, res) => {
  try {
    const negotiation = await Negotiation.findById(req.params.id)
      .populate('productId', 'name price image description')
      .populate('buyerId', 'name email')
      .populate('sellerId', 'name email');

    if (!negotiation) return res.status(404).json({ error: 'Negotiation not found' });
    res.json(negotiation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send a counter-offer or message
router.post('/:id/message', async (req, res) => {
  try {
    const { id } = req.params;
    const { senderId, senderType, content, offerPrice } = req.body;

    const negotiation = await Negotiation.findById(id);
    if (!negotiation) return res.status(404).json({ error: 'Negotiation not found' });

    // validate sender (buyer or seller only)
    if (senderType === 'buyer' && negotiation.buyerId.toString() !== senderId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    if (senderType === 'seller' && negotiation.sellerId.toString() !== senderId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // add message
    negotiation.messages.push({
      senderId,
      senderType,
      content,
      offerPrice: offerPrice || negotiation.currentOfferPrice
    });

    // update current offer if this is a counter-offer
    if (offerPrice) {
      negotiation.currentOfferPrice = offerPrice;
    }

    negotiation.updatedAt = new Date();
    const updated = await negotiation.save();

    res.json({ success: true, negotiation: updated });
  } catch (err) {
    console.error('[negotiations] error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Accept negotiation (seller accepts offered price)
router.post('/:id/accept', async (req, res) => {
  try {
    const { id } = req.params;
    const { sellerId } = req.body;

    const negotiation = await Negotiation.findById(id);
    if (!negotiation) return res.status(404).json({ error: 'Negotiation not found' });

    // validate seller
    if (negotiation.sellerId.toString() !== sellerId) {
      return res.status(403).json({ error: 'Only seller can accept offer' });
    }

    negotiation.status = 'accepted';
    negotiation.sellerAcceptedPrice = negotiation.currentOfferPrice;
    negotiation.updatedAt = new Date();
    const updated = await negotiation.save();

    res.json({ success: true, negotiation: updated, message: 'Offer accepted!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reject negotiation
router.post('/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    const { sellerId } = req.body;

    const negotiation = await Negotiation.findById(id);
    if (!negotiation) return res.status(404).json({ error: 'Negotiation not found' });

    // validate seller
    if (negotiation.sellerId.toString() !== sellerId) {
      return res.status(403).json({ error: 'Only seller can reject offer' });
    }

    negotiation.status = 'rejected';
    negotiation.updatedAt = new Date();
    const updated = await negotiation.save();

    res.json({ success: true, negotiation: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
