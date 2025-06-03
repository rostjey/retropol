import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Giriş yapmış kullanıcıyı doğrular
export const protectRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    
    // protectRoute.js'de en başa ekleyin:
    console.log('Gelen cookies:', req.cookies);
    console.log('Headers:', req.headers);

    if (!accessToken) {
      return res.status(401).json({ message: "Unauthorized - No access token provided" });
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Unauthorized - Access token expired" });
      }
      throw error;
    }
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized - Invalid access token" });
  }
};

// Admin kullanıcı mı kontrol eder
export const adminRoute = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied - Admin only" });
  }
};
// Kullanıcı rolünü kontrol eder