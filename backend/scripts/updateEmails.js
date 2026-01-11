require('dotenv').config();
const { User, sequelize } = require('../models');

async function updateEmails() {
  try {
    console.log('✅ Database connected');

    // Update employee account (ID 2) to manideep9877@gmail.com with name Manideep
    const employee = await User.findOne({
      where: { id: 2 }
    });

    if (employee) {
      employee.email = 'manideep9877@gmail.com';
      employee.name = 'Manideep';
      await employee.save({ hooks: false, validate: false });
      console.log('✅ Employee updated: manideep9877@gmail.com (Manideep)');
    }

    // Update Manideep's admin account email to gadi0mani0deep7@gmail.com
    const manideepAdmin = await User.findOne({ 
      where: { email: 'gadi0mani0deep7@gmail.com' } 
    });

    if (manideepAdmin) {
      console.log('✅ Admin email already set: gadi0mani0deep7@gmail.com');
    } else {
      const adminToUpdate = await User.findOne({ where: { id: 12 } });
      if (adminToUpdate) {
        adminToUpdate.email = 'gadi0mani0deep7@gmail.com';
        await adminToUpdate.save({ hooks: false, validate: false });
        console.log('✅ Admin email updated: gadi0mani0deep7@gmail.com');
      }
    }

    // Display updated users
    console.log('\n📋 Updated accounts:');
    const users = await User.findAll({
      where: {
        email: ['gadi0mani0deep7@gmail.com', 'manideep9877@gmail.com']
      },
      attributes: ['id', 'name', 'email', 'role', 'employeeId']
    });

    users.forEach(user => {
      console.log(`- ${user.name} (${user.role}): ${user.email} [${user.employeeId}]`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateEmails();
