import { generateToken } from "../Utils/jwtToken.js";
import { Customer } from "../Models/Customer.model.js";
import { sendMail } from "../Config/sendMail.js";

export const userRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await Customer.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists", user: existingUser });
        }
        const user = await Customer.create({
            name,
            email,
            password
        });
        const payload = {
            user: {
                id: user._id,
                email: user.email
            }
        }
        const token = generateToken(payload);
        res.cookie("scpToken", token, {
            httpOnly: true,
            path: "/",
            maxAge: 1 * 24 * 60 * 60 * 1000
        });
        res.status(201).json({ user });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
        console.log(err);
    }
}

export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Customer.findOne({
            email
        });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isMatch = await user.matchPasswords(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const payload = {
            user: {
                id: user._id,
                email: user.email,
                userType: "user"
            }
        }
        const token = generateToken(payload);
        res.cookie("scpToken", token, {
            httpOnly: true,
            path: "/",
            maxAge: 1 * 24 * 60 * 60 * 1000
        });
        res.status(200).json({ user });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
        console.log(err);
    }
}

export const adminLogin = async (req, res) => {
    try {
        console.log(process.env.ADMIN_EMAIL);

        const { email, password } = req.body;

        if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const payload = {
            user: {
                email: process.env.ADMIN_EMAIL,
                userType: "admin"
            }
        }
        const token = generateToken(payload);
        res.cookie("scpToken", token, {
            httpOnly: true,
            path: "/",
            maxAge: 1 * 24 * 60 * 60 * 1000
        });
        res.status(200).json({ message: "Logged in successfully as admin 😈" });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
        console.log(err);
    }
}

export const Logout = async (req, res) => {
    res.clearCookie("scpToken");
    res.status(200).json({ message: "Logged out successfully" });
}

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await Customer.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'No account found with this email' });
        }

        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);

        user.otp = otp;
        user.otpExpires = otpExpiry;
        await user.save();

        await sendMail(email, otp);

        res.json({
            success: true,
            message: 'Password reset OTP has been sent to your email'
        });
    } catch (error) {
        console.error('Error in forgotPassword:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process password reset request'
        });
    }
}

export const getUsers = async (req, res) => {
    try {
        const users = await Customer.find();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error in getUsers:', error);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
};
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await Customer.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error in getUserById:', error);
        res.status(500).json({ message: 'Failed to fetch user' });
    }
}
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await Customer.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error in deleteUser:', error);
        res.status(500).json({ message: 'Failed to delete user' });
    }
}

export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await Customer.findOne({
            email,
            otp,
            otpExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP'
            });
        }

        res.json({
            success: true,
            message: 'OTP verified successfully'
        });
    } catch (error) {
        console.error('Error in verifyOTP:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to verify OTP'
        });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        const user = await Customer.findOne({
            email,
            otp,
            otpExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP'
            });
        }

        user.password = newPassword;
        user.otp = null;
        user.otpExpiry = null;

        await user.save();

        res.json({
            success: true,
            message: 'Password has been reset successfully'
        });
    } catch (error) {
        console.error('Error in resetPassword:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reset password'
        });
    }
}

export const checkAuth = async (req, res) => {
    try {
        res.status(200).json({
            authenticated: true,
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
        console.log(err);
    }
}