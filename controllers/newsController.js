const News = require('../models/News');
const asyncHandler = require('express-async-handler');

// @desc    Get all news
// @route   GET /api/news
// @access  Public
const getNews = asyncHandler(async (req, res) => {
  const news = await News.find({});
  res.json(news);
});

// @desc    Create a news item
// @route   POST /api/news
// @access  Private/Admin
const createNews = asyncHandler(async (req, res) => {
  const { title, content, source, isImportant } = req.body;

  const news = new News({
    title,
    content,
    source,
    isImportant: isImportant || false,
  });

  const createdNews = await news.save();
  res.status(201).json(createdNews);
});

// @desc    Delete a news item
// @route   DELETE /api/news/:id
// @access  Private/Admin
const deleteNews = asyncHandler(async (req, res) => {
  const news = await News.findById(req.params.id);

  if (news) {
    await news.deleteOne();
    res.json({ message: 'News removed' });
  } else {
    res.status(404);
    throw new Error('News not found');
  }
});

module.exports = {
  getNews,
  createNews,
  deleteNews,
};