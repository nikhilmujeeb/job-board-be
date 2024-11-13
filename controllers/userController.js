import User from '../models/User.js';

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId); 

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password, ...userProfile } = user.toObject(); 
    res.json(userProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};