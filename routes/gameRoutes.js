const express = require('express');
const router = express.Router();
const {
  getQuizQuestions,
  submitQuizAnswers,
} = require('../controllers/gameController');
const { protect } = require('../middleware/authMiddleware');

router.route('/quiz').get(protect, getQuizQuestions).post(protect, submitQuizAnswers);

module.exports = router;