// Validation schemas and functions for Auth

export const validateEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

export const registerValidator = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Name is required and must be a non-empty string',
    });
  }

  if (!email || typeof email !== 'string' || email.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Email is required',
    });
  }

  if (!validateEmail(email.trim())) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address',
    });
  }

  if (!password || typeof password !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Password is required',
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long',
    });
  }

  next();
};

export const loginValidator = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string' || email.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Email is required',
    });
  }

  if (!validateEmail(email.trim())) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address',
    });
  }

  if (!password || typeof password !== 'string' || password.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Password is required',
    });
  }

  next();
};

export default {
  validateEmail,
  registerValidator,
  loginValidator,
};
