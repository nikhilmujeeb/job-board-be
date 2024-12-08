import User from '../models/User.js'; // Ensure you import your User model

export const manageUsers = async (req, res) => {
  try {
    // Check if the logged-in user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }

    // Fetch all users
    const users = await User.find();

    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Endpoint to make a user an admin
export const makeAdmin = async (req, res) => {
  try {
    // Check if the logged-in user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }

    const { userId } = req.params;  // Get userId from request parameters
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Change user role to admin
    user.role = 'admin';
    await user.save();

    res.json({ message: 'User promoted to admin successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Endpoint to delete a user
export const deleteUser = async (req, res) => {
  try {
    // Check if the logged-in user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }

    const { userId } = req.params;  // Get userId from request parameters
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete the user
    await user.remove();

    res.json({ message: 'User deleted successfully' });
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

