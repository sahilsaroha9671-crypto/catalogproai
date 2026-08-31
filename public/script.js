async function sendOTP() {
  const emailInput = document.getElementById('userEmail').value.trim();

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
      document.getElementById('emailStep').style.display = 'none';
      document.getElementById('otpStep').style.display = 'block';
    } else {
      alert(data.message || 'OTP bhejne me galti hui.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Server error! Kripya baad me try karein.');
  }
}async function sendOTP() {
  const emailInput = document.getElementById('userEmail').value.trim();

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
      document.getElementById('emailStep').style.display = 'none';
      document.getElementById('otpStep').style.display = 'block';
    } else {
      alert(data.message || 'OTP bhejne me galti hui.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Server error! Kripya baad me try karein.');
  }
}
