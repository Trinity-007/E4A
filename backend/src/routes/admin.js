const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Verification = require('../models/Verification');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_this';

// Middleware to verify admin token
const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await Admin.findById(decoded.id);
    if (!admin) return res.status(401).json({ error: 'Admin not found' });
    
    req.admin = admin;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('[admin/login] attempt for email=', email);
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }
    
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Update last login
    admin.lastLogin = new Date();
    await admin.save();
    
    const token = jwt.sign({ id: admin._id, email: admin.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      success: true,
      admin: {
        _id: admin._id.toString(),
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions
      },
      token
    });
  } catch (err) {
    console.error('[admin/login] error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get Dashboard Stats
router.get('/dashboard', verifyAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const pendingVerifications = await Verification.countDocuments({ status: 'pending' });
    
    // Recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name email');
    
    // Recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt');
    
    res.json({
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        pendingVerifications
      },
      recentOrders,
      recentUsers
    });
  } catch (err) {
    console.error('[admin/dashboard] error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get All Users
router.get('/users', verifyAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;
    
    const users = await User.find()
      .select('-password')
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });
    
    const total = await User.countDocuments();
    
    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('[admin/users] error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete User
router.delete('/users/:userId', verifyAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    console.error('[admin/delete-user] error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get All Orders
router.get('/orders', verifyAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;
    
    const orders = await Order.find()
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .populate('userId', 'name email');
    
    const total = await Order.countDocuments();
    
    res.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('[admin/orders] error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update Order Status
router.put('/orders/:orderId', verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    );
    
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) {
    console.error('[admin/update-order] error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get All Products
router.get('/products', verifyAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;
    
    const products = await Product.find()
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });
    
    const total = await Product.countDocuments();
    
    res.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('[admin/products] error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete Product
router.delete('/products/:productId', verifyAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    console.error('[admin/delete-product] error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get Pending Verifications
router.get('/verifications', verifyAdmin, async (req, res) => {
  try {
    const status = req.query.status || 'pending';
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;
    
    const verifications = await Verification.find({ status })
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .populate('userId', 'name email');
    
    const total = await Verification.countDocuments({ status });
    
    res.json({
      verifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('[admin/verifications] error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Approve Verification
router.post('/verifications/:verificationId/approve', verifyAdmin, async (req, res) => {
  try {
    const verification = await Verification.findByIdAndUpdate(
      req.params.verificationId,
      {
        status: 'approved',
        reviewedBy: req.admin._id,
        reviewedAt: new Date()
      },
      { new: true }
    );
    
    if (!verification) return res.status(404).json({ error: 'Verification not found' });
    res.json({ success: true, verification });
  } catch (err) {
    console.error('[admin/approve-verification] error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Reject Verification
router.post('/verifications/:verificationId/reject', verifyAdmin, async (req, res) => {
  try {
    const { reason } = req.body;
    const verification = await Verification.findByIdAndUpdate(
      req.params.verificationId,
      {
        status: 'rejected',
        rejectionReason: reason,
        reviewedBy: req.admin._id,
        reviewedAt: new Date()
      },
      { new: true }
    );
    
    if (!verification) return res.status(404).json({ error: 'Verification not found' });
    res.json({ success: true, verification });
  } catch (err) {
    console.error('[admin/reject-verification] error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
