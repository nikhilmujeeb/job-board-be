import Job from '../models/Job.js';
import path from 'path';

export const approveJobRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const job = await Job.findByIdAndUpdate(
      id,
      { status: 'open', isApproved: true },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json({ message: 'Job approved successfully', job });
  } catch (error) {
    console.error('Error approving job:', error);
    res.status(500).json({ message: 'Failed to approve job' });
  }
};

export const createJobRequest = async (req, res) => {
  const { title, description, requirements, location, salaryRange, category, experience, company, contact, jobType } = req.body;

  const job = new Job({
    title,
    description,
    requirements,
    location,
    salaryRange,
    category,
    experience,
    company,
    contact,
    jobType, // Add jobType here
    postedBy: req.user.userId,
    isApproved: false,
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

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name email');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job); // jobType should be included here
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchJobs = async (req, res) => {
  const { query, jobType } = req.query; // Handle jobType filter as well

  try {
    const searchCriteria = {
      isApproved: true,
      $or: [
        { title: new RegExp(query, 'i') },
        { location: new RegExp(query, 'i') },
        { requirements: new RegExp(query, 'i') },
        { category: new RegExp(query, 'i') },
        { company: new RegExp(query, 'i') },
        ...(jobType ? [{ jobType: new RegExp(jobType, 'i') }] : []), // Include jobType filter if provided
      ],
    };

    const jobs = await Job.find(searchCriteria);

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const applyForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.applicants.includes(req.user.userId)) {
      return res.status(400).json({ message: 'Already applied for this job' });
    }

    job.applicants.push(req.user.userId);
    await job.save();
    res.status(200).json({ message: 'Applied successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getApplicationStatus = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const isApplied = job.applicants.includes(req.user.userId);
    res.json({ applied: isApplied });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateJobListing = async (req, res) => {
  const { title, description, requirements, location, salaryRange, category, experience, company, contact, jobType } = req.body;

  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    Object.assign(job, { title, description, requirements, location, salaryRange, category, experience, company, contact, jobType }); // Add jobType here
    await job.save();

    res.status(200).json({ message: 'Job listing updated', job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteJob = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  const userRole = req.user.role;

  try {
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (userRole !== 'admin' && job.postedBy.toString() !== userId) {
      return res.status(403).json({ message: 'Forbidden: Only the admin or the job poster can delete this job' });
    }

    await job.deleteOne();
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('applicants', 'name email');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job.applicants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const jobDashboard = async (req, res) => {
  const userId = req.user.userId;
  const userRole = req.user.role;

  try {
    let jobs;

    if (userRole === 'admin') {
      jobs = await Job.find();
    } else if (userRole === 'employer') {
      jobs = await Job.find({ postedBy: userId });
    } else if (userRole === 'jobseeker') {
      jobs = await Job.find({ isApproved: true });
    } else {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPendingJobs = async (req, res) => {
  try {
    const pendingJobs = await Job.find({ isApproved: false }); // Query for unapproved jobs
    res.status(200).json({
      message: 'Pending jobs retrieved successfully',
      jobs: pendingJobs,
    });
  } catch (error) {
    console.error('Error fetching pending jobs:', error);
    res.status(500).json({ message: 'Failed to retrieve pending jobs' });
  }
};
