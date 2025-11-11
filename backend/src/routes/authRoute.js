import express from 'express';
import { register, login, logout, refreshToken, verifyOtp, resendOtp } from '../controllers/authController.js';
import { verifyRT } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.post('/logout', logout);

router.post('/verify-otp', verifyOtp);

router.post('/resend-otp', resendOtp);

router.post('/refresh', verifyRT, refreshToken);

export default router;