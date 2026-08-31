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
// Meesho Image Generator Logic
let uploadedImageSrc = "";

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      uploadedImageSrc = e.target.result;
      alert("Image Successfully Upload Ho Gayi Hai!");
    };
    reader.readAsDataURL(file);
  }
}

function generateImages() {
  const category = document.getElementById("categorySelect").value;
  if (!category) {
    alert("Kripya pehle category select karein!");
    return;
  }
  if (!uploadedImageSrc) {
    alert("Kripya pehle image upload karein!");
    return;
  }

  // Show Recent Card
  document.getElementById("recentPreviewImg").src = uploadedImageSrc;
  document.getElementById("recentCategory").innerText = category;
  document.getElementById("recentCard").style.display = "block";

  // Build Results Grid
  const gridContainer = document.getElementById("gridContainer");
  gridContainer.innerHTML = "";

  const presets = [
    { border: "border-purple", price: "₹60" },
    { border: "border-orange", price: "₹64" },
    { border: "border-dark", price: "₹65" },
    { border: "border-brown", price: "₹77" },
    { border: "border-purple", price: "₹79" },
    { border: "border-orange", price: "₹85" },
    { border: "border-orange", price: "₹85" },
    { border: "border-brown", price: "₹100" }
  ];

  presets.forEach((preset) => {
    const cardHtml = `
      <div class="img-card">
        <div class="img-frame ${preset.border}">
          <img src="${uploadedImageSrc}" alt="Generated Product">
        </div>
        <div class="card-footer">
          <div class="shipping-info">
            <span class="shipping-title">SHIPPING RATE</span>
            <span class="shipping-cat">${category}</span>
          </div>
          <div class="shipping-price">${preset.price}</div>
          <button class="btn-download" onclick="downloadImg('${uploadedImageSrc}')">↓ Download Image</button>
        </div>
      </div>
    `;
    gridContainer.innerHTML += cardHtml;
  });

  document.getElementById("resultsGrid").style.display = "block";
}

function downloadImg(src) {
  const a = document.createElement("a");
  a.href = src;
  a.download = "meesho-generated-image.jpg";
  a.click();
}
function showMeeshoGenerator() {
  const mainDash = document.getElementById("mainDashboard") || document.querySelector(".dashboard-content");
  if (mainDash) mainDash.style.display = "none";

  document.querySelectorAll(".view-section, .card-container").forEach(el => {
    el.style.display = "none";
  });

  const generatorView = document.getElementById("meeshoGeneratorView");
  if (generatorView) {
    generatorView.style.display = "block";
  }
}
