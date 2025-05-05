const mongoose = require('mongoose');

const quizQuestionSchema = mongoose.Schema(
  {
    questionText: {
      type: String,
      required: true,
    },
    options: [
      {
        optionText: {
          type: String,
          required: true,
        },
        isCorrect: {
          type: Boolean,
          required: true,
          default: false,
        },
      },
    ],
    category: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('QuizQuestion', quizQuestionSchema);