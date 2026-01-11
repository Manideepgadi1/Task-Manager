const bcrypt = require('bcryptjs');
const { User } = require('../models');

async function fixAllLogins() {
  try {
    console.log('\n🔧 Fixing ALL login credentials...\n');
    
    // Fix Manideep
    const manideep = await User.findOne({ where: { email: 'manideep9877@gmail.com' } });
    if (manideep) {
      const hashedPassword = await bcrypt.hash('123456', 10);
      await manideep.update({ password: hashedPassword });
      console.log('✅ Manideep (Admin)');
      console.log('   Email: manideep9877@gmail.com');
      console.log('   Password: 123456\n');
    }
    
    // Fix Demo Admin
    const admin = await User.findOne({ where: { email: 'admin@company.com' } });
    if (admin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await admin.update({ password: hashedPassword });
      console.log('✅ Demo Admin');
      console.log('   Email: admin@company.com');
      console.log('   Password: admin123\n');
    }
    
    // Fix Demo Employee
    const employee = await User.findOne({ where: { email: 'john.smith@company.com' } });
    if (employee) {
      const hashedPassword = await bcrypt.hash('employee123', 10);
      await employee.update({ password: hashedPassword });
      console.log('✅ Demo Employee');
      console.log('   Email: john.smith@company.com');
      console.log('   Password: employee123\n');
    }
    
    console.log('🎉 All passwords reset successfully!\n');
    console.log('Try any of the above credentials to login.\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixAllLogins();
