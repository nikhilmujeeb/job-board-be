import User from '../models/User.js';

export const manageUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }

    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const checkUserAdmin = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      res.json({ isAdmin: true });
    } else {
      res.status(403).json({ message: 'User is not an admin' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

