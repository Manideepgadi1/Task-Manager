require('dotenv').config();
const { Sequelize } = require('sequelize');

console.log('Testing connection with:');
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false
  }
);

sequelize.authenticate()
  .then(() => {
    console.log('\n✅ Connection successful!');
    process.exit(0);
  })
  .catch(err => {
    console.log('\n❌ Connection failed:', err.message);
    process.exit(1);
  });
