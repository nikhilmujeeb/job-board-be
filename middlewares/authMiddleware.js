import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    // Properly assigning user fields to `req.user`
    req.user = { 
      _id: decoded.userId, 
      role: decoded.role, 
      name: decoded.name 
    };
    
    // Correcting the log statement to match `req.user` structure
    console.log("User ID from authMiddleware:", req.user._id);

    next();
  });
};s

export const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }
  next();
};

