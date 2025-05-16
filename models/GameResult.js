const mongoose = require('mongoose');

const gameResultSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
      required: true
    },
    gameType: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    totalQuestions: {
      type: Number,
      required: true
    },
    percentage: {
      type: Number,
      required: true
    },
    answers: [
      {
        questionId: mongoose.Schema.Types.ObjectId,
        questionText: String,
        selectedOption: String,
        correctOption: String,
        isCorrect: Boolean
      }
    ],
    pairsMatched: {
      type: Number,
      default: 0
    },
    totalPairs: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('GameResult', gameResultSchema);