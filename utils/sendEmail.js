const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT), // Usually 587 for TLS
  secure: false, // true for SSL (465), false for TLS (587)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendEmail = async (to, { subject, body }) => {
  try {
    const info = await transporter.sendMail({
      from: `"BuildX" <no-reply@buildxbid.com>`, // ✅ Matches verified domain
      to,
      subject,
      html: body
    });

    console.log(`📬 Email sent to ${to}:`, info.messageId);
  } catch (err) {
    console.error('❌ Email send error:', err);
  }
};

module.exports = sendEmail;

