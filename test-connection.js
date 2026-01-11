const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  'taskmanager',
  'postgres',
  'Manideep@1204',
  {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    logging: console.log
  }
);

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connection successful!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
