const nodemailer = require('nodemailer');
const { AppError } = require('../utils/errorHandler');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
      }
    });
  }

  async sendEmail({ to, subject, html }) {
    try {
      const result = await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html
      });
      return result;
    } catch (error) {
      console.error('Email sending failed:', error);
      throw new AppError('Failed to send email', 500);
    }
  }

  async sendVerificationEmail(email, token) {
    const verificationUrl = `${process.env.CLIENT_URL}/auth/verify-email?token=${token}`;
    
    return this.sendEmail({
      to: email,
      subject: 'Verify Your Email',
      html: `
        <h1>Email Verification</h1>
        <p>Click the link below to verify your email address:</p>
        <a href="${verificationUrl}">Click here to verify your email</a>
      `
    });
  }

  async sendPasswordResetEmail(email, token) {
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
    
    return this.sendEmail({
      to: email,
      subject: 'Reset Your Password',
      html: `
        <h1>Password Reset</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    });
  }
}

module.exports = EmailService; 