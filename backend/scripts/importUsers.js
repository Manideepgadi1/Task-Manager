const fs = require('fs');
const csv = require('csv-parser');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

/**
 * Bulk import users from CSV file
 * CSV Format: name,email,employeeId,role
 * Run with: node backend/scripts/importUsers.js users.csv
 */

async function importUsers(csvFilePath) {
  if (!csvFilePath) {
    console.error('❌ Please provide CSV file path');
    console.log('Usage: node scripts/importUsers.js users.csv');
    process.exit(1);
  }

  if (!fs.existsSync(csvFilePath)) {
    console.error('❌ CSV file not found:', csvFilePath);
    process.exit(1);
  }

  const users = [];
  const defaultPassword = 'Welcome@123'; // Users should change on first login

  console.log('📖 Reading CSV file...\n');

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        users.push({
          name: row.name,
          email: row.email.toLowerCase(),
          employeeId: row.employeeId || `EMP${Date.now()}`,
          role: row.role || 'employee',
          password: row.password || defaultPassword,
          isActive: true
        });
      })
      .on('end', async () => {
        console.log(`Found ${users.length} users to import\n`);

        let created = 0;
        let skipped = 0;

        for (const userData of users) {
          try {
            // Check if user already exists
            const existingUser = await User.findOne({ 
              where: { email: userData.email } 
            });

            if (existingUser) {
              console.log(`⚠️  Skipped: ${userData.email} (already exists)`);
              skipped++;
              continue;
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(userData.password, 10);

            // Create user
            await User.create({
              ...userData,
              password: hashedPassword
            });

            console.log(`✅ Created: ${userData.name} (${userData.email})`);
            created++;
          } catch (error) {
            console.error(`❌ Error creating ${userData.email}:`, error.message);
          }
        }

        console.log('\n' + '='.repeat(50));
        console.log(`✨ Import completed!`);
        console.log(`   Created: ${created}`);
        console.log(`   Skipped: ${skipped}`);
        console.log('='.repeat(50) + '\n');

        process.exit(0);
      })
      .on('error', (error) => {
        console.error('❌ Error reading CSV:', error);
        process.exit(1);
      });
  });
}

// Get CSV file path from command line arguments
const csvFile = process.argv[2];
importUsers(csvFile);
