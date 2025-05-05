const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: '123456',
    role: 'admin'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: '123456',
  },
  {
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: '123456',
  },
];

const importData = async () => {
  try {
    await User.deleteMany();

    const createdUsers = await Promise.all(
      users.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return User.create({
          name: user.name,
          email: user.email,
          password: hashedPassword,
          role: user.role || 'user',
        });
      })
    );

    console.log('Users Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();