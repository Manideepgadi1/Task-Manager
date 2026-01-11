const { User } = require('../models');
const { sequelize } = require('../config/database');

async function resetPasswordDirectly() {
  try {
    console.log('\n🔧 Resetting password without hooks...\n');
    
    const email = 'admin@company.com';
    const plainPassword = 'admin123';
    
    // Update directly with raw SQL to bypass hooks
    await sequelize.query(
      `UPDATE users SET password = crypt(:password, gen_salt('bf')) WHERE email = :email`,
      {
        replacements: { password: plainPassword, email: email },
        type: sequelize.QueryTypes.UPDATE
      }
    ).catch(async () => {
      // If pgcrypto extension doesn't exist, use bcrypt directly
      const bcrypt = require('bcryptjs');
      const hash = await bcrypt.hash(plainPassword, 10);
      
      await sequelize.query(
        `UPDATE users SET password = :hash WHERE email = :email`,
        {
          replacements: { hash: hash, email: email },
          type: sequelize.QueryTypes.UPDATE
        }
      );
    });
    
    console.log('✅ Password reset for admin@company.com');
    console.log('   Password: admin123\n');
    
    // Also reset Manideep
    const manideepEmail = 'manideep9877@gmail.com';
    const manideepPassword = '123456';
    const bcrypt = require('bcryptjs');
    const manideepHash = await bcrypt.hash(manideepPassword, 10);
    
    await sequelize.query(
      `UPDATE users SET password = :hash WHERE email = :email`,
      {
        replacements: { hash: manideepHash, email: manideepEmail },
        type: sequelize.QueryTypes.UPDATE
      }
    );
    
    console.log('✅ Password reset for manideep9877@gmail.com');
    console.log('   Password: 123456\n');
    
    console.log('🎉 Try logging in now!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

resetPasswordDirectly();
