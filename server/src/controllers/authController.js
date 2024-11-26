const User = require("../models/userModel");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwtToken");

const register = catchAsyncError(async (req, res, next) => {
  const { username, email, password } = req.body;

  const user = await User.create({
    username,
    email,
    password,
  });

  sendToken(user, 201, res);
});

const login = catchAsyncError(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new ErrorHandler("Please Enter Username & Password", 400));
  }

  const user = await User.findOne({ username });

  if (!user) {
    return next(new ErrorHandler("Invalid username or Password", 401));
  }

  if (user.status === "blocked") {
    return next(
      new ErrorHandler("Your account is blocked. Please contact support.", 403)
    );
  }

  try {
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid username or Password", 401));
    }

    sendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
});

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

const logout = catchAsyncError(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

module.exports = {
  register,
  login,
  logout,
  getUser,
};
