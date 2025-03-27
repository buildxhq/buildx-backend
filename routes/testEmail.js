const express = require('express');
const sendEmail = require('../utils/sendEmail');
const router = express.Router();

router.get('/send-test', async (req, res) => {
  try {
    await sendEmail(process.env.EMAIL_USER, {
      subject: '✅ BuildX Email Test Successful',
      body: 'If you received this, email is fully configured. 💪'
    });

    res.json({ message: '📨 Test email sent to ' + process.env.EMAIL_USER });
  } catch (err) {
    console.error('❌ Email Test Failed:', err);
    res.status(500).json({ message: 'Email send failed', error: err.message });
  }
});

module.exports = router;
