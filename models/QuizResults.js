const mongoose = require('mongoose');

const quizResultSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'QuizQuestion'
        },
        questionText: String,
        selectedOption: String,
        correctOption: String,
        isCorrect: Boolean
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('QuizResults', quizResultSchema);
