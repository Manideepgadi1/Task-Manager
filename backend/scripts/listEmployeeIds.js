const { User } = require('../models');

async function listEmployeeIds() {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'employeeId', 'role'],
      order: [['employeeId', 'ASC']]
    });

    console.log('\n📋 Existing Employee IDs:\n');
    users.forEach(u => {
      if (u.employeeId) {
        console.log(`  ${u.employeeId} - ${u.name} (${u.role}, ID: ${u.id})`);
      }
    });

    // Find the next available employee ID
    const employeeIds = users
      .map(u => u.employeeId)
      .filter(id => id && id.startsWith('EMP'))
      .map(id => parseInt(id.replace('EMP', '')))
      .sort((a, b) => a - b);

    console.log('\n💡 Suggested next Employee ID:');
    let nextId = 1;
    for (let id of employeeIds) {
      if (id === nextId) {
        nextId++;
      } else {
        break;
      }
    }
    console.log(`  EMP${String(nextId).padStart(3, '0')}\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

listEmployeeIds();
