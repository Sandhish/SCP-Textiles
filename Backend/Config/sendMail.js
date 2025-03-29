import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
dotenv.config()
export const sendMail = async (email, otp) => {
    console.log(email);
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        })
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'OTP for Password Reset - SCP Textiles',
            html: `
                <div style="background-color: #f4f0ff; padding: 20px; border-radius: 10px; text-align: center; font-family: Arial, sans-serif;">
                    <h2 style="color: #6a0dad;">SCP Textiles - OTP Verification</h2>
                    <p style="font-size: 18px; color: #333;">Your OTP for password reset is:</p>
                    <div style="font-size: 24px; font-weight: bold; color: #6a0dad; background: #e8dbff; padding: 10px; border-radius: 5px; display: inline-block;">
                        ${otp}
                    </div>
                    <p style="margin-top: 20px; color: #555;">This OTP is valid for only 10 minutes.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log("Email sent");
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}