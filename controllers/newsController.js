const News = require('../models/News');
const asyncHandler = require('express-async-handler');

const getNews = asyncHandler(async (req, res) => {
  const { category } = req.query;
  
  const query = {};
  if (category) {
    query.category = category;
  }

  const news = await News.find(query).sort({ createdAt: -1 });
  res.json(news);
});

const getNewsById = asyncHandler(async (req, res) => {
  const newsItem = await News.findById(req.params.id);
  
  if (newsItem) {
    res.json(newsItem);
  } else {
    res.status(404);
    throw new Error('News not found');
  }
});

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

const updateNews = asyncHandler(async (req, res) => {
  const { title, content, source, isImportant } = req.body;
  const news = await News.findById(req.params.id);

  if (!news) {
    res.status(404);
    throw new Error('News not found');
  }

  news.title = title || news.title;
  news.content = content || news.content;
  news.source = source || news.source;
  news.isImportant = isImportant || news.isImportant;

  const updatedNews = await news.save();
  res.json(updatedNews);
});

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

const getNewsCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await News.aggregate([
      { $group: { _id: "$category" } },
      { $project: { _id: 0, category: "$_id" } }
    ]);
    
    const categoryList = categories.map(c => c.category);
    res.json(categoryList);
  } catch (error) {
    console.error('Get Categories Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch categories',
      details: error.message 
    });
  }
});
module.exports = {
  getNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  getNewsCategories
};