const express = require('express');
const nodemailer = require('nodemailer');
const Order = require('../models/Order');

const router = express.Router();

// create a nodemailer transporter using env SMTP settings
function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !port || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465, // true for 465, false for other ports
    auth: { user, pass }
  });
}

async function sendOrderEmail(order) {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn('[orders] SMTP not configured, skipping email');
    return;
  }
  const to = order.contact && order.contact.email ? order.contact.email : null;
  if (!to) return;

  const subject = `Order Confirmation — ${order._id}`;
  const itemsHtml = (order.items || []).map(it => `<li>${it.name} — $${it.price}</li>`).join('');
  const html = `<p>Hi ${order.contact.name || ''},</p>
  <p>Thanks for your order. We've received it and will process it soon.</p>
  <h4>Order summary</h4>
  <ul>${itemsHtml}</ul>
  <p><strong>Total:</strong> $${order.total}</p>
  <p>Order ID: ${order._id}</p>
  <p>Regards,<br/>E4A Team</p>`;

  const mailOptions = {
    from: process.env.FROM_EMAIL || process.env.SMTP_USER,
    to,
    subject,
    html
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('[orders] confirmation email sent:', info.messageId || info);
  } catch (err) {
    console.error('[orders] error sending email:', err && err.message ? err.message : err);
  }
}

router.post('/', async (req, res) => {
  try {
    const { items, contact, total } = req.body;
    // Validate input
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error('[orders] error: No items provided');
      return res.status(400).json({ error: 'No items in order' });
    }
    if (!contact || !contact.email) {
      console.error('[orders] error: Missing contact info');
      return res.status(400).json({ error: 'Missing contact information' });
    }

    console.log(`[orders] Creating order for ${contact.email} with ${items.length} items, total: $${total}`);

    // Create and save order
    const order = new Order({ items, contact, total });
    const savedOrder = await order.save();

    // send confirmation email (best-effort)
    sendOrderEmail(savedOrder).catch(e => console.error('[orders] send email failed:', e));

    console.log(`[orders] Order created successfully:`, savedOrder._id);
    res.json({ success: true, order: savedOrder });
  } catch (err) {
    console.error('[orders] error:', err.message);
    res.status(500).json({ error: 'Failed to create order: ' + err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(200);
    res.json(orders);
  } catch (err) {
    console.error('[orders] error:', err.message);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

module.exports = router;
