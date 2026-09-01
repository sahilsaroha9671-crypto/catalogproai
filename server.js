// SMTP Config (Port 587 TLS - ETIMEDOUT Timeout Prevention)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER ? process.env.EMAIL_USER.trim() : '',
    pass: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.trim() : ''
  },
  tls: {
    rejectUnauthorized: false
  }
});
