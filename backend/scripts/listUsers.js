const { User } = require('../models');

async function listUsers() {
  try {
    const users = await User.findAll({
      order: [['role', 'DESC'], ['createdAt', 'ASC']]
    });
    
    console.log('\n📋 Existing Users in Database:\n');
    
    if (users.length === 0) {
      console.log('  No users found.\n');
    } else {
      users.forEach(user => {
        console.log(`  ${user.role.toUpperCase()}: ${user.name}`);
        console.log(`     Email: ${user.email}`);
        console.log(`     Employee ID: ${user.employeeId}`);
        console.log(`     Active: ${user.isActive ? 'Yes' : 'No'}`);
        console.log('');
      });
      
      console.log(`Total: ${users.length} users\n`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

listUsers();
