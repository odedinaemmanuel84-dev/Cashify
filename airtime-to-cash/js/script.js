// ==========================================
// CASHIFY FRONTEND
// Version 1.0
// ==========================================

// Initialize AOS
if (typeof AOS !== "undefined") {
    AOS.init({
        duration: 800,
        once: true
    });
}

// ==========================================
// SELECTORS
// ==========================================

const loader = document.getElementById("loader");
const toast = document.querySelector(".toast");
const backToTop = document.querySelector(".back-to-top");

// ==========================================
// LOADER
// ==========================================

function showLoader() {
    if (loader) {
        loader.style.display = "flex";
    }
}

function hideLoader() {
    if (loader) {
        loader.style.display = "none";
    }
}

// ==========================================
// TOAST NOTIFICATION
// ==========================================

function showToast(message, type = "success") {

    if (!toast) return;

    toast.innerHTML = message;

    toast.className = "toast show " + type;

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);

}

// ==========================================
// BACK TO TOP
// ==========================================

if (backToTop) {

    window.addEventListener("scroll", () => {

        if (window.scrollY > 300) {

            backToTop.classList.add("show");

        } else {

            backToTop.classList.remove("show");

        }

    });

    backToTop.addEventListener("click", () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

}

// ==========================================
// SMOOTH SCROLL
// ==========================================

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", function (e) {

        const target = document.querySelector(this.getAttribute("href"));

        if (target) {

            e.preventDefault();

            target.scrollIntoView({

                behavior: "smooth"

            });

        }

    });

});

// ==========================================
// PAGE READY
// ==========================================

window.addEventListener("load", () => {

    hideLoader();

    console.log("✅ Cashify Loaded Successfully");

});

// ==========================================
// AUTHENTICATION
// ==========================================

// Show / Hide Password

document.querySelectorAll(".toggle-password").forEach(button => {

    button.addEventListener("click", function () {

        const input = this.previousElementSibling;

        if (!input) return;

        if (input.type === "password") {

            input.type = "text";

            this.innerHTML = '<i class="fas fa-eye-slash"></i>';

        } else {

            input.type = "password";

            this.innerHTML = '<i class="fas fa-eye"></i>';

        }

    });

});

// ==========================================
// PASSWORD STRENGTH
// ==========================================

const passwordInput = document.getElementById("password");
const strengthText = document.getElementById("passwordStrength");

if (passwordInput && strengthText) {

    passwordInput.addEventListener("input", () => {

        const password = passwordInput.value;

        let strength = "Weak";
        let color = "#ff4d4d";

        if (
            password.length >= 8 &&
            /[A-Z]/.test(password) &&
            /[0-9]/.test(password)
        ) {

            strength = "Strong";
            color = "#00d084";

        } else if (password.length >= 6) {

            strength = "Medium";
            color = "#ffb400";

        }

        strengthText.textContent = "Password Strength: " + strength;
        strengthText.style.color = color;

    });

}

// ==========================================
// REGISTER FORM
// ==========================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function (e) {

        e.preventDefault();

        showLoader();

        const fullName = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();

        if (!fullName || !email || !phone) {

            hideLoader();

            showToast("Please fill in all required fields.", "error");

            return;

        }

        setTimeout(() => {

            hideLoader();

            showToast("Registration successful!", "success");

            // Backend endpoint later:
            // POST /api/auth/register

        }, 1200);

    });

}

// ==========================================
// LOGIN FORM
// ==========================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (e) {

        e.preventDefault();

        showLoader();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        if (!email || !password) {

            hideLoader();

            showToast("Enter your email and password.", "error");

            return;

        }

        setTimeout(() => {

            hideLoader();

            showToast("Login successful!", "success");

            // Backend endpoint later:
            // POST /api/auth/login

            window.location.href = "dashboard.html";

        }, 1200);

    });

}

// ==========================================
// REFERRAL CODE FROM URL
// ==========================================

const referralInput = document.getElementById("referralCode");

if (referralInput) {

    const params = new URLSearchParams(window.location.search);

    const ref = params.get("ref");

    if (ref) {

        referralInput.value = ref;

        referralInput.readOnly = true;

    }

    }

// ==========================================
// DASHBOARD NAVIGATION
// ==========================================

const menuLinks = document.querySelectorAll("[data-page]");
const dashboardPages = document.querySelectorAll(".dashboard-page");

