const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./src/models/User');

async function createTestUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/e4a_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✓ Connected to MongoDB');

    // Remove old Trinity account if it exists
    await User.deleteOne({ email: 'Sharkology619@gmail.com' });
    console.log('✓ Cleared old account');

    // Create new test account
    const password = 'Test123456';
    const hash = await bcrypt.hash(password, 10);
    
    const newUser = new User({
      name: 'Trinity',
      email: 'Sharkology619@gmail.com',
      password: hash
    });

    await newUser.save();
    
    console.log('\n=== New Test Account Created ===');
    console.log('Email: Sharkology619@gmail.com');
    console.log('Password: ' + password);
    console.log('Name: Trinity');
    console.log('\nUse these to sign in!');

    await mongoose.connection.close();
    console.log('\n✓ Ready to test');
  } catch (err) {
    console.error('Error:', err);
  }
}

createTestUser();
