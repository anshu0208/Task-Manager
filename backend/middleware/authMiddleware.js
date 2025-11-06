import jwt from "jsonwebtoken";
import User from "../models/userModels.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";

// ✅ Authentication Middleware
export default async function authMiddleware(req, res, next) {
  // 🔐 Get token from Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token missing.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    // 🧩 Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET);

    // 🔍 Fetch user (exclude password)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    // ✅ Attach user to request and continue
    req.user = user;
    next();

  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return res.status(401).json({
      success: false,
      message: "Token invalid or expired.",
    });
  }
}
