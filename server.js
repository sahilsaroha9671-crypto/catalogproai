const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// Temporary Database (In-Memory)
const users = {}; 
const otps = {};

// Transporter Setup (Aapne Gmail aur App Password yahan dalna hai)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'YOUR_EMAIL@gmail.com', 
        pass: 'YOUR_GMAIL_APP_PASSWORD' 
    }
});

// 1. Send OTP Endpoint
app.post('/api/send-otp', (req, res) => {
    const { email } = req.body;
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    otps[email] = generatedOtp;

    const mailOptions = {
        from: 'YOUR_EMAIL@gmail.com',
        to: email,
        subject: 'Supplier Den - Login OTP',
        text: `Aapka Login OTP hai: ${generatedOtp}`
    };

    transporter.sendMail(mailOptions, (error) => {
        if (error) return res.status(500).json({ success: false, message: 'OTP bhejne me dikkat hui.' });
        res.json({ success: true, message: 'OTP email par bhej diya gaya hai.' });
    });
});

// 2. Verify OTP & Trial Check
app.post('/api/verify-otp', (req, res) => {
    const { email, otp } = req.body;

    if (otps[email] !== otp) {
        return res.status(400).json({ success: false, message: 'Galat OTP!' });
    }

    delete otps[email]; // Clear OTP after use

    if (!users[email]) {
        // Naye User ke liye 3 Days Trial Start
        const createdAt = new Date();
        const trialExpiry = new Date(createdAt.getTime() + 3 * 24 * 60 * 60 * 1000);
        users[email] = { email, trialExpiry, isPaid: false };
    }

    const user = users[email];
    const now = new Date();
    const isLocked = !user.isPaid && now > new Date(user.trialExpiry);

    res.json({
        success: true,
        user: {
            email: user.email,
            isPaid: user.isPaid,
            isLocked: isLocked,
            trialExpiry: user.trialExpiry
        }
    });
});

// Serve Main Page
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));