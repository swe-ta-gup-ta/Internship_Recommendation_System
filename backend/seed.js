const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Internship = require('./models/Internship');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing internships
    await Internship.deleteMany({});
    console.log('Cleared existing internships.');

    // Read seed data
    const seedDataPath = path.join(__dirname, '..', 'database', 'seed_data.json');
    const rawData = fs.readFileSync(seedDataPath, 'utf-8');
    const internships = JSON.parse(rawData);

    // Insert seed data
    const result = await Internship.insertMany(internships);
    console.log(`Successfully seeded ${result.length} internships.`);

    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
