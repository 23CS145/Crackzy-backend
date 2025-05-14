const mongoose = require('mongoose');
const QuizQuestion = require('../models/QuizQuestion');
const QuizResult = require('../models/QuizResults');
const asyncHandler = require('express-async-handler');

// Update getQuizQuestions to accept category parameter
const getQuizQuestions = asyncHandler(async (req, res) => {
  const { category } = req.query;
  
  try {
    const matchStage = { active: true };
    if (category) {
      matchStage.category = category;
    }

    const questions = await QuizQuestion.aggregate([
      { $match: matchStage },
      { $sample: { size: 10 } },
      {
        $project: {
          questionText: 1,
          options: 1,
          category: 1,
          difficulty: 1,
          createdAt: 1
        }
      }
    ]);
    
    if (!questions.length) {
      res.status(404);
      throw new Error('No active questions found');
    }
    
    res.json({
      success: true,
      count: questions.length,
      data: questions
    });
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

const submitQuizAnswers = asyncHandler(async (req, res) => {
  try {
    const { answers } = req.body;

    // Validate input
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        error: 'Answers must be provided as an array'
      });
    }

    if (answers.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one answer must be provided'
      });
    }

    // Process answers
    const questionIds = answers.map(answer => {
      try {
        return new mongoose.Types.ObjectId(answer.questionId);
      } catch (err) {
        return null;
      }
    }).filter(id => id !== null);

    const questions = await QuizQuestion.find({ 
      _id: { $in: questionIds } 
    });

    const questionMap = {};
    questions.forEach(q => {
      questionMap[q._id.toString()] = q;
    });

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

    const validResults = results.filter(r => !r.error);
    const score = validResults.filter(r => r.isCorrect).length;
    const totalQuestions = validResults.length;
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

    // Save quiz result
    const quizResult = new QuizResult({
      user: req.user._id,
      score,
      totalQuestions,
      percentage,
      answers: validResults
    });

    await quizResult.save();

    res.json({
      success: true,
      data: {
        score,
        totalQuestions,
        percentage,
        results: validResults,
        resultId: quizResult._id
      }
    });
  } catch (error) {
    console.error('Error submitting quiz answers:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

const getQuizResults = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [results, total] = await Promise.all([
      QuizResult.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      QuizResult.countDocuments({ user: req.user._id })
    ]);

    res.json({
      success: true,
      count: results.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: results
    });
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

module.exports = {
  getQuizQuestions,
  submitQuizAnswers,
  getQuizResults,
};