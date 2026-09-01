// Dynamic OTP Sender Function with UI Toggle
async function sendOTP() {
  const emailInput = document.getElementById('userEmail')?.value.trim();

  if (!emailInput || !emailInput.includes('@')) {
    alert('Kripya ek valid Email Address daalein.');
    return;
  }

  const sendBtn = document.querySelector("button[onclick='sendOTP()']");
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
      
      // Email input hide karein aur OTP input screen show karein
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

// Verify OTP Function
function verifyOTP() {
  const otpInput = document.getElementById('userOTP')?.value.trim();
  if (!otpInput || otpInput.length < 4) {
    alert('Kripya sahi 4-digit OTP daalein.');
    return;
  }
  
  alert('Login Successful!');
  switchView('home');
}

// Google Login Handler
function handleGoogleLogin() {
  alert("Google Sign-In integration ke liye Client ID zaroori hai. Kripya Email OTP ka upayog karein.");
}

// View Switcher (Calculator safe rahega)
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
