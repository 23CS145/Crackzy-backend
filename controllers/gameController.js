const mongoose = require('mongoose');
const QuizQuestion = require('../models/QuizQuestion');
const asyncHandler = require('express-async-handler');

// @desc    Get quiz questions
// @route   GET /api/game/quiz
// @access  Private
const getQuizQuestions = asyncHandler(async (req, res) => {
  const questions = await QuizQuestion.aggregate([
    { $match: { active: true } }, // Only get active questions
    { $sample: { size: 10 } }
  ]);
  
  if (!questions.length) {
    res.status(404);
    throw new Error('No questions found');
  }
  
  res.json(questions);
});

// @desc    Submit quiz answers
// @route   POST /api/game/quiz
// @access  Private
const submitQuizAnswers = asyncHandler(async (req, res) => {
  const { answers } = req.body;

  // Convert string IDs to ObjectId
  const questionIds = answers.map(answer => {
    try {
      return new mongoose.Types.ObjectId(answer.questionId);
    } catch (err) {
      return null;
    }
  }).filter(id => id !== null);

  // Get questions with proper ID handling
  const questions = await QuizQuestion.find({ 
    _id: { $in: questionIds } 
  });

  // Create ID map for quick lookup
  const questionMap = {};
  questions.forEach(q => {
    questionMap[q._id.toString()] = q;
  });

  // Process results
  const results = answers.map(answer => {
    const question = questionMap[answer.questionId];
    
    if (!question) {
      return {
        questionId: answer.questionId,
        error: 'Question not found'
      };
    }

    const selectedOption = question.options[answer.selectedOption];
    const correctOption = question.options.find(opt => opt.isCorrect);

    return {
      questionId: question._id,
      questionText: question.questionText,
      selectedOption: selectedOption?.optionText || 'Not answered',
      correctOption: correctOption.optionText,
      isCorrect: selectedOption?.isCorrect || false
    };
  });

  // Filter out invalid questions for scoring
  const validResults = results.filter(r => !r.error);
  const score = validResults.filter(r => r.isCorrect).length;
  const totalQuestions = validResults.length;
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  res.json({
    score,
    totalQuestions,
    percentage,
    results
  });
});

module.exports = {
  getQuizQuestions,
  submitQuizAnswers
};