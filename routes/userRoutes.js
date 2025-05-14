const express = require('express');
const router = express.Router();
const { 
  getUsers, 
  createUser, 
  promoteToAdmin, 
  deleteUser 
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, admin, getUsers)
  .post(protect, admin, createUser);

router.route('/:id')
  .delete(protect, admin, deleteUser);

router.route('/:id/promote')
  .put(protect, admin, promoteToAdmin);

module.exports = router;
