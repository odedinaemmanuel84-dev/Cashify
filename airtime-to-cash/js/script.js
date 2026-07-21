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

// ==========================================
// SHOW / HIDE PASSWORD
// ==========================================

document.querySelectorAll(".toggle-password").forEach(button => {

    button.addEventListener("click", function () {

        const input = this.previousElementSibling;

        if (!input) return;

        if (input.type === "password") {

            input.type = "text";

            this.classList.remove("fa-eye");
            this.classList.add("fa-eye-slash");

        } else {

            input.type = "password";

            this.classList.remove("fa-eye-slash");
            this.classList.add("fa-eye");

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

        const checks = {

    length: password.length >= 8,

    upper: /[A-Z]/.test(password),

    lower: /[a-z]/.test(password),

    number: /[0-9]/.test(password),

    special: /[^A-Za-z0-9]/.test(password)

};

function updateCheck(id, passed){

    const item = document.getElementById(id);

    if(!item) return;

    if(passed){

        item.classList.add("valid");

        item.querySelector("i").className =
        "fas fa-check";

    }else{

        item.classList.remove("valid");

        item.querySelector("i").className =
        "fas fa-times";

    }

}

updateCheck("checkLength", checks.length);
updateCheck("checkUpper", checks.upper);
updateCheck("checkLower", checks.lower);
updateCheck("checkNumber", checks.number);
updateCheck("checkSpecial", checks.special);
        
        let score = 0;

        if (password.length >= 8) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        switch (score) {

            case 0:
            case 1:
                strengthBar.style.width = "20%";
                strengthBar.style.background = "#ef4444";
                break;

            case 2:
                strengthBar.style.width = "40%";
                strengthBar.style.background = "#f97316";
                break;

            case 3:
                strengthBar.style.width = "60%";
                strengthBar.style.background = "#eab308";
                break;

            case 4:
                strengthBar.style.width = "80%";
                strengthBar.style.background = "#22c55e";
                break;

            case 5:
                strengthBar.style.width = "100%";
                strengthBar.style.background = "#16a34a";
                break;

            default:
                strengthBar.style.width = "0%";
                strengthBar.style.background = "#ef4444";

        }

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

        // ==========================================
// STRONG PASSWORD VALIDATION
// ==========================================

const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password)
};

const isStrongPassword = Object.values(checks).every(value => value);

if (!isStrongPassword) {

    showToast(
        "Password is not strong enough. It must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character.",
        "error"
    );

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

    loginForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        if (!email || !password) {

            showToast("Please enter your email and password.", "error");
            return;

        }

        const result = await apiRequest(
            "/api/auth/login",
            "POST",
            {
                email,
                password
            }
        );

        if (!result) return;

        if (result.success) {

            localStorage.setItem("token", result.token);
            localStorage.setItem("user", JSON.stringify(result.user));

            showToast(result.message || "Login successful.");

            setTimeout(() => {

                window.location.href = "dashboard.html";

            }, 1200);

        } else {

            showToast(result.message || "Invalid email or password.", "error");

        }

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
// LOAD EXCHANGE RATES
// ==========================================

async function loadExchangeRate() {

    const networkSelect = document.getElementById("convertNetwork");
    const amountInput = document.getElementById("convertAmount");
    const currentRate = document.getElementById("currentRate");
    const receiveAmount = document.getElementById("receiveAmount");

    if (!networkSelect) return;

    let exchangeRates = [];

    const response = await apiRequest("/api/exchange-rates");

    console.log(response);
    
    if (response && response.success) {

        exchangeRates = response.rates;

    }

    function calculate() {

        const network = networkSelect.value;

        const airtime = Number(amountInput.value) || 0;

        if (!network) {

            currentRate.textContent = "--";
            receiveAmount.textContent = "₦0.00";
            return;

        }

        const rateData = exchangeRates.find(r => r.network === network);

        if (!rateData) {

            currentRate.textContent = "--";
            receiveAmount.textContent = "₦0.00";
            return;

        }

        const rate = Number(rateData.rate);

        currentRate.textContent = rate + "%";

        const receive = (airtime * rate) / 100;

        receiveAmount.textContent = "₦" + receive.toLocaleString();

    }

    networkSelect.addEventListener("change", calculate);

    amountInput.addEventListener("input", calculate);

}

// ==========================================
// CONVERT AIRTIME
// ==========================================

const convertForm = document.getElementById("convertForm");

if (convertForm) {

    convertForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const network = document.getElementById("convertNetwork").value;
        const airtimeAmount = document.getElementById("convertAmount").value;
        const phoneNumber = document.getElementById("phoneNumber").value.trim();
        const note = document.getElementById("conversionNote").value.trim();
        const screenshot = document.getElementById("screenshot").files[0];

        // Get the current exchange rate
       const exchangeRate = parseFloat(
    document.getElementById("currentRate")
        .textContent
        .replace("%", "")
);

        const amountToReceive = parseFloat(
    document.getElementById("receiveAmount")
        .textContent
        .replace("₦", "")
        .replace(/,/g, "")
);
        
        if (!network || !airtimeAmount || !phoneNumber) {

            showToast("Please fill all required fields.", "error");
            return;

        }

        const formData = new FormData();

        formData.append("network", network);
        formData.append("phoneNumber", phoneNumber);
        formData.append("airtimeAmount", airtimeAmount);
        formData.append("exchangeRate", exchangeRate);
        formData.append("amountToReceive", amountToReceive);
        formData.append("note", note);

        if (screenshot) {
            formData.append("screenshot", screenshot);
        }

        const result = await apiUpload(
            "/api/transaction/create",
            formData
        );

        if (!result) return;

        if (result.success) {

            showToast(result.message);

            convertForm.reset();

            document.getElementById("receiveAmount").textContent = "₦0.00";

            const preview = document.getElementById("screenshotPreview");

            if (preview) {

                preview.src = "";
                preview.style.display = "none";

            }
           
            loadTransactions();
            loadDashboard();
            
        } else {

            showToast(result.message, "error");

        }

    });

}

// ==========================================
// LOAD TRANSACTIONS
// ==========================================

async function loadTransactions() {

    const list = document.getElementById("transactionList");

    if (!list) return;

    list.innerHTML = `
        <div class="empty-history">
            Loading transactions...
        </div>
    `;

    const result = await apiRequest("/api/transaction/history");

    if (!result || !result.success) {

        list.innerHTML = `
            <div class="empty-history">
                Failed to load transactions.
            </div>
        `;

        return;

    }

    if (result.transactions.length === 0) {

        list.innerHTML = `
            <div class="empty-history">
                No transactions yet.
            </div>
        `;

        return;

    }

    list.innerHTML = "";

    table.innerHTML += `
<div class="history-card">

    <div class="history-left">

        <div class="history-icon">
            <i class="fas fa-mobile-alt"></i>
        </div>

        <div class="history-info">

            <h4>${transaction.network}</h4>

            <p>₦${Number(transaction.airtimeAmount).toLocaleString()}</p>

            <small>${new Date(transaction.createdAt).toLocaleString()}</small>

        </div>

    </div>

    <div class="history-right">

        <h3>₦${Number(transaction.amountToReceive).toLocaleString()}</h3>

        <span class="${transaction.status.toLowerCase()}">
            ${transaction.status}
        </span>

    </div>

</div>
`;

const card = table.lastElementChild;

card.addEventListener("click", () => {

    showTransactionDetails(transaction);

});

        const date = new Date(transaction.createdAt);

        const formattedDate =
            date.toLocaleDateString();

        const formattedTime =
            date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            });

        let statusClass = "pending";

        if (transaction.status === "Completed")
            statusClass = "completed";

        if (transaction.status === "Approved")
            statusClass = "approved";

        if (transaction.status === "Rejected")
            statusClass = "rejected";

        list.innerHTML += `

<div class="history-card">

<div class="history-left">

<div class="history-icon">

<i class="fas fa-sim-card"></i>

</div>

<div class="history-info">

<h4>${transaction.network} Airtime</h4>

<p>${formattedDate} • ${formattedTime}</p>

<small>${transaction.transactionId}</small>

</div>

</div>

<div class="history-right">

<h3>

₦${Number(transaction.airtimeAmount).toLocaleString()}

</h3>

<span class="${statusClass}">

${transaction.status}

</span>

</div>

</div>

`;

    });

            }

