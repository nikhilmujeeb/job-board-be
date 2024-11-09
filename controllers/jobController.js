import Job from '../models/Job.js';

// Create Job Listing
export const createJob = async (req, res) => {
  const { title, description, requirements } = req.body;
  const job = new Job({ title, description, requirements, employer: req.user.userId });
  
  try {
    await job.save();
    res.status(201).json({ message: 'Job listing created' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Verified Job Listings
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ isVerified: true });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
