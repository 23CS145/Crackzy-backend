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
      enum: ['RBI', 'SBI', 'IBPS', 'RRB', 'SSC', 'UPSC', 'General'],
      default: 'General'
    },
    subCategory: {
      type: String,
      required: false
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium'
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('QuizQuestion', quizQuestionSchema);