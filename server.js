const express = require('express');
const path = require('path');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Dynamic OTP Route
app.post('/api/send-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: 'Valid Email address zaroori hai.' });
    }

    const generatedOTP = Math.floor(1000 + Math.random() * 9000).toString();

    // Agar credentials miss ho toh Test Mode
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log(`[TEST MODE] Generated OTP for ${email}: ${generatedOTP}`);
      return res.status(200).json({ 
        message: 'OTP generated (Test Mode)', 
        otp: generatedOTP 
      });
    }

    // Nodemailer Setup (Port 587 - Fixed Timeout)
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER.trim(),
        pass: process.env.EMAIL_PASS.trim()
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const mailOptions = {
      from: `"CatalogProAI" <${process.env.EMAIL_USER.trim()}>`,
      to: email,
      subject: 'CatalogProAI - Login OTP',
      text: `Aapka Login OTP hai: ${generatedOTP}`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP bhej diya gaya hai!' });

  } catch (err) {
    console.error('OTP Send Error:', err);
    res.status(500).json({ message: 'OTP bhejne me galti hui.' });
  }
});

// Serve Main HTML Page
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
