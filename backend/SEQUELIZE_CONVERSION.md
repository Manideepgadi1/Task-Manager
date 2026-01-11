# MongoDB to PostgreSQL Conversion Guide

## Sequelize vs Mongoose Syntax Conversion

### Find Operations

```javascript
// Mongoose
User.find()
User.find({ role: 'employee' })
User.findOne({ email: 'test@test.com' })
User.findById(id)

// Sequelize
User.findAll()
User.findAll({ where: { role: 'employee' } })
User.findOne({ where: { email: 'test@test.com' } })
User.findByPk(id)
```

### Create Operations

```javascript
// Mongoose
const user = new User({ name: 'Test' });
await user.save();

// Sequelize
const user = await User.create({ name: 'Test' });
```

### Update Operations

```javascript
// Mongoose
user.name = 'New Name';
await user.save();

// Sequelize
user.name = 'New Name';
await user.save();
// OR
await user.update({ name: 'New Name' });
```

### Delete Operations

```javascript
// Mongoose
await User.findByIdAndDelete(id);
await user.remove();

// Sequelize
await User.destroy({ where: { id } });
await user.destroy();
```

### Population/Include

```javascript
// Mongoose
Task.find().populate('assignedTo').populate('createdBy')

// Sequelize
Task.findAll({
  include: [
    { model: User, as: 'assignedTo' },
    { model: User, as: 'createdBy' }
  ]
})
```

### Select Fields

```javascript
// Mongoose
User.find().select('name email')
User.find().select('-password')

// Sequelize
User.findAll({
  attributes: ['name', 'email']
})
User.findAll({
  attributes: { exclude: ['password'] }
})
```

### Sorting

```javascript
// Mongoose
User.find().sort({ createdAt: -1 })

// Sequelize
User.findAll({
  order: [['createdAt', 'DESC']]
})
```

### ID Fields

```javascript
// Mongoose
user._id

// Sequelize
user.id
```

## Route Files to Update

All route files need these conversions applied. The logic remains the same, only the syntax changes.
