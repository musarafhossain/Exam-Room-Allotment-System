import nodemailer from 'nodemailer';
import config from '../config/config';

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.nodemailer.user,
    pass: config.nodemailer.pass,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log('Error setting up email transport:', error);
  } else {
    console.log('Email transporter is ready');
  }
});

// Function to send email
export async function sendEmail(to: string, subject: string, message: string): Promise<void> {
  try {
    await transporter.sendMail({
      from: config.nodemailer.user,
      to,
      subject,
      html: message,
    });
    console.log(`Email sent successfully to ${to}`);
  } catch (error: any) {
    console.error(`Error sending email to ${to}:`, error.message);
    throw error;
  }
}