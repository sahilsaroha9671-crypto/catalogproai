// Express OTP Route in server.js
app.post('/api/send-otp', async (req, res) => {
  const { email } = req.body; // User dwara enter ki gayi dynamic email

  if (!email) {
    return res.status(400).json({ message: 'Email address zaroori hai.' });
  }

  // 4-Digit Random OTP Generate karein
  const generatedOTP = Math.floor(1000 + Math.random() * 9000).toString();

  // Email Send Service Setup
  const mailOptions = {
    from: process.env.EMAIL_USER, 
    to: email, // Dynamic User Email
    subject: 'CatalogProAI - Login OTP',
    text: `Aapka Login OTP hai: ${generatedOTP}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP bhej diya gaya hai' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'OTP bhejne me error aaya' });
  }
});
