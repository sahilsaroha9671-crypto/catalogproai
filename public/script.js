document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const googleBtn = document.querySelector('.google-btn');
    const signUpLink = document.querySelector('.signup-text a');

    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            alert('Google Sign-In integration ke liye OAuth Client ID zaroori hai. Abhi Email OTP use karein.');
        });
    }

    if (signUpLink) {
        signUpLink.addEventListener('click', (e) => {
            e.preventDefault();
            alert('New Account ke liye Email daalkar Continue par click karein.');
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('email');
            const email = emailInput ? emailInput.value.trim() : '';

            if (!email) {
                alert('Kripya apna Email address bharein!');
                return;
            }

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
                            window.location.reload();
                        } else {
                            alert(verifyData.message || 'Galat OTP! Fir se koshish karein.');
                        }
                    }
                } else {
                    // Agar Gmail me dikkat hui to exact server message show hoga
                    alert(data.message);
                }
            } catch (err) {
                console.error(err);
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
                alert('Server Connection Error! Kripya thodi der me try karein.');
            }
        });
    }
});
