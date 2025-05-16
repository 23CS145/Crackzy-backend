const mongoose = require('mongoose');

const gameSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['quiz', 'match', 'memory'],
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['RBI', 'SBI', 'IBPS', 'RRB', 'SSC', 'UPSC', 'General'],
      default: 'General'
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium'
    },
    questions: [{
      questionText: String,
      options: [{
        optionText: String,
        isCorrect: Boolean
      }]
    }],
    pairs: [{
      term: String,
      definition: String
    }],
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Game', gameSchema);