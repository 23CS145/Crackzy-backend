const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Note = require('../models/Note');
const User = require('../models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI);


const importData = async () => {
  try {
    await Note.deleteMany();

    const adminUser = await User.findOne({ email: 'admin@example.com' });
    const regularUser = await User.findOne({ email: 'john@example.com' });

    const notes = [
      {
        title: 'Mathematics Formulas',
        content: 'Important formulas for algebra and geometry',
        uploadedBy: adminUser._id,
      },
      {
        title: 'History Notes',
        content: 'World War II key events and dates',
        uploadedBy: regularUser._id,
      },
      {
        title: 'Chemistry Basics',
        content: 'Periodic table and chemical reactions',
        fileUrl: 'https://example.com/chemistry.pdf',
        uploadedBy: adminUser._id,
      },
    ];

    await Note.insertMany(notes);

    console.log('Notes Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();