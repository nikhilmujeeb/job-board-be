import Profile from '../models/Profile.js';

export const createOrUpdateProfile = async (req, res) => {
  const {
    firstName, middleName, lastName, dateOfBirth, address, email, phone,
    bio, skills, education, experience, socialLinks
  } = req.body;

  // Ensure that required fields are provided
  if (!firstName || !lastName || !dateOfBirth || !address || !email || !phone || !bio || !skills || !education || !experience || !socialLinks) {
    return res.status(400).json({ message: 'All fields are required.' });
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

    res.status(200).json({ message: 'Profile saved successfully', profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving profile. Please try again later.' });
  }
};

// Controller for retrieving a profile by ID
export const getProfileById = async (req, res) => {
  const { id } = req.params;  // Get the profile ID from the route parameter

  try {
    const profile = await Profile.findById(id).populate('user', 'name email');  // Populate the user info

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json(profile);  // Send the profile data as the response
  } catch (error) {
    console.error(error);  // Log the error for debugging
    res.status(500).json({ message: 'Error fetching profile. Please try again later.' });
  }
};
