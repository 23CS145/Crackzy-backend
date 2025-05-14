const Test = require('../models/Test');
const asyncHandler = require('express-async-handler');

const getTests = asyncHandler(async (req, res) => {
  const tests = await Test.find({}).populate('createdBy', 'name');
  res.json(tests);
});

const getTestById = asyncHandler(async (req, res) => {
  const test = await Test.findById(req.params.id).populate('createdBy', 'name');

  if (test) {
    res.json(test);
  } else {
    res.status(404);
    throw new Error('Test not found');
  }
});

const createTest = asyncHandler(async (req, res) => {
  const { title, description, duration, questions } = req.body;

  const test = new Test({
    title,
    description,
    duration,
    questions,
    createdBy: req.user._id,
  });

  const createdTest = await test.save();
  res.status(201).json(createdTest);
});

const updateTest = asyncHandler(async (req, res) => {
  const { title, description, duration, questions } = req.body;

  const test = await Test.findById(req.params.id);

  if (test) {
    test.title = title || test.title;
    test.description = description || test.description;
    test.duration = duration || test.duration;
    test.questions = questions || test.questions;

    const updatedTest = await test.save();
    res.json(updatedTest);
  } else {
    res.status(404);
    throw new Error('Test not found');
  }
});

const deleteTest = asyncHandler(async (req, res) => {
  const test = await Test.findById(req.params.id);

  if (test) {
    await test.deleteOne();
    res.json({ message: 'Test removed' });
  } else {
    res.status(404);
    throw new Error('Test not found');
  }
});

const getTestsByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  
  const tests = await Test.find({ category })
    .populate('createdBy', 'name')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: tests.length,
    data: tests
  });
});

module.exports = {
  getTests,
  getTestById,
  createTest,
  updateTest,
  deleteTest,
  getTestsByCategory
};