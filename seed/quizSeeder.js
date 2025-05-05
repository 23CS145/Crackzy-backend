const mongoose = require('mongoose');
const dotenv = require('dotenv');
const QuizQuestion = require('../models/QuizQuestion');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const importData = async () => {
  try {
    await QuizQuestion.deleteMany();

    const quizQuestions = [
      {
        questionText: 'What is the largest planet in our solar system?',
        options: [
          { optionText: 'Earth', isCorrect: false },
          { optionText: 'Jupiter', isCorrect: true },
          { optionText: 'Saturn', isCorrect: false },
          { optionText: 'Mars', isCorrect: false },
        ],
        category: 'Science',
      },
      {
        questionText: 'Which country hosted the 2020 Summer Olympics?',
        options: [
          { optionText: 'China', isCorrect: false },
          { optionText: 'Japan', isCorrect: true },
          { optionText: 'Brazil', isCorrect: false },
          { optionText: 'USA', isCorrect: false },
        ],
        category: 'Sports',
      },
      {
        questionText: 'Who painted the Mona Lisa?',
        options: [
          { optionText: 'Vincent van Gogh', isCorrect: false },
          { optionText: 'Pablo Picasso', isCorrect: false },
          { optionText: 'Leonardo da Vinci', isCorrect: true },
          { optionText: 'Michelangelo', isCorrect: false },
        ],
        category: 'Art',
      },
      {
        questionText: 'What is the capital of Australia?',
        options: [
          { optionText: 'Sydney', isCorrect: false },
          { optionText: 'Melbourne', isCorrect: false },
          { optionText: 'Canberra', isCorrect: true },
          { optionText: 'Perth', isCorrect: false },
        ],
        category: 'Geography',
      },
      {
        questionText: 'Which element has the chemical symbol "O"?',
        options: [
          { optionText: 'Gold', isCorrect: false },
          { optionText: 'Oxygen', isCorrect: true },
          { optionText: 'Osmium', isCorrect: false },
          { optionText: 'Oganesson', isCorrect: false },
        ],
        category: 'Science',
      },
    ];

    await QuizQuestion.insertMany(quizQuestions);

    console.log('Quiz Questions Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();