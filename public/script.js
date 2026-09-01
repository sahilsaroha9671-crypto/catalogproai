// 1. Send OTP Function
async function sendOTP() {
  const emailInput = document.getElementById('userEmail')?.value.trim();
  const sendBtn = document.getElementById('sendOtpBtn');

  if (!emailInput || !emailInput.includes('@')) {
    alert('Kripya ek valid Email Address daalein.');
    return;
  }

  if (sendBtn) sendBtn.innerText = "Sending OTP...";

  try {
    const response = await fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailInput })
    });

    const data = await response.json();

    if (response.ok) {
      alert(`OTP aapki email (${emailInput}) par bhej diya gaya hai!`);
      
      // Email UI Hide karein aur OTP UI Show karein
      const emailStep = document.getElementById('emailStep');
      const otpStep = document.getElementById('otpStep');

      if (emailStep) emailStep.style.display = 'none';
      if (otpStep) otpStep.style.display = 'block';
    } else {
      alert(data.message || 'OTP bhejne me galti hui.');
      if (sendBtn) sendBtn.innerText = "Send OTP";
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Server error! Kripya baad me try karein.');
    if (sendBtn) sendBtn.innerText = "Send OTP";
  }
}

// 2. Verify OTP Function
function verifyOTP() {
  const userEnteredOTP = document.getElementById('userOTP')?.value.trim();

  if (!userEnteredOTP || userEnteredOTP.length < 4) {
    alert('Kripya 4-digit ka sahi OTP enter karein.');
    return;
  }

  alert('Login Successful!');
  
  // Login Container Hide karke App/Calculator Show karein
  const loginView = document.getElementById('loginView');
  const appContainer = document.getElementById('appContainer');

  if (loginView) loginView.style.display = 'none';
  if (appContainer) appContainer.style.display = 'flex';
}

// 3. Resend OTP Function
function resendOTP() {
  const emailStep = document.getElementById('emailStep');
  const otpStep = document.getElementById('otpStep');
  const sendBtn = document.getElementById('sendOtpBtn');

  if (otpStep) otpStep.style.display = 'none';
  if (emailStep) emailStep.style.display = 'block';
  if (sendBtn) sendBtn.innerText = "Send OTP";
}

// 4. Google Login Handler
function handleGoogleLogin() {
  alert("Google Sign-In ke liye Client ID configured hona zaroori hai. Abhi ke liye Email OTP Login ka upayog karein.");
}

// 5. Views Switcher (Calculator Safe Section)
function switchView(viewName) {
  const homeView = document.getElementById('homeView');
  const calcView = document.getElementById('calculatorView');
  const meeshoView = document.getElementById('meeshoGeneratorView');

  if (homeView) homeView.style.display = 'none';
  if (calcView) calcView.style.display = 'none';
  if (meeshoView) meeshoView.style.display = 'none';

  if (viewName === 'home' && homeView) homeView.style.display = 'block';
  if (viewName === 'calc' && calcView) calcView.style.display = 'block';
  if (viewName === 'meesho' && meeshoView) meeshoView.style.display = 'block';
}

window.showMeeshoGenerator = function() {
  switchView('meesho');
};