menuLinks.forEach(link => {

    link.addEventListener("click", function (e) {

        e.preventDefault();

        const page = this.dataset.page;

        menuLinks.forEach(item => item.classList.remove("active"));

        this.classList.add("active");

        dashboardPages.forEach(section => {

            section.classList.add("hidden");

        });

        const target = document.getElementById(page + "Page");

        if (target) {

            target.classList.remove("hidden");

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }

    });

});

// ==========================================
// LOGOUT
// ==========================================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        if (confirm("Are you sure you want to logout?")) {

            localStorage.removeItem("token");

            localStorage.removeItem("user");

            showToast("Logged out successfully.");

            setTimeout(() => {

                window.location.href = "login.html";

            }, 1200);

        }

    });

}

// ==========================================
// COPY REFERRAL CODE
// ==========================================

const copyReferralBtn = document.getElementById("copyReferralBtn");

if (copyReferralBtn) {

    copyReferralBtn.addEventListener("click", () => {

        const referralInput = document.getElementById("myReferralCode");

        if (!referralInput) return;

        referralInput.select();
        referralInput.setSelectionRange(0, 99999);

        navigator.clipboard.writeText(referralInput.value);

        showToast("Referral code copied!");

    });

}

// ==========================================
// REMEMBER ME
// ==========================================

const rememberMe = document.getElementById("rememberMe");

if (rememberMe) {

    rememberMe.addEventListener("change", function () {

        localStorage.setItem(

            "rememberMe",

            this.checked

        );

    });

    rememberMe.checked =

        localStorage.getItem("rememberMe") === "true";

}

// ==========================================
// LOAD USER
// ==========================================

const userName = document.getElementById("userName");

if (userName) {

    const user = JSON.parse(

        localStorage.getItem("user")

    );

    if (user && user.fullName) {

        userName.textContent = user.fullName;

    }

}

// ==========================================
// AIRTIME CONVERSION
// ==========================================

const convertForm = document.getElementById("convertForm");

if (convertForm) {

    convertForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const network = document.getElementById("convertNetwork").value;
        const amount = Number(document.getElementById("convertAmount").value);

        if (!network || amount <= 0) {
            showToast("Enter a valid network and amount.", "error");
            return;
        }

        // Backend:
        // POST /api/airtime/convert

        showToast("Conversion request created successfully.");

    });

}

// ==========================================
// LIVE CALCULATOR
// ==========================================

const amountInput = document.getElementById("convertAmount");
const networkSelect = document.getElementById("convertNetwork");

const receiveAmount = document.getElementById("receiveAmount");
const currentRate = document.getElementById("currentRate");

const rates = {
    MTN: 82,
    Airtel: 80,
    Glo: 75,
    "9mobile": 73
};

function updateCalculator() {

    if (!amountInput || !networkSelect) return;

    const amount = Number(amountInput.value);

    const network = networkSelect.value;

    if (!network || !amount) return;

    const rate = rates[network];

    currentRate.textContent = rate + "%";

    receiveAmount.textContent =
        "₦" + ((amount * rate) / 100).toLocaleString();

}

if (amountInput) {

    amountInput.addEventListener("input", updateCalculator);

}

if (networkSelect) {

    networkSelect.addEventListener("change", updateCalculator);

}

// ==========================================
// PROFILE UPDATE
// ==========================================

const profileForm = document.getElementById("profileForm");

if (profileForm) {

    profileForm.addEventListener("submit", function (e) {

        e.preventDefault();

        // Backend:
        // PUT /api/user/profile

        showToast("Profile updated successfully.");

    });

}

// ==========================================
// SETTINGS
// ==========================================

const settingsForm = document.getElementById("settingsForm");

if (settingsForm) {

    settingsForm.addEventListener("submit", function (e) {

        e.preventDefault();

        // Backend:
        // PUT /api/user/change-password

        showToast("Password updated successfully.");

    });

}

// ==========================================
// WITHDRAWAL
// ==========================================

const withdrawForm = document.getElementById("withdrawForm");

if (withdrawForm) {

    withdrawForm.addEventListener("submit", function (e) {

        e.preventDefault();

        // Backend:
        // POST /api/withdrawals

        showToast("Withdrawal request submitted.");

    });

}

// ==========================================
// DARK MODE
// ==========================================

const darkModeToggle = document.getElementById("darkModeToggle");

