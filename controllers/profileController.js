import Profile from '../models/Profile.js';

// Controller to create or update a profile
export const createOrUpdateProfile = async (req, res) => {
  const {
    firstName, middleName, lastName, dateOfBirth, address, email, phone,
    bio, skills, education, experience, socialLinks
  } = req.body;

  // Validate required fields
  const requiredFields = [
    firstName, lastName, dateOfBirth, address, email, phone, bio, skills, education, experience, socialLinks,
  ];
  
  if (requiredFields.some(field => !field)) {
    return res.status(400).json({ message: 'All fields are required to create or update a profile.' });
  }

  try {
    const profileData = {
      user: req.user.userId,
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      address,
      email,
      phone,
      bio,
      skills,
      education,
      experience,
      socialLinks,
    };

    const profile = await Profile.findOneAndUpdate(
      { user: req.user.userId },
      { $set: profileData },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: 'Profile saved successfully.', profile });
  } catch (error) {
    console.error('Error saving profile:', error);
    res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
};

// Controller to retrieve a profile by ID
export const getProfileById = async (req, res) => {
  const { id } = req.params;

  console.log(`Fetching profile for user ID: ${id}`);  // Log for debugging

  try {
    const profile = await Profile.findById(id).populate('user', 'name email');

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found.' });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile. Please try again later.' });
  }
};

// Controller to retrieve all profiles
export const getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', 'name email');
    const BASE_URL = process.env.BASE_URL || 'https://job-board-fe-pwmj.onrender.com';

    const profilesWithResumeUrls = profiles.map(profile => ({
      ...profile.toObject(),
      resume: profile.resume ? `${BASE_URL}/uploads/${profile.resume}` : null,
    }));

    res.status(200).json(profilesWithResumeUrls);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    res.status(500).json({ message: 'Failed to fetch profiles. Please try again later.' });
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
