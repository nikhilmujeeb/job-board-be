import Profile from '../models/Profile.js';
import fs from 'fs';
import uploadToGitHub from '../utils/githubUploader.js';

export const createOrUpdateProfile = async (req, res) => {
  const {
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
    experience,  // Optional field
    socialLinks,
    profileId,  // Profile ID for updating
  } = req.body;

  // Log incoming request body
  console.log('Request body:', req.body);

  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: 'Unauthorized: User not authenticated.' });
  }

  // Ensure required fields are provided, excluding 'experience'
  if (!firstName || !lastName || !dateOfBirth || !address || !email || !phone || !bio || !skills || !education) {
    console.log('Missing required fields:', { firstName, lastName, dateOfBirth, address, email, phone, bio, skills, education });
    return res.status(400).json({ message: 'All required fields are not provided.' });
  }

  try {
    // Parse socialLinks if it's a string (to handle stringified JSON)
    let parsedSocialLinks = socialLinks;
    if (typeof socialLinks === 'string') {
      try {
        parsedSocialLinks = JSON.parse(socialLinks);
      } catch (error) {
        return res.status(400).json({ message: 'Invalid socialLinks format' });
      }
    }

    // Parse experience if it's a string (to handle stringified JSON)
    let parsedExperience = experience;
    if (typeof experience === 'string') {
      try {
        parsedExperience = JSON.parse(experience);
      } catch (error) {
        return res.status(400).json({ message: 'Invalid experience format' });
      }
    }

    // Prepare profile data to be saved
    const profileData = {
      user: req.user._id,  // Link the profile to the user
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
      experience: parsedExperience,  // Use parsed experience here
      socialLinks: parsedSocialLinks,  // Use parsed socialLinks here
    };

    // Log the profile data before updating or creating
    console.log('Profile data to be saved:', profileData);

    // If profileId is provided, update the existing profile; otherwise, create a new one
    const profile = await Profile.findOneAndUpdate(
      { _id: profileId || req.body.profileId },  // Use the provided profileId or create a new one
      { $set: profileData },
      { new: true, upsert: true }
    );

    // Log the profile after saving
    console.log('Profile saved:', profile);

    res.status(200).json({ message: 'Profile saved successfully.', profile });
  } catch (error) {
    console.error('Error saving profile:', error.message);
    res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
};

export const getProfileById = async (req, res) => {
  const { id } = req.params;  // Profile ID

  if (!id) {
    return res.status(400).json({ message: 'Profile ID is required.' });
  }

  try {
    // Fetch the profile using the profile ID
    const profile = await Profile.findById(id).populate('user', 'firstName lastName email');

    if (!profile) {
      console.warn(`Profile not found for profile ID: ${id}`);
      return res.status(404).json({ message: 'Profile not found.' });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile. Please try again later.' });
  }
};

export const getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', 'name email');
    const BASE_URL = process.env.BASE_URL || 'https://job-board-fe-pwmj.onrender.com';

    const profilesWithResumeUrls = profiles.map((profile) => ({
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
  const { id } = req.params;  // Profile ID
  const updatedData = req.body;

  if (!id) {
    return res.status(400).json({ message: 'Profile ID is required.' });
  }

  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: 'Unauthorized: User not authenticated.' });
  }

  if (req.file) {
    updatedData.resume = req.file.path; 
  }

  try {
    // Update the profile using the profile ID
    const profile = await Profile.findByIdAndUpdate(id, updatedData, { new: true });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found.' });
    }

    res.status(200).json({ success: true, profile });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile. Please try again later.',
    });
  }
};
