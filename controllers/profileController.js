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
    experience,
    socialLinks,
    profileId,  // Profile ID to update the existing profile
  } = req.body;

  console.log('Request body:', req.body);

  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: 'Unauthorized: User not authenticated.' });
  }

  if (!firstName || !lastName || !dateOfBirth || !address || !email || !phone || !bio || !skills) {
    console.log('Missing required fields:', { firstName, lastName, dateOfBirth, address, email, phone, bio, skills });
    return res.status(400).json({ message: 'All required fields are not provided.' });
  }

  try {
    let parsedSocialLinks = socialLinks;
    if (typeof socialLinks === 'string') {
      try {
        parsedSocialLinks = JSON.parse(socialLinks);
      } catch (error) {
        return res.status(400).json({ message: 'Invalid socialLinks format' });
      }
    }

    let parsedExperience = experience;
    if (typeof experience === 'string') {
      try {
        parsedExperience = JSON.parse(experience);
      } catch (error) {
        return res.status(400).json({ message: 'Invalid experience format' });
      }
    }

    let parsedEducation = education;
    if (typeof education === 'string') {
      try {
        parsedEducation = JSON.parse(education);
      } catch (error) {
        return res.status(400).json({ message: 'Invalid education format' });
      }
    }

    const profileData = {
      user: req.user._id,  // Store the authenticated user's ID in the profile
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      address,
      email,
      phone,
      bio,
      skills,
      education: parsedEducation, 
      experience: parsedExperience, 
      socialLinks: parsedSocialLinks, 
    };

    console.log('Profile data to be saved:', profileData);

    let profile;
    if (profileId) {
      // If profileId is provided, update the existing profile
      profile = await Profile.findOneAndUpdate(
        { _id: profileId },  // Search by profile _id
        { $set: profileData },  // Update profile data
        { new: true }  // Return the updated profile
      );
    } else {
      // If no profileId is provided, create a new profile
      profile = new Profile(profileData);
      await profile.save();  // Save the new profile
    }

    console.log('Profile saved:', profile);

    res.status(200).json({ message: 'Profile saved successfully.', profile });
  } catch (error) {
    console.error('Error saving profile:', error.message);
    res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
};

export const getProfileByUserId = async (req, res) => {
  const { userId } = req.params;  // Use userId to fetch profile

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required.' });
  }

  try {
    // Fetch the profile by userId (user field in Profile model)
    const profile = await Profile.findOne({ user: userId }).populate('user', 'firstName lastName email');

    if (!profile) {
      console.warn(`Profile not found for user ID: ${userId}`);
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
  let updatedData = req.body;

  if (!id) {
    return res.status(400).json({ message: 'Profile ID is required.' });
  }

  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: 'Unauthorized: User not authenticated.' });
  }

  if (req.file) {
    updatedData.resume = req.file.path; 
  }

  // Ensure education is an array of objects (if it exists)
  if (updatedData.education && !Array.isArray(updatedData.education)) {
    try {
      updatedData.education = JSON.parse(updatedData.education);  // If it's a string, parse it into an array
    } catch (error) {
      return res.status(400).json({ message: 'Invalid education data format.' });
    }
  }

  // Ensure experience is an array of objects (if it exists)
  if (updatedData.experience && !Array.isArray(updatedData.experience)) {
    try {
      updatedData.experience = JSON.parse(updatedData.experience);  // If it's a string, parse it into an array
    } catch (error) {
      return res.status(400).json({ message: 'Invalid experience data format.' });
    }
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
