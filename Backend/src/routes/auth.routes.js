import express from 'express';
import { register, login, logout, getMe } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { registerValidator, loginValidator } from '../validators/auth.validator.js';

const router = express.Router();

// Authentication Routes
router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.post('/logout', logout);

// Protected Route (Verification of auth middleware)
router.get('/me', protect, getMe);

export default router;
