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