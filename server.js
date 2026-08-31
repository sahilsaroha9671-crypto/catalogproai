const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Nodemailer Transporter Setup (Fallback testing setup ke saath)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || ''
  }
});

// Dynamic OTP Route
app.post('/api/send-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email address zaroori hai.' });
    }

    const generatedOTP = Math.floor(1000 + Math.random() * 9000).toString();

    // Agar Nodemailer Credentials set na ho toh console log karein aur response bhejein
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log(`[TEST MODE] Generated OTP for ${email}: ${generatedOTP}`);
      return res.status(200).json({ 
        message: 'OTP generated (Test Mode)', 
        otp: generatedOTP 
      });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
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

// Serve main HTML page
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
