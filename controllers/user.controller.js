const HttpError = require("../models/error");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { uploadFileUtility } = require("../middlewares/file-upload.middleware");

// @desc    Get all users from database
// @route   GET /api/users/all
// @access  PUBLIC
const getAllUsers = async (req, res) => {
  let users;

  try {
    users = await User.find();
  } catch (error) {
    throw new HttpError(
      "Error while finding users. Error : ",
      error.message,
      500
    );
  }

  res.status(200).json({
    message: "Users found",
    users: users.map((user) => user.toObject({ getters: true })),
  });
};

// @desc    Get current logged in user
// @route   GET /api/users/current
// @access  PRIVATE
const getCurrentUser = async (req, res) => {
  let userId = req.user._id;
  let user;

  try {
    user = await User.findById(userId);
  } catch (error) {
    throw new HttpError(
      "Error while finding user. Error : ",
      error.message,
      500
    );
  }

  res.status(200).json({
    message: "User found",
    user: user.toObject({ getters: true }),
  });
};

// @desc    Get an user by their ID
// @route   GET /api/users/one/:userId
// @access  PUBLIC
const getUserById = async (req, res) => {
  let { userId } = req.params;
  let user;

  try {
    user = await User.findById(userId);
  } catch (error) {
    throw new HttpError(
      "Error while finding user. Error : ",
      error.message,
      500
    );
  }

  res.status(200).json({
    message: "User found",
    user: user.toObject({ getters: true }),
  });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  PUBLIC
const registerUser = async (req, res) => {
  const { name, email, password, gender, age, address, state, city, zip } =
    req.body;

  const fileName = uuidv4();
  const imageUrl = await uploadFileUtility(req.file, fileName, "Users");

  // Check for existing user
  const existingUser = await User.findOne({ email: email });

  if (existingUser) {
    res.status(400);
    throw new HttpError("User already exists");
  }

  // Hash Password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    gender,
    age,
    address,
    city,
    state,
    zip,
    imageUrl,
  });

  if (user) {
    res.status(201).json({
      message: "User registered successfully",
      _id: user.id,
      token: generateToken(user.id),
    });
  } else {
    res.status(400);
    throw new HttpError("Invalid user data");
  }
};

// @desc    Authenticate An User
// @route   POST /api/users/login
// @access  PUBLIC
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  //   Fetch user
  const user = await User.findOne({ email });

  //   Compare Passwords
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(201).json({
      message: "User logged in successfully",
      _id: user.id,
      token: generateToken(user.id),
    });
  } else {
    res.status(400);
    throw new HttpError("Invalid credentials");
  }
};

// @desc    Update An User
// @route   PATCH /api/users/update
// @access  PRIVATE
const updateUser = async (req, res) => {
  const { name, email, gender, age, address, state, city, zip, imageUpdate } =
    req.body;

  let userId = req.user._id;
  let imageUrl = req.user.imageUrl;

  if (imageUpdate == "true") {
    imageUrl = await uploadFileUtility(req.file, uuidv4(), "Users");
  }

  try {
    await User.findByIdAndUpdate(userId, {
      $set: {
        name,
        email,
        gender,
        age,
        address,
        state,
        city,
        zip,
        imageUrl,
      },
    });
  } catch (error) {
    throw new HttpError(
      "Error while updating user details. Error : ",
      error.message
    );
  }

  res.status(200).json({ message: "User details updated successfully" });
};

// @desc    Delete An User
// @route   DELETE /api/users/delete
// @access  PRIVATE
const deleteUser = async (req, res) => {
  let userId = req.user._id;

  try {
    await User.findByIdAndDelete(userId);
  } catch (error) {
    throw new HttpError("Error while deleting user. Error: ", error.message);
  }

  res.status(200).json({ message: "User deleted successfully" });
};

// Function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  getAllUsers,
  getCurrentUser,
  getUserById,
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
};
