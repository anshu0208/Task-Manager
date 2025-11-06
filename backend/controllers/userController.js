import ErrorHandler from "../middleware/errorMiddleware.js";
import { catchAsyncErrors } from "../middleware/catchAsyncError.js";
import User from "../models/userModels.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";


const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";
const TOKEN_EXPIRES = process.env.TOKEN_EXPIRES || "7d"; // default 7 days

// ✅ Token creation utility
const createToken = (userId) =>
  jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES });

                 // ✅ Register Controller
export const registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  // 🛑 Validate required fields
  if (!name || !email || !password) {
    return next(new ErrorHandler("All fields are required.", 400));
  }

  // 🛡 Password validation
  if (password.length < 8 || password.length > 16) {
    return next(
      new ErrorHandler("Password must be between 8 and 16 characters.", 400)
    );
  }

  // 📧 Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler("User with this email already exists.", 400));
  }

  // 🔒 Hash password securely
  const hashedPassword = await bcrypt.hash(password, 10);

  // 🧾 Create new user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  // 🎟 Generate JWT token
  const token = createToken(user._id);

  // ✅ Send success response
  return res.status(201).json({
    success: true,
    message: "User registered successfully.",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

                   // ✅ Login Controller
export const loginUser = catchAsyncErrors(async (req, res, next) => {
  // 👇 ADD THIS LINE
  console.log("LOGIN ATTEMPT - REQ.BODY:", req.body);
  const { email, password } = req.body;

  // 🧾 Basic validation
  if (!email || !password) {
    return next(new ErrorHandler("Email and password are required.", 400));
  }

  // 🔍 Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("Invalid email or password.", 401));
  }

  // 🔒 Compare entered password with stored hash
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new ErrorHandler("Invalid email or password.", 401));
  }

  // 🎟 Generate JWT token
  const token = createToken(user._id);

  // ✅ Send success response
  return res.status(200).json({
    success: true,
    message: "Login successful.",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

        // ✅ GET CURRENT USER
export const getCurrentUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("name email");

  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  res.status(200).json({
    success: true,
    message: "Current user fetched successfully.",
    user,
  });
});


// ✅           UPDATE USER PROFILE
export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const { name, email } = req.body;

  // 🧾 Validate inputs
  if (!name || !email || !validator.isEmail(email)) {
    return next(new ErrorHandler("Please provide a valid name and email.", 400));
  }

  // 📧 Check if email already belongs to another user
  const emailExists = await User.findOne({
    email,
    _id: { $ne: req.user.id },
  });

  if (emailExists) {
    return next(new ErrorHandler("Email already in use by another account.", 409));
  }

  // 🧑‍💼 Update user
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { name, email },
    {
      new: true,
      runValidators: true,
      select: "name email",
    }
  );

  if (!updatedUser) {
    return next(new ErrorHandler("User not found.", 404));
  }

  res.status(200).json({
    success: true,
    message: "Profile updated successfully.",
    user: updatedUser,
  });
});

            // CHANGE PASSWORD FUNCTION

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  // 🧾 Validate input
  if (!currentPassword || !newPassword) {
    return next(new ErrorHandler("Current and new password are required.", 400));
  }

  if (newPassword.length < 8 || newPassword.length > 16) {
    return next(
      new ErrorHandler("New password must be between 8 and 16 characters.", 400)
    );
  }

  // 🔍 Find user by ID
  const user = await User.findById(req.user.id).select("+password");
  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  // 🔐 Compare old password
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return next(new ErrorHandler("Current password is incorrect.", 401));
  }

  // 🔒 Hash and save new password
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  // ✅ Send response
  res.status(200).json({
    success: true,
    message: "Password updated successfully.",
  });
});

export const dvcxfzster = catchAsyncErrors(async (req, res, next) => {});