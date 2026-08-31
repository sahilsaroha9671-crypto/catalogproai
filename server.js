const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const otps = {};

// Send Real OTP using Direct Resend REST API
app.post('/api/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Email Required' });

  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  otps[email] = generatedOtp;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Catalogproai <onboarding@resend.dev>',
        to: [email],
        subject: 'Catalogproai - Your Login OTP',
        html: `<h3>Catalogproai Login</h3><p>Your OTP is: <strong>${generatedOtp}</strong></p>`
      })
    });

    const data = await response.json();

    if (response.ok) {
      console.log('OTP Sent Successfully:', data);
      return res.json({ success: true, message: 'Real OTP aapke email par bhej diya gaya hai!' });
    } else {
      console.error('Resend API Error:', data);
      return res.status(500).json({ success: false, message: data.message || 'Email भेजने में समस्या आई' });
    }
  } catch (error) {
    console.error('Server Catch Error:', error);
    return res.status(500).json({ success: false, message: 'Server Connection Error: ' + error.message });
  }
});

// Verify OTP
app.post('/api/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  if (otps[email] && otps[email] === otp) {
    delete otps[email];
    return res.json({ success: true, message: 'Login Success!' });
  }
  return res.status(400).json({ success: false, message: 'Galat OTP! Kripya sahi OTP daalein.' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
