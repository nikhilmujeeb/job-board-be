import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Job from './models/Job.js'; // Adjust the path to the Job model

dotenv.config(); // Load environment variables from .env

// Connect to your database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

(async () => {
  try {
    // Fetch jobs and populate company name
    const appliedJobs = await Job.find().populate('company', 'name');
    console.log('Applied Jobs:', appliedJobs);

    mongoose.connection.close(); // Close connection after execution
  } catch (error) {
    console.error('Error fetching applied jobs:', error);
    mongoose.connection.close(); // Ensure connection is closed
  }
})();
