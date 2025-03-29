import { generateToken } from "../Utils/jwtToken.js";
import { Customer } from "../Models/Customer.model.js";
import { sendMail } from "../Config/sendMail.js";
export const userRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existinguser = await Customer.findOne({ email });
        if (existinguser) {
            return res.status(400).json({ message: "User already exists", user: existinguser });
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
            secure: true,
            sameSite: "strict",
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
            secure: true,
            sameSite: "strict",
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
            secure: true,
            sameSite: "strict",
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

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await Customer.findOne({
            email
        });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
        console.log(otp);

        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000;
        await user.save();
        await sendMail(email, otp);
        res.status(200).json({ message: "OTP sent successfully" });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
        console.log(err);
    }
}
export const resetPassword = async (req, res) => {
    try {
        const { email, otp, password } = req.body;
        const user = await Customer.findOne({
            email
        });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        if (user.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        if (user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "OTP expired" });
        }
        user.password = password;
        user.otp = null;
        user.otpExpires = null;
        await user.save();
        res.status(200).json({ message: "Password reset successfully" });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
        console.log(err);
    }
}
