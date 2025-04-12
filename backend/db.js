
const mongoose = require('mongoose');
require('dotenv').config();

async function connectDB() {
   

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
    process.exit(1); // Exit process with failure
  }
}

module.exports = connectDB;
