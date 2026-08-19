let currentEmail = "";
const upiID = "7988983394-q81a@axl";
const amount = "59";

async function sendOTP() {
    const email = document.getElementById('user-email').value;
    if(!email) return alert("Kripya Email ID Dalein!");

    currentEmail = email;
    const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });
    
    const result = await response.json();
    if(result.success) {
        document.getElementById('email-step').style.display = 'none';
        document.getElementById('otp-step').style.display = 'block';
        alert(result.message);
    } else {
        alert(result.message);
    }
}

async function verifyOTP() {
    const otp = document.getElementById('user-otp').value;
    const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentEmail, otp })
    });

    const result = await response.json();
    if(result.success) {
        document.getElementById('auth-modal').style.display = 'none';

        if(result.user.isLocked) {
            // Lock Feature if 3-day Trial Expired
            showPaywall();
        } else {
            // Allow Access
            document.getElementById('app-dashboard').style.display = 'flex';
        }
    } else {
        alert(result.message);
    }
}

function showPaywall() {
    document.getElementById('paywall-modal').style.display = 'flex';
    
    // Dynamic UPI QR Code Generation (Deep Link)
    const upiURI = `upi://pay?pa=${upiID}&pn=SupplierDen&am=${amount}&cu=INR`;
    document.getElementById("qrcode-container").innerHTML = "";
    new QRCode(document.getElementById("qrcode-container"), {
        text: upiURI,
        width: 160,
        height: 160
    });
}

function checkPayment() {
    alert("Aapki Payment Verification Request submit ho gayi hai. Admin review ke baad access start ho jayega.");
}
