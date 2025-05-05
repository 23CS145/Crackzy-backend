const express = require('express');
const router = express.Router();
const { getUsers, promoteToAdmin } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, admin, getUsers);

router.route('/:id/promote')
  .put(protect, admin, promoteToAdmin);

module.exports = router;