import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'fallback_secret_for_development',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

export default generateToken;
