import express from 'express';
import { userRegister, userLogin, Logout, adminLogin, forgotPassword, resetPassword, verifyOTP, checkAuth, getUsers, getUserById, deleteUser } from '../Controller/authController.js';
import { authMiddleware } from '../Middleware/authMiddleware.js';
import { adminMiddleware } from '../Middleware/adminMiddleware.js';
import { get } from 'mongoose';
const authRoutes = express.Router();

authRoutes.post('/user/register', userRegister);
authRoutes.post('/user/login', userLogin);
authRoutes.post('/user/forgot-password', forgotPassword);
authRoutes.post('/user/verify-otp', verifyOTP);
authRoutes.post('/user/reset-password', resetPassword);
authRoutes.post('/admin/login', adminLogin);
authRoutes.get('/admin/getUsers', adminMiddleware, getUsers);
authRoutes.get('/admin/getUsersById/:id', adminMiddleware, getUserById);
authRoutes.delete('/admin/deleteUser/:id', adminMiddleware, deleteUser);
authRoutes.get('/user/logout', Logout);
authRoutes.get('/check-auth', authMiddleware, checkAuth);

export default authRoutes;