require('dotenv').config();
const { User } = require('../models');

async function testAddEmployee() {
  try {
    console.log('Testing employee creation...');
    
    const newEmployee = await User.create({
      name: 'Appalaamma',
      email: 'swealth520@gmail.com',
      password: '123456',
      role: 'employee',
      employeeId: 'EMP003'
    });

    console.log('✅ Employee created successfully!');
    console.log(newEmployee.toJSON());
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating employee:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

testAddEmployee();
