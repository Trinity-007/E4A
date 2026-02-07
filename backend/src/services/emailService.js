const nodemailer = require('nodemailer');

// Configure email service - using Gmail or custom SMTP
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password'
  }
});

// Fallback transporter for localhost testing (console output)
const consoleTransporter = {
  sendMail: async (options) => {
    console.log('📧 [EMAIL SERVICE] Email would be sent:');
    console.log('To:', options.to);
    console.log('Subject:', options.subject);
    console.log('Body:', options.html);
    return { messageId: `mock-${Date.now()}` };
  }
};

const emailService = {
  // Send welcome email on signup
  sendWelcomeEmail: async (email, name) => {
    try {
      const mailer = process.env.EMAIL_USER ? transporter : consoleTransporter;
      
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@e4a.com',
        to: email,
        subject: '🎉 Welcome to E4A Marketplace!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
              <h1 style="margin: 0;">Welcome to E4A! 🎉</h1>
            </div>
            
            <div style="padding: 30px; background-color: white;">
              <p style="font-size: 16px; color: #333;">Hi <strong>${name}</strong>,</p>
              
              <p style="color: #555; line-height: 1.6;">
                Welcome to E4A Marketplace! We're excited to have you join our community. Your account has been successfully created and is ready to use.
              </p>
              
              <div style="background-color: #f0f4ff; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0; color: #333;"><strong>✅ What's Next?</strong></p>
                <ul style="margin: 10px 0 0 20px; color: #555;">
                  <li>Browse our amazing marketplace</li>
                  <li>Create your seller profile</li>
                  <li>Start buying and selling</li>
                </ul>
              </div>
              
              <p style="color: #555; line-height: 1.6;">
                If you have any questions or need assistance, feel free to contact our support team.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.SITE_URL || 'http://localhost:3000'}/index.html" 
                   style="display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  Start Shopping
                </a>
              </div>
              
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              
              <p style="font-size: 12px; color: #999; text-align: center;">
                © 2024 E4A Marketplace. All rights reserved.<br>
                <a href="${process.env.SITE_URL || 'http://localhost:3000'}/contact.html" style="color: #667eea; text-decoration: none;">Contact Us</a>
              </p>
            </div>
          </div>
        `
      };
      
      await mailer.sendMail(mailOptions);
      console.log(`✅ Welcome email sent to ${email}`);
      return { success: true, message: 'Welcome email sent' };
    } catch (err) {
      console.error('❌ Error sending welcome email:', err.message);
      // Don't fail signup if email fails - log but continue
      return { success: false, message: err.message };
    }
  },

  // Send password reset email
  sendPasswordResetEmail: async (email, name, resetToken) => {
    try {
      const mailer = process.env.EMAIL_USER ? transporter : consoleTransporter;
      const resetLink = `${process.env.SITE_URL || 'http://localhost:3000'}/reset-password.html?token=${resetToken}`;
      
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@e4a.com',
        to: email,
        subject: '🔐 Reset Your E4A Password',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
              <h1 style="margin: 0;">Password Reset Request</h1>
            </div>
            
            <div style="padding: 30px; background-color: white; border-radius: 0 0 8px 8px;">
              <p style="color: #333;">Hi <strong>${name}</strong>,</p>
              
              <p style="color: #555; line-height: 1.6;">
                We received a request to reset your password. Click the button below to reset it:
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" 
                   style="display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  Reset Password
                </a>
              </div>
              
              <p style="color: #999; font-size: 12px;">
                This link will expire in 24 hours.<br>
                If you didn't request this, please ignore this email.
              </p>
            </div>
          </div>
        `
      };
      
      await mailer.sendMail(mailOptions);
      console.log(`✅ Password reset email sent to ${email}`);
      return { success: true, message: 'Reset email sent' };
    } catch (err) {
      console.error('❌ Error sending reset email:', err.message);
      return { success: false, message: err.message };
    }
  },

  // Send order confirmation email
  sendOrderConfirmation: async (email, name, orderDetails) => {
    try {
      const mailer = process.env.EMAIL_USER ? transporter : consoleTransporter;
      
      const itemsHtml = orderDetails.items
        .map(item => `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">×${item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₦${item.price}</td>
          </tr>
        `)
        .join('');
      
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@e4a.com',
        to: email,
        subject: `📦 Order Confirmation - ${orderDetails.orderId}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
              <h1 style="margin: 0;">Order Confirmed! 🎉</h1>
            </div>
            
            <div style="padding: 30px; background-color: white; border-radius: 0 0 8px 8px;">
              <p style="color: #333;">Hi <strong>${name}</strong>,</p>
              
              <p style="color: #555; line-height: 1.6;">
                Thank you for your order! We're processing it now.
              </p>
              
              <div style="background-color: #f0f4ff; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0;">
                <p style="margin: 0; color: #333;"><strong>Order ID:</strong> ${orderDetails.orderId}</p>
                <p style="margin: 5px 0 0 0; color: #333;"><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
              </div>
              
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <thead>
                  <tr style="background-color: #f5f5f5;">
                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid #667eea;">Product</th>
                    <th style="padding: 10px; text-align: center; border-bottom: 2px solid #667eea;">Qty</th>
                    <th style="padding: 10px; text-align: right; border-bottom: 2px solid #667eea;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                  <tr>
                    <td colspan="2" style="padding: 15px; text-align: right; font-weight: bold;">Total:</td>
                    <td style="padding: 15px; text-align: right; font-weight: bold; font-size: 18px; color: #667eea;">₦${orderDetails.total}</td>
                  </tr>
                </tbody>
              </table>
              
              <p style="color: #555;">
                Your order is being prepared for shipment. You'll receive a tracking number via email once it ships.
              </p>
            </div>
          </div>
        `
      };
      
      await mailer.sendMail(mailOptions);
      console.log(`✅ Order confirmation email sent to ${email}`);
      return { success: true, message: 'Confirmation email sent' };
    } catch (err) {
      console.error('❌ Error sending order email:', err.message);
      return { success: false, message: err.message };
    }
  }
};

module.exports = emailService;
