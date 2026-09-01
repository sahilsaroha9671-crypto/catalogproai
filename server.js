const express = require('express');
const path = require('path');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Dynamic temporary storage for OTPs (User Email -> Unique OTP)
const userOTPStore = {};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// API: Send OTP to ANY user who inputs their email
app.post('/api/send-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Kripya valid email ID daalein.' });
    }

    // Har user ke liye unique 4-digit OTP generate hoga
    const generatedOTP = Math.floor(1000 + Math.random() * 9000).toString();
    
    // User ki email ke agal-se OTP save karein
    userOTPStore[email] = generatedOTP;

    // Mail Transporter Setup
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER ? process.env.EMAIL_USER.trim() : '',
        pass: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.trim() : ''
      }
    });

    // Email Target: User dwara daali gayi email ID (req.body.email)
    await transporter.sendMail({
      from: `"CatalogProAI" <${process.env.EMAIL_USER}>`,
      to: email, // <--- Isse OTP us user ke email par jayega jo site par email type karega
      subject: 'CatalogProAI - Aapka Login OTP',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #0052cc;">Welcome to CatalogProAI</h2>
          <p>Aapka One Time Password (OTP) hai:</p>
          <h1 style="background: #eef2ff; color: #1d4ed8; padding: 12px 24px; display: inline-block; letter-spacing: 5px; border-radius: 6px;">${generatedOTP}</h1>
          <p style="color: #666; font-size: 13px;">Ye OTP kisi ke saath share na karein.</p>
        </div>
      `
    });

    return res.status(200).json({ success: true, message: `OTP ${email} par bhej diya gaya hai!` });

  } catch (err) {
    console.error('Email Delivery Failed:', err);
    res.status(500).json({ success: false, message: 'Email bhejne me dikat aayi. Check karein ki Render par EMAIL_USER aur EMAIL_PASS set hain ya nahi.' });
  }
});

// API: Verify User OTP
app.post('/api/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  if (userOTPStore[email] && userOTPStore[email] === otp) {
    delete userOTPStore[email]; // Verify hone ke baad clear karein
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
