import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];  // Get token from Authorization header
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Log the token to check if it's coming correctly
  console.log("Received Token:", token);

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Log decoded token to see its structure
    console.log("Decoded Token:", decoded);  // This should include the user data (e.g., _id)
    
    req.user = decoded;  // Attach decoded user data to req.user
    next();  // Continue to the next middleware/route handler
  });
};


export const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }
  next();
};

