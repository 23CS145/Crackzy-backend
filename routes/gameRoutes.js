const express = require('express');
const router = express.Router();
const {
  getGames,
  getGameById,
  submitGameResults,
  getGameResults,
} = require('../controllers/gameController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getGames);

router.route('/:id')
  .get(protect, getGameById);

router.route('/results')
  .post(protect, submitGameResults)
  .get(protect, getGameResults);
  

module.exports = router;