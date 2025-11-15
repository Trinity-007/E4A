const mongoose = require('mongoose');
const User = require('./src/models/User');

mongoose.connect('mongodb://localhost:27017/e4a_db', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✓ Connected to MongoDB');
    return User.find();
  })
  .then(users => {
    console.log('\n=== Users in database ===');
    users.forEach((u, i) => {
      console.log(`${i+1}. Email: ${u.email}`);
      console.log(`   Name: ${u.name}`);
      console.log(`   Password (first 30 chars): ${u.password.substring(0, 30)}...`);
      console.log(`   Starts with $2: ${u.password.startsWith('$2')}`);
      console.log('');
    });
    process.exit(0);
  })
  .catch(err => {
    console.error('✗ Error:', err.message);
    process.exit(1);
  });
