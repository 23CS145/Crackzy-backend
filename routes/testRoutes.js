const express = require('express');
const router = express.Router();
const {
  getTests,
  getTestById,
  createTest,
  updateTest,
  deleteTest,
   getTestsByCategory
} = require('../controllers/testController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getTests)
  .post(protect, admin, createTest);

router.route('/:id')
  .get(getTestById)
  .put(protect, admin, updateTest)
  .delete(protect, admin, deleteTest);

  // Add this new route
router.get('/category/:category', getTestsByCategory);

module.exports = router;