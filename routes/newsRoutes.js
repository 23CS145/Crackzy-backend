const express = require('express');
const router = express.Router();
const {
  getNews,
  createNews,
  deleteNews,
} = require('../controllers/newsController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getNews).post(protect, admin, createNews);
router.route('/:id').delete(protect, admin, deleteNews);

module.exports = router;