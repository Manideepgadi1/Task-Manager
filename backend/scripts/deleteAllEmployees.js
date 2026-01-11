const { User } = require('../models');

async function deleteAllEmployees() {
  try {
    // Find all employees
    const employees = await User.findAll({
      where: { role: 'employee' }
    });

    console.log(`\n🗑️  Found ${employees.length} employees to delete:\n`);
    employees.forEach(emp => {
      console.log(`  - ${emp.employeeId} | ${emp.name} | ${emp.email}`);
    });

    // Delete all employees
    const deletedCount = await User.destroy({
      where: { role: 'employee' }
    });

    console.log(`\n✅ Successfully deleted ${deletedCount} employees\n`);

    // Show remaining users
    const remaining = await User.findAll({
      attributes: ['id', 'name', 'email', 'employeeId', 'role'],
      order: [['id', 'ASC']]
    });

    console.log('👥 Remaining users:\n');
    remaining.forEach(u => {
      console.log(`  ID: ${u.id} | ${u.employeeId || 'NO-EMP-ID'} | ${u.name} | ${u.role}`);
    });
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

deleteAllEmployees();
