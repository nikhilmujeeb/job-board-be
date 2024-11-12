import Job from '../models/Job.js';
import path from 'path';

export const approveJobRequest = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ message: 'Job approved successfully', job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createJobRequest = async (req, res) => {
  const { title, description, requirements } = req.body;

  const job = new Job({
    title,
    description,
    requirements,
    postedBy: req.user.userId, 
    isApproved: false  
  });

  try {
    const savedJob = await job.save(); 
    res.status(201).json({ message: 'Job request submitted and pending approval.', job: savedJob });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ isApproved: true }); 
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadResume = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    res.status(200).json({ message: 'Resume uploaded successfully', filePath: req.file.path });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};