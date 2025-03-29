import express from 'express';
import { userRegister, userLogin, Logout, adminLogin, forgotPassword, resetPassword } from '../Controller/authController.js';
const authRoutes = express.Router();

authRoutes.post('/user/register', userRegister);
authRoutes.post('/user/login', userLogin);
authRoutes.post('/user/forgot-password', forgotPassword);
authRoutes.post('/user/reset-password', resetPassword);
authRoutes.post('/admin/login', adminLogin);
authRoutes.get('/logout', Logout);

export default authRoutes;