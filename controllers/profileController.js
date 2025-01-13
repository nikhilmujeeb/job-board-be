import Profile from '../models/Profile.js';
import fs from 'fs';
import uploadToGitHub from '../utils/githubUploader.js';

export const createOrUpdateProfile = async (req, res) => {
  const {
    firstName, middleName, lastName, dateOfBirth, address, email, phone,
    bio, skills, education, experience, socialLinks
  } = req.body;

  const requiredFields = [
    firstName, lastName, dateOfBirth, address, email, phone, bio, skills, education, experience
  ];

  if (requiredFields.some(field => !field) || (Array.isArray(socialLinks) && socialLinks.length === 0)) {
    return res.status(400).json({ message: 'All fields are required to create or update a profile.' });
  }

  try {
    const profileData = {
      user: req.user._id,
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
      { user: req.user._id },
      { $set: profileData },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: 'Profile saved successfully.', profile });
  } catch (error) {
    console.error('Error saving profile:', error.message);
    res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
};

export const getProfileById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    const profile = await Profile.findOne({ user: id }).populate(
      "user",
      "firstName lastName email"
    );

    if (!profile) {
      return res.status(404).json({ message: "Profile not found for this user." });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Error fetching profile. Please try again later." });
  }
};

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

export const uploadResume = async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileContent = fs.readFileSync(filePath);
    const fileName = `resumes/${req.file.originalname}`;

    const result = await uploadToGitHub(fileName, fileContent);

    fs.unlinkSync(filePath);

    const resumeUrl = result.content.download_url; 

    await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $set: { resume: resumeUrl } },
      { new: true }
    );

    res.status(200).json({ message: 'Resume uploaded successfully to GitHub', data: result });
  } catch (error) {
    console.error('Error uploading resume:', error);
    res.status(500).json({ message: 'Failed to upload resume', error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  if (req.file) {
    updatedData.resume = req.file.path;
  }

  try {
    const profile = await Profile.findOneAndUpdate({ user: id }, updatedData, { new: true });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found for this user.' });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile. Please try again later.' });
  }
};
