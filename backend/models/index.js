const User = require('./User');
const Task = require('./Task');
const Notification = require('./Notification');

// Define associations
User.hasMany(Task, { 
  foreignKey: 'assignedToId', 
  as: 'assignedTasks',
  onDelete: 'SET NULL'
});

User.hasMany(Task, { 
  foreignKey: 'createdById', 
  as: 'createdTasks',
  onDelete: 'CASCADE'
});

Task.belongsTo(User, { 
  foreignKey: 'assignedToId', 
  as: 'assignedTo'
});

Task.belongsTo(User, { 
  foreignKey: 'createdById', 
  as: 'createdBy'
});

User.hasMany(Notification, { 
  foreignKey: 'userId',
  as: 'notifications',
  onDelete: 'CASCADE'
});

Notification.belongsTo(User, { 
  foreignKey: 'userId',
  as: 'user'
});

Task.hasMany(Notification, { 
  foreignKey: 'taskId',
  as: 'notifications',
  onDelete: 'CASCADE'
});

Notification.belongsTo(Task, { 
  foreignKey: 'taskId',
  as: 'task'
});

module.exports = {
  User,
  Task,
  Notification
};