if (darkModeToggle) {

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        darkModeToggle.checked = true;
    }

    darkModeToggle.addEventListener("change", function () {

        if (this.checked) {

            document.body.classList.add("dark");
            localStorage.setItem("theme", "dark");

        } else {

            document.body.classList.remove("dark");
            localStorage.setItem("theme", "light");

        }

    });

}

// ==========================================
// MOBILE SIDEBAR
// ==========================================

const sidebar = document.querySelector(".sidebar");
const menuToggle = document.getElementById("menuToggle");

if (menuToggle && sidebar) {

    menuToggle.addEventListener("click", () => {

        sidebar.classList.toggle("show");

    });

}

// ==========================================
// PROFILE IMAGE PREVIEW
// ==========================================

const profileImageInput = document.getElementById("profileImage");
const profilePreview = document.getElementById("profilePreview");

if (profileImageInput && profilePreview) {

    profileImageInput.addEventListener("change", function () {

        const file = this.files[0];

        if (!file) return;

        profilePreview.src = URL.createObjectURL(file);

    });

}

// ==========================================
// SCREENSHOT PREVIEW
// ==========================================

const screenshotInput = document.getElementById("screenshot");
const screenshotPreview = document.getElementById("screenshotPreview");

if (screenshotInput && screenshotPreview) {

    screenshotInput.addEventListener("change", function () {

        const file = this.files[0];

        if (!file) return;

        screenshotPreview.src = URL.createObjectURL(file);
        screenshotPreview.style.display = "block";

    });

}

// ==========================================
// SUPPORT FORM
// ==========================================

const supportForm = document.getElementById("supportForm");

if (supportForm) {

    supportForm.addEventListener("submit", function (e) {

        e.preventDefault();

        // Backend:
        // POST /api/support

        showToast("Support ticket submitted successfully.");

    });

}

// ==========================================
// SECURITY ACTIONS
// ==========================================

const logoutAllBtn = document.getElementById("logoutAllBtn");

if (logoutAllBtn) {

    logoutAllBtn.addEventListener("click", () => {

        // Backend:
        // POST /api/auth/logout-all

        showToast("All devices will be logged out.");

    });

}

const enable2faBtn = document.getElementById("enable2faBtn");

if (enable2faBtn) {

    enable2faBtn.addEventListener("click", () => {

        showToast("2FA feature coming soon!", "success");

    });

 }

// ==========================================
// API CONFIGURATION
// ==========================================

// Change this when you deploy your backend
const BASE_URL = "http://localhost:5000/api";

// ==========================================
// GET TOKEN
// ==========================================

function getToken() {

    return localStorage.getItem("token");

}

// ==========================================
// API REQUEST HELPER
// ==========================================

async function apiRequest(endpoint, method = "GET", data = null) {

    const options = {

        method,

        headers: {

            "Content-Type": "application/json"

        }

    };

    const token = getToken();

    if (token) {

        options.headers.Authorization = `Bearer ${token}`;

    }

    if (data) {

        options.body = JSON.stringify(data);

    }

    try {

        showLoader();

        const response = await fetch(BASE_URL + endpoint, options);

        const result = await response.json();

        hideLoader();

        return result;

    } catch (error) {

        hideLoader();

        console.error(error);

        showToast("Network error. Please try again.", "error");

        return null;

    }

}

// ==========================================
// PROTECTED PAGE CHECK
// ==========================================

function requireLogin() {

    const protectedPages = [

        "dashboard.html",

        "admin.html"

    ];

    const currentPage = window.location.pathname.split("/").pop();

    if (

        protectedPages.includes(currentPage) &&

        !getToken()

    ) {

        window.location.href = "login.html";

    }

}

requireLogin();

// ==========================================
// LOGOUT FUNCTION
// ==========================================

function logout() {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href = "login.html";

}

// ==========================================
// LOAD USER DETAILS
// ==========================================

function loadUser() {

    const user = JSON.parse(

        localStorage.getItem("user")

    );

    if (!user) return;

    const userName = document.getElementById("userName");

    const profileFullName = document.getElementById("profileFullName");

    const profileEmail = document.getElementById("profileEmail");

    const profilePhone = document.getElementById("profilePhone");

    if (userName) userName.textContent = user.fullName || "";

    if (profileFullName) profileFullName.value = user.fullName || "";

    if (profileEmail) profileEmail.value = user.email || "";

    if (profilePhone) profilePhone.value = user.phone || "";

}

loadUser();

// ==========================================
// APP INITIALIZATION
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("🚀 Cashify Version 1.0 Loaded");

});
