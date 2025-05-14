const mongoose = require('mongoose');

const testSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      default: 30,
    },
    category: {
      type: String,
      required: true,
      enum: ['RBI', 'SBI', 'IBPS', 'RRB', 'SSC', 'UPSC', 'Other'],
      default: 'Other'
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
    questions: [
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
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Test', testSchema);