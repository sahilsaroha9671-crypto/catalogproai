document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;

    const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });

    const data = await res.json();
    if (data.success) {
        alert(data.message);
        const otp = prompt('Apna OTP darj karein:');
        if (otp) {
            const verifyRes = await fetch('/api/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
            });
            const verifyData = await verifyRes.json();
            alert(verifyData.message || 'Login Successful!');
        }
    } else {
        alert(data.message);
    }
});
