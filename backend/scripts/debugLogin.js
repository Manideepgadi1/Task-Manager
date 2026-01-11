const bcrypt = require('bcryptjs');
const { User } = require('../models');

async function debugLogin() {
  try {
    const email = 'admin@company.com';
    const testPassword = 'admin123';
    
    console.log('\n🔍 Debugging login for:', email);
    console.log('Testing password:', testPassword);
    console.log('-----------------------------------\n');
    
    // Find user
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      console.log('❌ USER NOT FOUND!\n');
      
      // Show all users
      const allUsers = await User.findAll({ 
        attributes: ['id', 'name', 'email', 'role', 'isActive'],
        limit: 5
      });
      console.log('Available users:');
      allUsers.forEach(u => {
        console.log(`  ID: ${u.id} | ${u.email} | ${u.role} | Active: ${u.isActive}`);
      });
      process.exit(1);
    }
    
    console.log('✅ User found in database:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Active: ${user.isActive}`);
    console.log(`   Password Hash: ${user.password.substring(0, 20)}...`);
    console.log('');
    
    // Test password comparison
    console.log('🔐 Testing password comparison...');
    const isMatch = await bcrypt.compare(testPassword, user.password);
    
    if (isMatch) {
      console.log('✅ PASSWORD MATCHES!\n');
      console.log('Login should work with:');
      console.log(`   Email: ${email}`);
      console.log(`   Password: ${testPassword}\n`);
    } else {
      console.log('❌ PASSWORD DOES NOT MATCH!\n');
      console.log('Resetting password now...');
      
      const newHash = await bcrypt.hash(testPassword, 10);
      await user.update({ password: newHash });
      
      console.log('✅ Password reset complete!');
      console.log(`   Email: ${email}`);
      console.log(`   Password: ${testPassword}\n`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

debugLogin();
