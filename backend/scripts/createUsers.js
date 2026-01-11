const bcrypt = require('bcryptjs');
const { User } = require('../models');

/**
 * Script to create initial admin user and employee accounts
 * Run with: node backend/scripts/createUsers.js
 */

const users = [
  // Admin Account
  {
    name: 'Admin User',
    email: 'admin@company.com',
    password: 'Admin@123',  // Change this!
    role: 'admin',
    employeeId: 'ADMIN001',
    isActive: true
  },
  // Test Employee Account
  {
    name: 'Test Employee',
    email: 'employee@company.com',
    password: 'Employee@123',  // They should change this on first login
    role: 'employee',
    employeeId: 'EMP001',
    isActive: true
  }
  // After testing, add your 9 more employees here
];

async function createUsers() {
  try {
    console.log('🚀 Starting user creation...\n');

    for (const userData of users) {
      // Check if user already exists
      const existingUser = await User.findOne({ where: { email: userData.email } });
      
      if (existingUser) {
        console.log(`⚠️  User ${userData.email} already exists, skipping...`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Create user
      const user = await User.create({
        ...userData,
        password: hashedPassword
      });

      console.log(`✅ Created ${userData.role}: ${userData.name} (${userData.email})`);
      console.log(`   Employee ID: ${userData.employeeId}`);
      console.log(`   Temporary Password: ${userData.password}\n`);
    }

    console.log('\n✨ User creation completed!');
    console.log('\n⚠️  IMPORTANT: Send welcome emails with temporary passwords');
    console.log('⚠️  Users should change their passwords on first login\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating users:', error);
    process.exit(1);
  }
}

// Run the script
createUsers();
