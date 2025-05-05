const Note = require('../models/Note');
const asyncHandler = require('express-async-handler');

// @desc    Get all notes
// @route   GET /api/notes
// @access  Private
const getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({}).populate('uploadedBy', 'name');
  res.json(notes);
});

// @desc    Create a note
// @route   POST /api/notes
// @access  Private
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

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (note) {
    // Check if the user is admin or the note creator
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
  createNote,
  deleteNote,
};