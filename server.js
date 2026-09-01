const express = require('express');
const path = require('path');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/send-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Valid Email address zaroori hai.' });
    }

    // 4-digit OTP Generate
    const generatedOTP = Math.floor(1000 + Math.random() * 9000).toString();

    // Check Gmail Env Keys
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log(`[Demo Mode] OTP for ${email}: ${generatedOTP}`);
      return res.status(200).json({ 
        success: true, 
        message: 'OTP generate ho gaya hai!', 
        otp: generatedOTP 
      });
    }

    // Nodemailer Try
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER.trim(),
          pass: process.env.EMAIL_PASS.trim()
        }
      });

      await transporter.sendMail({
        from: `"CatalogProAI" <${process.env.EMAIL_USER.trim()}>`,
        to: email,
        subject: 'CatalogProAI - Login OTP',
        text: `Aapka Login OTP hai: ${generatedOTP}`
      });

      return res.status(200).json({ success: true, message: 'OTP bhej diya gaya hai!' });
    } catch (mailError) {
      console.error('Email Delivery Failed, Falling back to direct OTP:', mailError);
      // Email fail hone par bhi application rukegi nahi:
      return res.status(200).json({ 
        success: true, 
        message: 'Email service bypass mode active.', 
        otp: generatedOTP 
      });
    }

  } catch (err) {
    console.error('Server Error:', err);
    res.status(500).json({ success: false, message: 'Server Error! Kripya dobara try karein.' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
