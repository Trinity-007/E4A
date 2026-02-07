const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./src/models/User');

async function testLogin() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/e4a_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✓ Connected to MongoDB');

    // Find the user
    const email = 'Sharkology619@gmail.com';
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('✗ User not found');
      process.exit(1);
    }

    console.log('\n=== User Found ===');
    console.log('Email:', user.email);
    console.log('Name:', user.name);
    console.log('Password hash:', user.password.substring(0, 30) + '...');
    console.log('Hash starts with $2:', user.password.startsWith('$2'));

    // Try different passwords
    const testPasswords = ['123456', 'password', 'test123', 'Trinity', 'trinity'];
    
    console.log('\n=== Testing Passwords ===');
    for (const pwd of testPasswords) {
      const match = await bcrypt.compare(pwd, user.password);
      console.log(`Password "${pwd}": ${match ? '✓ MATCH' : '✗ no match'}`);
      if (match) {
        console.log('\n✓✓✓ CORRECT PASSWORD FOUND! ✓✓✓');
        console.log(`Use this password: "${pwd}"`);
      }
    }

    await mongoose.connection.close();
  } catch (err) {
    console.error('Error:', err);
  }
}

testLogin();
