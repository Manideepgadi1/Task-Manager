require('dotenv').config();
const bcrypt = require('bcryptjs');
const { User, sequelize } = require('../models');

async function resetPassword() {
  try {
    console.log('🔄 Resetting admin password...');

    // Find admin user
    const admin = await User.findOne({
      where: { email: 'gadi0mani0deep7@gmail.com' }
    });

    if (!admin) {
      console.log('❌ Admin not found with email: gadi0mani0deep7@gmail.com');
      
      // Check if old email exists
      const oldAdmin = await User.findOne({ where: { id: 12 } });
      if (oldAdmin) {
        console.log(`Found user ID 12: ${oldAdmin.email}`);
      }
      process.exit(1);
    }

    // Hash password manually and update directly
    const password = '123456';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Update directly in database
    await User.update(
      { password: hashedPassword },
      { where: { email: 'gadi0mani0deep7@gmail.com' }, hooks: false, validate: false }
    );

    console.log('✅ Admin password reset successfully!');
    console.log('📧 Email: gadi0mani0deep7@gmail.com');
    console.log('🔑 Password: 123456');

    // Verify the password
    const updatedAdmin = await User.findOne({
      where: { email: 'gadi0mani0deep7@gmail.com' }
    });

    const isMatch = await bcrypt.compare('123456', updatedAdmin.password);
    console.log(`\n✅ Password verification: ${isMatch ? 'SUCCESS' : 'FAILED'}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

resetPassword();
