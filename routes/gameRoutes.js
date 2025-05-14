const express = require('express');
const router = express.Router();
const {
  getQuizQuestions,
  submitQuizAnswers,
  getQuizResults,
} = require('../controllers/gameController');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get quiz questions
// @route   GET /api/game/quiz
// @access  Private
router.route('/quiz')
  .get(protect, getQuizQuestions);

// @desc    Submit quiz answers
// @route   POST /api/game/quiz
// @access  Private
router.route('/quiz')
  .post(protect, submitQuizAnswers);

// @desc    Get user's quiz results
// @route   GET /api/game/results
// @access  Private
router.route('/results')
  .get(protect, getQuizResults);

module.exports = router;