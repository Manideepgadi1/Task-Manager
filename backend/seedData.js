const { sequelize, connectDB } = require('./config/database');
const { User, Task, Notification } = require('./models');

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    await connectDB();

    // Sync all models (drop existing tables and recreate)
    await sequelize.sync({ force: true });
    console.log('✅ Database tables created');

    // Create Admin User
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@company.com',
      password: 'admin123', // Will be hashed automatically
      role: 'admin',
      employeeId: 'EMP001',
      isActive: true
    });
    console.log('✅ Admin user created');

    // Create 10 Employees
    const employees = [];
    const firstNames = ['John', 'Sarah', 'Michael', 'Emma', 'David', 'Lisa', 'James', 'Mary', 'Robert', 'Jennifer'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

    for (let i = 0; i < 10; i++) {
      const employee = await User.create({
        name: `${firstNames[i]} ${lastNames[i]}`,
        email: `${firstNames[i].toLowerCase()}.${lastNames[i].toLowerCase()}@company.com`,
        password: 'password123', // Will be hashed automatically
        role: 'employee',
        employeeId: `EMP${String(i + 2).padStart(3, '0')}`,
        isActive: true
      });
      employees.push(employee);
    }
    console.log('✅ 10 employees created');

    // Create 10 Sample Tasks
    const taskTemplates = [
      {
        title: 'Update Company Website',
        description: 'Redesign the homepage and update company information',
        status: 'in-progress',
        priority: 'high',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      },
      {
        title: 'Prepare Q4 Financial Report',
        description: 'Compile and analyze financial data for Q4 presentation',
        status: 'pending',
        priority: 'urgent',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Code Review - Mobile App',
        description: 'Review pull requests for the new mobile application features',
        status: 'completed',
        priority: 'medium',
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Customer Support Training',
        description: 'Conduct training session for new customer support representatives',
        status: 'pending',
        priority: 'medium',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Database Migration',
        description: 'Migrate legacy database to new PostgreSQL cluster',
        status: 'in-progress',
        priority: 'high',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Marketing Campaign Launch',
        description: 'Launch social media campaign for new product line',
        status: 'pending',
        priority: 'high',
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Security Audit',
        description: 'Perform comprehensive security audit of all systems',
        status: 'pending',
        priority: 'urgent',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Team Building Event',
        description: 'Organize and plan quarterly team building activities',
        status: 'completed',
        priority: 'low',
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'API Documentation Update',
        description: 'Update API documentation with latest endpoints and examples',
        status: 'in-progress',
        priority: 'medium',
        dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Inventory System Upgrade',
        description: 'Upgrade inventory management system to latest version',
        status: 'pending',
        priority: 'low',
        dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)
      }
    ];

    for (let i = 0; i < taskTemplates.length; i++) {
      const assignedEmployee = employees[i % employees.length];
      
      await Task.create({
        ...taskTemplates[i],
        assignedToId: assignedEmployee.id,
        createdById: admin.id,
        tags: ['general', 'priority'],
        attachments: []
      });
    }
    console.log('✅ 10 sample tasks created');

    // Create some notifications
    for (let i = 0; i < 5; i++) {
      await Notification.create({
        userId: employees[i].id,
        taskId: i + 1,
        type: 'task_assigned',
        title: 'New Task Assigned',
        message: `You have been assigned: ${taskTemplates[i].title}`,
        isRead: i % 2 === 0,
        link: `/tasks/${i + 1}`
      });
    }
    console.log('✅ Sample notifications created');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('   Admin: admin@company.com / admin123');
    console.log('   Employee: john.smith@company.com / password123');
    console.log('   (All employees use password123)\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
