// 1. Dynamic OTP Sender Function
async function sendOTP() {
  const emailInput = document.getElementById('userEmail')?.value.trim();

  if (!emailInput || !emailInput.includes('@')) {
    alert('Kripya ek valid Email Address daalein.');
    return;
  }

  try {
    const response = await fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailInput })
    });

    const data = await response.json();

    if (response.ok) {
      alert(`OTP aapki email (${emailInput}) par bhej diya gaya hai!`);
      if (document.getElementById('emailStep')) document.getElementById('emailStep').style.display = 'none';
      if (document.getElementById('otpStep')) document.getElementById('otpStep').style.display = 'block';
    } else {
      alert(data.message || 'OTP bhejne me galti hui.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Server error! Kripya baad me try karein.');
  }
}

// 2. Google Login Placeholder Handler
function handleGoogleLogin() {
  alert("Google Sign-In integration ke liye Client ID configured hona zaroori hai. Abhi ke liye kripya Email OTP Login ka upayog karein.");
}

// 3. Navigation Switch Function
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
