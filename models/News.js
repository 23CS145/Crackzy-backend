const mongoose = require('mongoose');

const newsSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['RBI', 'SBI', 'IBPS', 'RRB', 'SSC', 'UPSC', 'General'],
      default: 'General'
    },
    isImportant: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('News', newsSchema);