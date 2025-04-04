import express from 'express';
import { userRegister, userLogin, Logout, adminLogin, forgotPassword, resetPassword, verifyOTP, checkAuth } from '../Controller/authController.js';
import { authMiddleware } from '../Middleware/authMiddleware.js';

const authRoutes = express.Router();

authRoutes.post('/user/register', userRegister);
authRoutes.post('/user/login', userLogin);
authRoutes.post('/user/forgot-password', forgotPassword);
authRoutes.post('/user/verify-otp', verifyOTP);
authRoutes.post('/user/reset-password', resetPassword);
authRoutes.post('/admin/login', adminLogin);
authRoutes.get('/user/logout', Logout);
authRoutes.get('/check-auth', authMiddleware, checkAuth);

export default authRoutes;