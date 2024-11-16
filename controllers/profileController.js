import Profile from '../models/Profile.js';

export const createOrUpdateProfile = async (req, res) => {
  const { bio, skills, education, experience, socialLinks } = req.body;

  // Ensure that required fields are provided
  if (!bio || !skills || !education || !experience || !socialLinks) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Construct the profile data
    const profileData = {
      user: req.user.userId,  // Attach the logged-in user's ID
      bio,
      skills,
      education,
      experience,
      socialLinks,
    };

    // Find or create the profile for the logged-in user
    const profile = await Profile.findOneAndUpdate(
      { user: req.user.userId },  // Search for the profile using the user ID
      { $set: profileData },       // Set the profile data to be updated or created
      { new: true, upsert: true }  // Return the updated document, create a new one if not found
    );

    // Respond with the updated or created profile
    res.status(200).json({ message: 'Profile saved successfully', profile });
  } catch (error) {
    console.error(error);  // Log the error for debugging
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
