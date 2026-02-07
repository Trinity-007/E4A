const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const emailService = require('../services/emailService');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_this';

router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, gender, password } = req.body;
    console.log('[auth/register] payload:', { name, email: email && email.slice(0,3) + '***', phone, gender });
    if (!name || !email || !phone || !gender || !password) return res.status(400).json({ error: 'Missing fields' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already registered' });
    const hash = await bcrypt.hash(password, 10);
    const u = new User({ name, email, phone, gender, password: hash });
    await u.save();
    console.log('[auth/register] created user id=', u._id.toString());
    
    // Send welcome email (async, don't block signup)
    emailService.sendWelcomeEmail(email, name).catch(err => {
      console.error('[auth/register] email sending error:', err.message);
    });
    
    const token = jwt.sign({ id: u._id, email: u.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, user: { _id: u._id.toString(), name: u.name, email: u.email, phone: u.phone, gender: u.gender }, token });
  } catch (err) {
    console.error('[auth/register] error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('[auth/login] attempt for email=', email);
    if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });
    
    const u = await User.findOne({ email });
    if (!u) {
      console.log('[auth/login] user not found');
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    console.log('[auth/login] user found, comparing passwords');
    console.log('[auth/login] password provided length:', password.length);
    console.log('[auth/login] stored hash starts with:', u.password.substring(0, 20));
    
    // Support both bcrypt hashed and plaintext passwords (for backward compatibility during transition)
    let ok = false;
    if (u.password && u.password.startsWith('$2')) {
      // It's a bcrypt hash
      console.log('[auth/login] detected bcrypt hash, comparing...');
      ok = await bcrypt.compare(password, u.password);
      console.log('[auth/login] bcrypt compare result:', ok);
    } else {
      // Fallback: plaintext comparison (for users created with old system)
      console.log('[auth/login] plaintext comparison');
      ok = password === u.password;
      console.log('[auth/login] plaintext compare result:', ok);
      if (ok) {
        // Hash it now for future logins
        u.password = await bcrypt.hash(password, 10);
        await u.save();
        console.log('[auth/login] upgraded password to bcrypt hash');
      }
    }
    
    if (!ok) {
      console.log('[auth/login] password mismatch - invalid credentials');
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    console.log('[auth/login] password matched, issuing token');
    const token = jwt.sign({ id: u._id, email: u.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, user: { _id: u._id.toString(), name: u.name, email: u.email, phone: u.phone, gender: u.gender }, token });
  } catch (err) {
    console.error('[auth/login] error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

module.exports = router;
