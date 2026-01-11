const bcrypt = require('bcryptjs');
const { User } = require('../models');

async function createDemoUsers() {
  try {
    console.log('Creating demo users...');

    // Check if demo users already exist
    const existingAdmin = await User.findOne({ where: { email: 'admin@company.com' } });
    const existingEmployee = await User.findOne({ where: { email: 'john.doe@company.com' } });

    if (existingAdmin) {
      console.log('⚠️  Demo admin already exists');
    } else {
      // Create demo admin
      const hashedAdminPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'Admin User',
        email: 'admin@company.com',
        password: hashedAdminPassword,
        role: 'admin',
        employeeId: 'ADMIN001',
        isActive: true
      });
      console.log('✅ Demo admin created: admin@company.com / admin123');
    }

    if (existingEmployee) {
      console.log('⚠️  Demo employee already exists');
    } else {
      // Create demo employee
      const hashedEmployeePassword = await bcrypt.hash('employee123', 10);
      await User.create({
        name: 'John Doe',
        email: 'john.doe@company.com',
        password: hashedEmployeePassword,
        role: 'employee',
        employeeId: 'EMP001',
        isActive: true
      });
      console.log('✅ Demo employee created: john.doe@company.com / employee123');
    }

    console.log('\n📋 Demo Credentials Summary:');
    console.log('──────────────────────────────');
    console.log('Admin:');
    console.log('  Email: admin@company.com');
    console.log('  Password: admin123');
    console.log('\nEmployee:');
    console.log('  Email: john.doe@company.com');
    console.log('  Password: employee123');
    console.log('──────────────────────────────\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating demo users:', error);
    process.exit(1);
  }
}

createDemoUsers();
