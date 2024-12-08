import mongoose from 'mongoose';
import connectDB from './config/db.js'; // Adjust the path to your database connection file
import Job from './models/Job.js'; // Adjust the path to your Job model

(async () => {
  try {
    // Connect to the database
    await connectDB();

    // Fetch jobs and populate the company name
    const appliedJobs = await Job.find().populate('company', 'name');
    console.log('Applied Jobs:', appliedJobs);

    // Close the database connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error fetching applied jobs:', error.message);
    mongoose.connection.close();
  }
})();
