const express = require('express');
const path = require('path');
const cors = require('cors');
const { Resend } = require('resend');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Resend with API Key from Render Environment
const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Generate Unique 4-digit OTP
    const generatedOTP = Math.floor(1000 + Math.random() * 9000).toString();
    const cleanEmail = email.toLowerCase().trim();
    userOTPStore[cleanEmail] = generatedOTP;

    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({ 
        success: false, 
        message: 'Render par RESEND_API_KEY missing hai.' 
      });
    }

    // Send Mail via Resend API
    await resend.emails.send({
      from: 'CatalogProAI <onboarding@resend.dev>',
      to: [cleanEmail],
      subject: 'CatalogProAI - Login OTP',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #0052cc;">CatalogProAI Login</h2>
          <p>Aapka One Time Password (OTP) hai:</p>
          <h1 style="background: #eef2ff; color: #1d4ed8; padding: 12px 24px; display: inline-block; letter-spacing: 5px; border-radius: 6px;">${generatedOTP}</h1>
          <p>Ye OTP kisi ke saath share na karein.</p>
        </div>
      `
    });

    return res.status(200).json({ success: true, message: `OTP ${email} par bhej diya gaya hai!` });

  } catch (err) {
    console.error('Resend Error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Email delivery failed. Please check RESEND_API_KEY on Render.' 
    });
  }
});

app.post('/api/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  const cleanEmail = (email || '').toLowerCase().trim();

  if (userOTPStore[cleanEmail] && userOTPStore[cleanEmail] === (otp || '').trim()) {
    delete userOTPStore[cleanEmail];
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
