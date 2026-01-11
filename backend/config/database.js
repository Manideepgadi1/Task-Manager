const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  'taskmanager',
  'postgres',
  'Manideep@1204',
  {
    host: '127.0.0.1',
    port: 5434,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Test connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected successfully');
    
    // Sync models - but don't use alter in production
    // Use migrations instead for production
    // if (process.env.NODE_ENV === 'development') {
    //   await sequelize.sync({ alter: true });
    //   console.log('✅ Database models synchronized');
    // }
  } catch (error) {
    console.error('❌ PostgreSQL connection error:', error.message);
    console.error('Retrying in 2 seconds...');
    setTimeout(() => connectDB(), 2000);
  }
};

module.exports = { sequelize, connectDB };
