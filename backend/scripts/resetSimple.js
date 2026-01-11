const bcrypt = require('bcryptjs');
const { User } = require('../models');

async function resetToSimple() {
  try {
    const email = 'manideep9877@gmail.com';
    const newPassword = '123456';  // 6 digits - super simple
    
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      console.log('❌ User not found!');
      process.exit(1);
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });
    
    console.log('\n✅ Password reset to super simple:\n');
    console.log('📧 Email: manideep9877@gmail.com');
    console.log('🔑 Password: 123456');
    console.log('\n(6 digits - very easy to type)\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

resetToSimple();
