import nodemailer from 'nodemailer';

// Set up transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    }
  });

export const sendEmail = async (to: string, subject: string, text: string, html: string) => {
  const mailOptions = {
    from: `"Your Name" <${process.env.SMTP_USER}>`, 
    to: to, 
    subject: subject,
    text: text,
    html: html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
};
