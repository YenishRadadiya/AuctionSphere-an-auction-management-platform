import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendEmail = async (userEmail: string, token: string) => {
    // Encode both email and token in base64
    const encodedData = Buffer.from(`email=${userEmail}&token=${token}`).toString('base64');

    const info = await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: userEmail,
        subject: 'Forgot password token',
        text: `Click the link below to reset your password:
http://localhost:4200/user/reset-password?token=${encodedData}

This link will expire in 10 minutes.`,
        html: `<p>Click the link below to reset your password:</p>
<a href="http://localhost:4200/user/reset-password?token=${encodedData}">Reset your password</a>
<p>This link will expire in 10 minutes.</p>`,
    });

    return info;
};