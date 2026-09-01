let targetUserEmail = "";

async function sendOTP() {
  const emailInput = document.getElementById('userEmail')?.value.trim();
  const sendBtn = document.getElementById('sendOtpBtn');

  if (!emailInput || !emailInput.includes('@')) {
    alert('Kripya ek valid Email Address daalein.');
    return;
  }

  targetUserEmail = emailInput;
  if (sendBtn) sendBtn.innerText = "Sending OTP...";

  try {
    const response = await fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailInput })
    });

    const data = await response.json();

    if (data.success) {
      alert(`OTP aapki email (${emailInput}) par bhej diya gaya hai! Inbox/Spam check karein.`);
      
      document.getElementById('emailStep').style.display = 'none';
      document.getElementById('otpStep').style.display = 'block';
    } else {
      alert(data.message || 'OTP bhejne me galti hui.');
      if (sendBtn) sendBtn.innerText = "Send OTP";
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Server Error! Kripya baad me try karein.');
    if (sendBtn) sendBtn.innerText = "Send OTP";
  }
}

async function verifyOTP() {
  const userEnteredOTP = document.getElementById('userOTP')?.value.trim();

  if (!userEnteredOTP || userEnteredOTP.length < 4) {
    alert('Kripya 4-digit ka OTP enter karein.');
    return;
  }

  try {
    const response = await fetch('/api/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: targetUserEmail, otp: userEnteredOTP })
    });

    const data = await response.json();

    if (data.success) {
      alert('Login Successful!');
      
      // Login View Hide Hoga Aur Main App/Calculator Dikhne Lagega
      const loginView = document.getElementById('loginView');
      const appContainer = document.getElementById('appContainer');

      if (loginView) loginView.style.display = 'none';
      if (appContainer) appContainer.style.display = 'flex';
    } else {
      alert(data.message || 'Galat OTP!');
    }
  } catch (err) {
    alert('Verification Error!');
  }
}

function resendOTP() {
  document.getElementById('otpStep').style.display = 'none';
  document.getElementById('emailStep').style.display = 'block';
  const sendBtn = document.getElementById('sendOtpBtn');
  if (sendBtn) sendBtn.innerText = "Send OTP";
}

function handleGoogleLogin() {
  alert("Google Sign-In ke liye Google Client ID configuration zaroori hai.");
}
