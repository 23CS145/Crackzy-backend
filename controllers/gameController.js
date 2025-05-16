const mongoose = require('mongoose');
const Game = require('../models/Game');
const GameResult = require('../models/GameResult');
const asyncHandler = require('express-async-handler');

const getGames = asyncHandler(async (req, res) => {
  try {
    const { category, type } = req.query;
    const matchStage = { active: true };
    
    if (category) matchStage.category = category;
    if (type) matchStage.type = type;

    const pipeline = [
      { $match: matchStage },
      { $sample: { size: 10 } },
      { 
        $project: {
          title: 1,
          description: 1,
          type: 1,
          category: 1,
          difficulty: 1,
          questions: 1,
          pairs: 1
        }
      }
    ];

    const games = await Game.aggregate(pipeline);
    
    if (!games.length) {
      return res.status(200).json({ 
        success: true, 
        message: 'No games found', 
        data: [] 
      });
    }

    res.json({ success: true, data: games });
  } catch (error) {
    console.error('Get Games Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch games',
      details: error.message 
    });
  }
});

const getGameById = asyncHandler(async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    
    if (!game) {
      res.status(404);
      throw new Error('Game not found');
    }
    
    res.json({
      success: true,
      data: game
    });
  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

const submitGameResults = asyncHandler(async (req, res) => {
  try {
    const { gameId, gameType, answers, pairsMatched, totalPairs } = req.body;

    if (!gameId || !gameType) {
      return res.status(400).json({
        success: false,
        error: 'Game ID and type are required'
      });
    }

    let score = 0;
    let totalQuestions = 0;
    let results = [];

    if (gameType === 'quiz') {
      if (!answers || !Array.isArray(answers)) {
        return res.status(400).json({
          success: false,
          error: 'Answers must be provided as an array for quiz games'
        });
      }

      const questionIds = answers.map(answer => {
        try {
          return new mongoose.Types.ObjectId(answer.questionId);
        } catch (err) {
          return null;
        }
      }).filter(id => id !== null);

      const game = await Game.findById(gameId);
      if (!game) {
        return res.status(404).json({
          success: false,
          error: 'Game not found'
        });
      }

      const questionMap = {};
      game.questions.forEach(q => {
        questionMap[q._id.toString()] = q;
      });

      results = answers.map(answer => {
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
      score = validResults.filter(r => r.isCorrect).length;
      totalQuestions = validResults.length;
    } else if (gameType === 'match') {
      if (typeof pairsMatched !== 'number' || typeof totalPairs !== 'number') {
        return res.status(400).json({
          success: false,
          error: 'Pairs data must be provided for match games'
        });
      }
      score = pairsMatched;
      totalQuestions = totalPairs;
    }

    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

    const gameResult = new GameResult({
      user: req.user._id,
      game: gameId,
      gameType,
      score,
      totalQuestions,
      percentage,
      answers: results,
      pairsMatched: gameType === 'match' ? pairsMatched : undefined,
      totalPairs: gameType === 'match' ? totalPairs : undefined
    });

    await gameResult.save();

    res.json({
      success: true,
      data: {
        score,
        totalQuestions,
        percentage,
        results,
        pairsMatched,
        totalPairs,
        resultId: gameResult._id
      }
    });
  } catch (error) {
    console.error('Error submitting game results:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

const getGameResults = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [results, total] = await Promise.all([
      GameResult.find({ user: req.user._id })
        .populate('game', 'title type category')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      GameResult.countDocuments({ user: req.user._id })
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
    console.error('Error fetching game results:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

module.exports = {
  getGames,
  getGameById,
  submitGameResults,
  getGameResults,
};