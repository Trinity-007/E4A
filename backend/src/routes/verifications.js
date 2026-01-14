const express = require('express');
const Verification = require('../models/Verification');

const router = express.Router();

// Request verification
router.post('/', async (req, res) => {
  try {
    const { userId, verificationType, documentUrl, documentType } = req.body;

    if (!userId || !verificationType) {
      return res.status(400).json({ error: 'Missing userId or verificationType' });
    }

    // Check if user already has pending or approved verification of this type
    const existing = await Verification.findOne({
      userId,
      verificationType,
      $or: [{ status: 'pending' }, { status: 'approved' }]
    });

    if (existing && existing.status === 'approved') {
      return res.status(400).json({ error: 'User already verified for ' + verificationType });
    }

    // Generate verification code
    const verificationCode = Math.random().toString(36).substring(2, 10).toUpperCase();

    const verification = new Verification({
      userId,
      verificationType,
      documentUrl,
      documentType,
      verificationCode
    });

    const saved = await verification.save();

    res.json({ success: true, verification: saved, message: 'Verification request submitted' });
  } catch (err) {
    console.error('[verifications] error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get verification status for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const verifications = await Verification.find({ userId });
    res.json(verifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Get all pending verifications
router.get('/admin/pending', async (req, res) => {
  try {
    const pending = await Verification.find({ status: 'pending' })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(pending);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Approve verification
router.post('/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { adminId } = req.body;

    const verification = await Verification.findById(id);
    if (!verification) return res.status(404).json({ error: 'Verification not found' });

    verification.status = 'approved';
    verification.reviewedBy = adminId;
    verification.reviewedAt = new Date();

    const updated = await verification.save();

    res.json({ success: true, verification: updated, message: 'Verification approved' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Reject verification
router.post('/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    const { adminId, reason } = req.body;

    const verification = await Verification.findById(id);
    if (!verification) return res.status(404).json({ error: 'Verification not found' });

    verification.status = 'rejected';
    verification.reviewedBy = adminId;
    verification.reviewedAt = new Date();
    verification.rejectionReason = reason || 'Document rejected';

    const updated = await verification.save();

    res.json({ success: true, verification: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
