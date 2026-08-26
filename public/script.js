document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const googleBtn = document.querySelector('.google-btn');
    const signUpLink = document.querySelector('.signup-text a');

    // 1. Google Login Button Click
    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            alert('Google Sign-In integration ke liye Google Cloud Console se OAuth Client ID ki zaroorat hoti hai. Abhi Email OTP option use karein.');
        });
    }

    // 2. Sign Up Link Click
    if (signUpLink) {
        signUpLink.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Aap new account create karne ke liye niche Email daalkar Continue par click karein.');
        });
    }

    // 3. Email Submit & OTP Trigger
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('email');
            const email = emailInput ? emailInput.value : '';

            if (!email) {
                alert('Kripya apna Email address bharein!');
                return;
            }

            // Button Loading State
            const submitBtn = loginForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Sending OTP...';
            submitBtn.disabled = true;

            try {
                const res = await fetch('/api/send-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });

                const data = await res.json();
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;

                if (data.success) {
                    const userOtp = prompt(data.message + '\n\nApna 6-digit OTP darj karein:');
                    
                    if (userOtp) {
                        const verifyRes = await fetch('/api/verify-otp', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email, otp: userOtp })
                        });

                        const verifyData = await verifyRes.json();
                        
                        if (verifyData.success) {
                            alert('Login Successful! Welcome to Catalogproai.');
                            // Page Refresh / Dashboard Redirect
                            window.location.reload();
                        } else {
                            alert(verifyData.message || 'Galat OTP! Fir se koshish karein.');
                        }
                    }
                } else {
                    alert(data.message || 'OTP bhejne me dikkat hui. Render ke EMAIL_PASS check karein.');
                }
            } catch (err) {
                console.error(err);
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
                alert('Server se connect nahi ho paya. Kripya thodi der me koshish karein.');
            }
        });
    }
});
