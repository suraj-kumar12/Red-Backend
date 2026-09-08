// Auth Service - Business logic for user registration, login, and authentication
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

/**
 * Register a new user
 * @param {Object} userData - { name, email, password, role }
 * @returns {Promise<Object>} - { user, token }
 */
export const registerUser = async ({ name, email, password, role }) => {
  
  const normalizedEmail = email.toLowerCase().trim();

  // Check if user already exists
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    const error = new Error('User with this email already exists');
    error.statusCode = 409;
    throw error;
  }

  // Create new user (password is automatically hashed via mongoose pre-save hook)
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    ...(role && { role }),
  });

  // Generate JWT token with userId
  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

/**
 * Authenticate existing user
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} - { user, token }
 */
export const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  // Find user by email
  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // Verify password with bcryptjs
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // Generate JWT token with userId
  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

/**
 * Get user profile by ID
 * @param {string} userId
 * @returns {Promise<Object>} - user data
 */
export const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

export default {
  registerUser,
  loginUser,
  getUserProfile,
};
