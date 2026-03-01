import nodemailer from 'nodemailer';
import config from '../config';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.smtp_user,
    pass: config.smtp_pass,
  },
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Verify your email address',
    html: `
      <a href="${verificationUrl}" 
             style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email Address
          </a>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw new Error(`Failed to send verification email: ${error}`);
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `${process.env.FRONTEND_URL}/confirm-forgot-password?token=${token}`;

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Reset your password',
    html: `
       <a href="${resetUrl}" style="text-decoration: none; display: inline-block;">
            <button style="background-color: #28a745; color: white; padding: 12px 24px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">
              Reset Password
            </button>
          </a>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw new Error(`Failed to send password reset email: ${error}`);
  }
}; 
 