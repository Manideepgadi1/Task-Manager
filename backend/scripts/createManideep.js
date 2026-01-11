const bcrypt = require('bcryptjs');
const { User } = require('../models');

async function createManideepUser() {
  try {
    console.log('🚀 Creating Manideep admin account...\n');

    const userData = {
      name: 'Manideep',
      email: 'manideep9877@gmail.com',
      password: '1234567',
      role: 'admin',
      employeeId: 'MANIDEEP001',
      isActive: true
    };

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email: userData.email } });
    
    if (existingUser) {
      console.log('⚠️  User already exists! Updating password...\n');
      
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      await existingUser.update({ password: hashedPassword });
      
      console.log('✅ Password updated successfully!\n');
      console.log('📧 Email: manideep9877@gmail.com');
      console.log('🔑 Password: 1234567');
      console.log('👤 Role: ADMIN\n');
    } else {
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Create user
      await User.create({
        ...userData,
        password: hashedPassword
      });

      console.log('✅ Admin account created successfully!\n');
      console.log('📧 Email: manideep9877@gmail.com');
      console.log('🔑 Password: 1234567');
      console.log('👤 Role: ADMIN');
      console.log('🆔 Employee ID: MANIDEEP001\n');
    }

    console.log('🌐 Login at: http://localhost:5173\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createManideepUser();
