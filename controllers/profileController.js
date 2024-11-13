import Profile from '../models/Profile.js';

export const createOrUpdateProfile = async (req, res) => {
  const { bio, skills, education, experience, socialLinks } = req.body;

  try {
    const profileData = { user: req.user.userId, bio, skills, education, experience, socialLinks };
    
    const profile = await Profile.findOneAndUpdate(
      { user: req.user.userId },
      { $set: profileData },
      { new: true, upsert: true } 
    );

    res.status(200).json({ message: 'Profile saved successfully', profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.userId }).populate('user', 'name email');
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
