const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

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

    const generatedOTP = Math.floor(1000 + Math.random() * 9000).toString();
    const cleanUserEmail = email.toLowerCase().trim();
    userOTPStore[cleanUserEmail] = generatedOTP;

    const apiKey = process.env.BREVO_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ 
        success: false, 
        message: 'Render par BREVO_API_KEY missing hai.' 
      });
    }

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: 'CatalogProAI', email: 'sahilsaroha9671@gmail.com' },
        to: [{ email: cleanUserEmail }],
        subject: 'CatalogProAI - Login OTP',
        htmlContent: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #0052cc;">CatalogProAI Authentication</h2>
            <p>Aapka One Time Password (OTP) hai:</p>
            <h1 style="background: #eef2ff; color: #1d4ed8; padding: 12px 24px; display: inline-block; letter-spacing: 5px; border-radius: 6px;">${generatedOTP}</h1>
            <p style="color: #666; font-size: 13px;">Ye OTP kisi ke saath share na karein.</p>
          </div>
        `
      })
    });

    if (response.ok) {
      return res.status(200).json({ success: true, message: `OTP ${email} par bhej diya gaya hai!` });
    } else {
      const errData = await response.json();
      console.error('Brevo Error:', errData);
      return res.status(500).json({ success: false, message: 'Email send nahi ho paya. Brevo Key check karein.' });
    }

  } catch (err) {
    console.error('Server Error:', err);
    res.status(500).json({ success: false, message: 'Server Network Error.' });
  }
});

app.post('/api/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  const cleanUserEmail = (email || '').toLowerCase().trim();

  if (userOTPStore[cleanUserEmail] && userOTPStore[cleanUserEmail] === (otp || '').trim()) {
    delete userOTPStore[cleanUserEmail];
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
