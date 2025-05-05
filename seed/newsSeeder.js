const mongoose = require('mongoose');
const dotenv = require('dotenv');
const News = require('../models/News');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const importData = async () => {
  try {
    await News.deleteMany();

    const newsItems = [
      {
        title: 'New Education Policy Announced',
        content: 'The government has announced a new education policy that will change the way students learn in schools and colleges.',
        source: 'Ministry of Education',
        isImportant: true,
      },
      {
        title: 'Technology Trends in 2023',
        content: 'Artificial Intelligence and Machine Learning continue to dominate the technology landscape in 2023.',
        source: 'Tech News',
      },
      {
        title: 'Climate Change Conference Results',
        content: 'World leaders have agreed on new measures to combat climate change at the latest conference.',
        source: 'Environmental News',
      },
    ];

    await News.insertMany(newsItems);

    console.log('News Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();