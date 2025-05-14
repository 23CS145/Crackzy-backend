const Note = require('../models/Note');
const asyncHandler = require('express-async-handler');

const getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({}).populate('uploadedBy', 'name');
  res.json(notes);
});

const getNoteById = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id).populate('uploadedBy', 'name');
  
  if (note) {
    res.json(note);
  } else {
    res.status(404);
    throw new Error('Note not found');
  }
});

const createNote = asyncHandler(async (req, res) => {
  const { title, content, fileUrl } = req.body;

  const note = new Note({
    title,
    content,
    fileUrl,
    uploadedBy: req.user._id,
  });

  const createdNote = await note.save();
  res.status(201).json(createdNote);
});

const updateNote = asyncHandler(async (req, res) => {
  const { title, content, fileUrl } = req.body;
  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }

  if (note.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to update this note');
  }

  note.title = title || note.title;
  note.content = content || note.content;
  note.fileUrl = fileUrl || note.fileUrl;

  const updatedNote = await note.save();
  res.json(updatedNote);
});

const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (note) {
    if (
      note.uploadedBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      res.status(401);
      throw new Error('Not authorized to delete this note');
    }

    await note.deleteOne();
    res.json({ message: 'Note removed' });
  } else {
    res.status(404);
    throw new Error('Note not found');
  }
});

module.exports = {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
};