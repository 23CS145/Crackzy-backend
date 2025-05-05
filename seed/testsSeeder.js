const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Test = require('../models/Test');
const User = require('../models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const importData = async () => {
  try {
    await Test.deleteMany();

    const adminUser = await User.findOne({ email: 'admin@example.com' });

    const tests = [
      {
        title: 'General Knowledge Quiz',
        description: 'Test your general knowledge with this quiz',
        duration: 30,
        createdBy: adminUser._id,
        questions: [
          {
            questionText: 'What is the capital of France?',
            options: [
              { optionText: 'London', isCorrect: false },
              { optionText: 'Paris', isCorrect: true },
              { optionText: 'Berlin', isCorrect: false },
              { optionText: 'Madrid', isCorrect: false },
            ],
          },
          {
            questionText: 'Which planet is known as the Red Planet?',
            options: [
              { optionText: 'Venus', isCorrect: false },
              { optionText: 'Mars', isCorrect: true },
              { optionText: 'Jupiter', isCorrect: false },
              { optionText: 'Saturn', isCorrect: false },
            ],
          },
        ],
      },
      {
        title: 'Science Test',
        description: 'Basic science knowledge test',
        duration: 45,
        createdBy: adminUser._id,
        questions: [
          {
            questionText: 'What is H2O?',
            options: [
              { optionText: 'Hydrogen', isCorrect: false },
              { optionText: 'Oxygen', isCorrect: false },
              { optionText: 'Water', isCorrect: true },
              { optionText: 'Carbon Dioxide', isCorrect: false },
            ],
          },
          {
            questionText: 'What is the chemical symbol for gold?',
            options: [
              { optionText: 'Go', isCorrect: false },
              { optionText: 'Gd', isCorrect: false },
              { optionText: 'Au', isCorrect: true },
              { optionText: 'Ag', isCorrect: false },
            ],
          },
        ],
      },
    ];

    await Test.insertMany(tests);

    console.log('Tests Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();