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
const strengthBar = document.getElementById("strengthBar");

if (passwordInput && strengthBar) {

    passwordInput.addEventListener("input", () => {

        const password = passwordInput.value;

        let width = "20%";
        let color = "#ef4444";

        if (
            password.length >= 8 &&
            /[A-Z]/.test(password) &&
            /[0-9]/.test(password)
        ) {
            width = "100%";
            color = "#22c55e";
        } else if (password.length >= 6) {
            width = "60%";
            color = "#f59e0b";
        }

        strengthBar.style.width = width;
        strengthBar.style.background = color;

    });

}

// ==========================================
// REGISTER FORM
// ==========================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const fullName = document.getElementById("fullName").value.trim();
        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const referralCode = document.getElementById("referralCode").value.trim();

        if (
            !fullName ||
            !username ||
            !email ||
            !phone ||
            !password
        ) {
            showToast("Please fill all required fields.", "error");
            return;
        }

        if (password !== confirmPassword) {
            showToast("Passwords do not match.", "error");
            return;
        }

        showLoader();

        const result = await apiRequest("/api/auth/register", "POST", {

            fullName,
            username,
            email,
            phone,
            password,
            referralCode

        });

        hideLoader();

        if (!result) return;

        if (result.success) {

            localStorage.setItem("token", result.token);
            localStorage.setItem("user", JSON.stringify(result.user));

            showToast(result.message);

            setTimeout(() => {

                window.location.href = "dashboard.html";

            }, 1200);

        } else {

            showToast(result.message, "error");

        }

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
// LIVE CALCULATOR (HOMEPAGE)
// ==========================================

const network = document.getElementById("network");
const amount = document.getElementById("amount");
const calculateBtn = document.getElementById("calculateBtn");
const result = document.querySelector("#result span");

function calculateAirtime() {

    if (!network || !amount || !result) return;

    const airtime = Number(amount.value);
    const rate = Number(network.value);

    if (airtime <= 0) {
        result.textContent = "₦0";
        return;
    }

    const receive = (airtime * rate) / 100;

    result.textContent = "₦" + receive.toLocaleString();

}

if (calculateBtn) {
    calculateBtn.addEventListener("click", calculateAirtime);
}

if (amount) {
    amount.addEventListener("input", calculateAirtime);
}

if (network) {
    network.addEventListener("change", calculateAirtime);
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
// CLOSE SIDEBAR AFTER CLICKING A MENU
// ==========================================

const sidebarLinks = document.querySelectorAll(".sidebar a");

sidebarLinks.forEach(link => {

    link.addEventListener("click", () => {

        if (window.innerWidth <= 992) {

            sidebar.classList.remove("show");

        }

    });

});

// ==========================================
// CLOSE SIDEBAR WHEN CLICKING OUTSIDE
// ==========================================

document.addEventListener("click", function(e){

    if(window.innerWidth <= 992){

        if(
            sidebar.classList.contains("show") &&
            !sidebar.contains(e.target) &&
            !menuToggle.contains(e.target)
        ){
            sidebar.classList.remove("show");
        }

    }

});

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
const BASE_URL = "https://cashify-backend-pvxb.onrender.com";

// ==========================================
// GET TOKEN
// ==========================================

function getToken() {

    return localStorage.getItem("token");

}

// ===========================
// MOBILE MENU
// ===========================

const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");

if (menuBtn && navLinks) {

    menuBtn.addEventListener("click", () => {

        navLinks.classList.toggle("active");

        const icon = menuBtn.querySelector("i");

        if (navLinks.classList.contains("active")) {
            icon.classList.remove("fa-bars");
            icon.classList.add("fa-times");
        } else {
            icon.classList.remove("fa-times");
            icon.classList.add("fa-bars");
        }

    });

}

document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("active");

        const icon = menuBtn.querySelector("i");

        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");

    });

});

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
// LOAD USER FROM BACKEND
// ==========================================

async function loadUser() {

    const result = await apiRequest("/api/auth/profile");

    if (!result || !result.success) {
        return;
    }

    const user = result.user;

    // Save latest user locally
    localStorage.setItem("user", JSON.stringify(user));

    const userName = document.getElementById("userName");
    const profileFullName = document.getElementById("profileFullName");
    const profileEmail = document.getElementById("profileEmail");
    const profilePhone = document.getElementById("profilePhone");

    if (userName) userName.textContent = user.fullName || "";
    if (profileFullName) profileFullName.value = user.fullName || "";
    if (profileEmail) profileEmail.value = user.email || "";
    if (profilePhone) profilePhone.value = user.phone || "";

}

// ==========================================
// LOAD DASHBOARD
// ==========================================

async function loadDashboard() {

    const result = await apiRequest("/api/dashboard");

    if (!result || !result.success) return;

    const data = result.dashboard;

    const walletBalance =
        document.getElementById("walletBalance");

    const totalEarned =
        document.getElementById("totalEarned");

    const totalTransactions =
        document.getElementById("totalTransactions");

    const pendingTransactions =
        document.getElementById("pendingTransactions");

    const completedTransactions =
        document.getElementById("completedTransactions");

    const totalWithdrawals =
        document.getElementById("totalWithdrawals");

    if (walletBalance)
        walletBalance.textContent =
            "₦" + Number(data.walletBalance).toLocaleString();

    if (totalEarned)
        totalEarned.textContent =
            "₦" + Number(data.totalEarned).toLocaleString();

    if (totalTransactions)
        totalTransactions.textContent =
            data.totalTransactions;

    if (pendingTransactions)
        pendingTransactions.textContent =
            data.pendingTransactions;

    if (completedTransactions)
        completedTransactions.textContent =
            data.completedTransactions;

    if (totalWithdrawals)
        totalWithdrawals.textContent =
            data.totalWithdrawals;

}

// ==========================================
// NOTIFICATION BADGE
// ==========================================

function updateNotificationBadge(count){

    const badge = document.getElementById("notificationCount");

    if(!badge) return;

    if(count <= 0){

        badge.style.display = "none";

    }else{

        badge.style.display = "flex";
        badge.textContent = count;

    }

}

// Demo
updateNotificationBadge(3);

// ==========================================
// APP INITIALIZATION
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("🚀 Cashify Version 1.0 Loaded");

loadUser();

loadDashboard();
    
});
