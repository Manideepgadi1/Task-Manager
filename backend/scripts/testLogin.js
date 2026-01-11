const bcrypt = require('bcryptjs');
const { User } = require('../models');

async function testLogin() {
  try {
    const email = 'manideep9877@gmail.com';
    const password = '1234567';
    
    console.log(`\n🔍 Testing login for: ${email}\n`);
    
    // Find user
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      console.log('❌ User NOT FOUND in database!\n');
      console.log('Available users:');
      const allUsers = await User.findAll({ attributes: ['email', 'role'] });
      allUsers.forEach(u => console.log(`  - ${u.email} (${u.role})`));
      process.exit(1);
    }
    
    console.log('✅ User found!');
    console.log(`   Name: ${user.name}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Active: ${user.isActive}\n`);
    
    // Test password
    const isValid = await bcrypt.compare(password, user.password);
    
    if (isValid) {
      console.log('✅ Password is CORRECT!\n');
      console.log('Login credentials work:');
      console.log(`   Email: ${email}`);
      console.log(`   Password: ${password}\n`);
    } else {
      console.log('❌ Password is WRONG!\n');
      console.log('Resetting password to: 1234567\n');
      
      const hashedPassword = await bcrypt.hash('1234567', 10);
      await user.update({ password: hashedPassword });
      
      console.log('✅ Password reset successful!');
      console.log(`   Email: ${email}`);
      console.log(`   New Password: 1234567\n`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testLogin();
