const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587, // or 587 if using TLS
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,     // no-reply@buildxbid.com
    pass: process.env.EMAIL_PASS      // GoDaddy email password
  }
});

const sendEmail = async (to, { subject, body }) => {
  return transporter.sendMail({
    from: `"BuildX Notifications" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text: body
  });
};

module.exports = sendEmail;
