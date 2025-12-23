const mongoose = require('mongoose');
const Item = require('./models/Item'); // Adjust path if necessary
require('dotenv').config();

// The data we want to insert
const seedItems = [
  {
    title: "iPhone 13 Pro",
    description: "Black iPhone 13 Pro with a blue case. Has a small scratch on the back. Contains important photos and contacts.",
    category: "Electronics",
    status: "lost",
    dateReported: new Date("2024-01-15"),
    location: "Library 2nd Floor",
    reportedBy: "Sarah Johnson",
  },
  {
    title: "Red Nike Backpack",
    description: "Red Nike backpack with laptop compartment. Contains textbooks and notebooks for Computer Science classes.",
    category: "Others",
    status: "found",
    dateReported: new Date("2024-01-14"),
    location: "Student Center",
    reportedBy: "Mike Chen",
  },
  {
    title: "Student ID Card",
    description: "University student ID card for Maria Rodriguez, Student ID: 123456789",
    category: "ID Cards",
    status: "found",
    dateReported: new Date("2024-01-13"),
    location: "Cafeteria",
    reportedBy: "Avik Bose",
  },
  {
    title: "Calculus Textbook",
    description: "Stewart Calculus 8th Edition textbook. Has highlights and notes throughout the chapters.",
    category: "Books",
    status: "lost",
    dateReported: new Date("2024-01-12"),
    location: "Mathematics Building",
    reportedBy: "Emily Wilson",
  },
];

// We need to modify our Item Schema slightly to match this data
// Go to `models/Item.js` and update it before running this script!

const seedDB = async () => {
  try {
    // Connect to the database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing items from the collection
    await Item.deleteMany({});
    console.log('Existing items cleared.');

    // Insert the new seed data
    await Item.insertMany(seedItems);
    console.log('Database seeded successfully! ✅');

  } catch (err) {
    console.error('Seeding failed:', err.message);
  } finally {
    // Disconnect from the database
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
};

seedDB();