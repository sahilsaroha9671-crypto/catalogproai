const express = require('express');
const path = require('path');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Dynamic OTP Storage
const userOTPStore = {};

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

    // Generate 4-digit OTP
    const generatedOTP = Math.floor(1000 + Math.random() * 9000).toString();
    userOTPStore[email.toLowerCase().trim()] = generatedOTP;

    const emailUser = (process.env.EMAIL_USER || '').toLowerCase().trim();
    const emailPass = (process.env.EMAIL_PASS || '').replace(/\s+/g, '');

    if (!emailUser || !emailPass) {
      return res.status(500).json({ 
        success: false, 
        message: 'Render par EMAIL_USER ya EMAIL_PASS missing hai.' 
      });
    }

    // Nodemailer Setup
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: emailUser,
        pass: emailPass
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Send Mail to requested User Email
    await transporter.sendMail({
      from: `"CatalogProAI" <${emailUser}>`,
      to: email.trim(),
      subject: 'CatalogProAI - Aapka Login OTP',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #0052cc;">CatalogProAI Login OTP</h2>
          <p>Aapka One Time Password hai:</p>
          <h1 style="background: #f4f4f4; padding: 12px; display: inline-block; letter-spacing: 5px; color: #16a34a; border-radius: 6px;">${generatedOTP}</h1>
          <p>Ye OTP kisi ke saath share na karein.</p>
        </div>
      `
    });

    return res.status(200).json({ success: true, message: `OTP ${email} par bhej diya gaya hai!` });

  } catch (err) {
    console.error('Nodemailer Error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Email bhejne me dikat aayi. Ensure App Password correctly set hai.' 
    });
  }
});

app.post('/api/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  const formattedEmail = (email || '').toLowerCase().trim();

  if (userOTPStore[formattedEmail] && userOTPStore[formattedEmail] === otp.trim()) {
    delete userOTPStore[formattedEmail];
    return res.status(200).json({ success: true, message: 'Login Successful!' });
  } else {
    return res.status(400).json({ success: false, message: 'Galat OTP! Kripya sahi OTP enter karein.' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
