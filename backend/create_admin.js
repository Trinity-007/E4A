const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('./src/models/Admin');

async function createAdminAccount() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/e4a_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✓ Connected to MongoDB');

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ email: 'admin@e4a.com' });
    if (existingAdmin) {
      console.log('✗ Admin account already exists');
      await mongoose.connection.close();
      return;
    }

    // Create admin account
    const password = 'Admin123456';
    const hash = await bcrypt.hash(password, 10);
    
    const admin = new Admin({
      name: 'Admin',
      email: 'admin@e4a.com',
      password: hash,
      role: 'super_admin',
      permissions: [
        'manage_users',
        'manage_products',
        'manage_orders',
        'approve_verifications',
        'manage_admins'
      ]
    });

    await admin.save();
    
    console.log('\n=== Admin Account Created ===');
    console.log('Email: admin@e4a.com');
    console.log('Password: ' + password);
    console.log('Role: Super Admin');
    console.log('\nUse these credentials to login to the admin panel!');

    await mongoose.connection.close();
    console.log('\n✓ Setup complete');
  } catch (err) {
    console.error('Error:', err);
  }
}

createAdminAccount();
