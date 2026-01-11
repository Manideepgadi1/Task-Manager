const { User } = require('../models');

async function createDemoEmployee() {
  try {
    console.log('Creating demo employee...\n');
    
    const demoEmployee = await User.create({
      name: 'Appalaamma',
      email: 'swealth520@gmail.com',
      password: '123456',
      role: 'employee',
      employeeId: 'EMP002'
    });

    console.log('✅ Demo employee created successfully!\n');
    console.log('Details:');
    console.log(`  Name: ${demoEmployee.name}`);
    console.log(`  Email: ${demoEmployee.email}`);
    console.log(`  Employee ID: ${demoEmployee.employeeId}`);
    console.log(`  Password: 123456`);
    console.log('\nYou can now login as employee with:');
    console.log('  Email: swealth520@gmail.com');
    console.log('  Password: 123456\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createDemoEmployee();
