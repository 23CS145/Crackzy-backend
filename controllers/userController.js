const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

// @desc    Promote user to admin
// @route   PUT /api/users/:id/promote
// @access  Private/Admin
const promoteToAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.role === 'admin') {
    res.status(400);
    throw new Error('User is already an admin');
  }

  user.role = 'admin';
  await user.save();

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  });
});

module.exports = {
  getUsers,
  promoteToAdmin,
};