const { User } = require('../models');

async function listAllUsers() {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'employeeId', 'role'],
      order: [['id', 'ASC']]
    });

    console.log('\n👥 All Users in Database:\n');
    users.forEach(u => {
      console.log(`  ID: ${u.id} | ${u.employeeId || 'NO-EMP-ID'} | ${u.name} | ${u.email} | ${u.role}`);
    });
    console.log(`\n📊 Total users: ${users.length}\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

listAllUsers();