// ==========================================
// SHOW TRANSACTION DETAILS
// ==========================================

function showTransactionDetails(transaction){

    document.getElementById("detailTransactionId").textContent =
        transaction.transactionId;

    document.getElementById("detailNetwork").textContent =
        transaction.network;

    document.getElementById("detailPhone").textContent =
        transaction.phoneNumber;

    document.getElementById("detailAirtime").textContent =
        "₦" + Number(transaction.airtimeAmount).toLocaleString();

    document.getElementById("detailRate").textContent =
        transaction.exchangeRate + "%";

    document.getElementById("detailReceive").textContent =
        "₦" + Number(transaction.amountToReceive).toLocaleString();

    document.getElementById("detailStatus").textContent =
        transaction.status;

    document.getElementById("detailDate").textContent =
        new Date(transaction.createdAt).toLocaleString();

    document.getElementById("detailNote").textContent =
        transaction.note || "No note";

    const imageBox = document.getElementById("detailImageBox");

    const image = document.getElementById("detailScreenshot");

    if(transaction.screenshot){

        image.src = "/uploads/screenshots/" + transaction.screenshot;

        imageBox.classList.remove("hidden");

    }else{

        imageBox.classList.add("hidden");

    }

    document
        .getElementById("transactionModal")
        .classList.remove("hidden");

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

// ==========================================
// PROTECT PAGES
// ==========================================

function protectPage() {

    const token = localStorage.getItem("token");

    if (!token) {

        showToast("Please login first.", "error");

        setTimeout(() => {

            window.location.href = "login.html";

        }, 1000);

    }

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
// API REQUEST WITH FILE
// ==========================================

async function apiUpload(endpoint, formData) {

    const token = getToken();

    try {

        showLoader();

        const response = await fetch(BASE_URL + endpoint, {

            method: "POST",

            headers: {

                Authorization: `Bearer ${token}`

            },

            body: formData

        });

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

if (document.getElementById("userName")) {
    loadUser();
}

loadDashboard();

loadTransactions();
    
const closeModal = document.getElementById("closeTransactionModal");

if(closeModal){

    closeModal.addEventListener("click", () => {

        document
            .getElementById("transactionModal")
            .classList.add("hidden");

    });

}
    
});
