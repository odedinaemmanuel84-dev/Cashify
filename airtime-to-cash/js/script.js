/* ==========================================
   AIRTIME2CASH
   script.js
   PART 1
   Foundation
========================================== */

// ==========================================
// CONFIGURATION
// ==========================================

const CONFIG = {
    APP_NAME: "Airtime2Cash",
    API_BASE_URL: "http://localhost:5000/api", // Change this when deploying
    CURRENCY: "NGN",
    VERSION: "1.0.0"
};

// ==========================================
// APPLICATION STATE
// ==========================================

const AppState = {
    currentUser: null,
    token: null,
    exchangeRates: {
        MTN: 82,
        Airtel: 80,
        Glo: 75,
        "9mobile": 73
    }
};

// ==========================================
// DOM READY
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    initializeApp();

});

// ==========================================
// INITIALIZE APP
// ==========================================

function initializeApp() {

    setupNavigation();

    setupBackToTop();

    loadTheme();

    restoreSession();

    console.log(`${CONFIG.APP_NAME} Started Successfully`);

}

// ==========================================
// API HELPER
// Backend-ready
// ==========================================

async function apiRequest(endpoint, method = "GET", data = null) {

    const options = {
        method,
        headers: {
            "Content-Type": "application/json"
        }
    };

    if (AppState.token) {
        options.headers.Authorization = `Bearer ${AppState.token}`;
    }

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {

        const response = await fetch(
            `${CONFIG.API_BASE_URL}${endpoint}`,
            options
        );

        return await response.json();

    } catch (error) {

        console.error("API Error:", error);

        return {
            success: false,
            message: "Unable to connect to server."
        };

    }

}

// ==========================================
// SAVE TOKEN
// ==========================================

function saveToken(token) {

    AppState.token = token;

    localStorage.setItem("token", token);

}

// ==========================================
// GET TOKEN
// ==========================================

function restoreSession() {

    const token = localStorage.getItem("token");

    if (token) {

        AppState.token = token;

    }

}

// ==========================================
// LOGOUT
// ==========================================

function logout() {

    localStorage.removeItem("token");

    localStorage.removeItem("currentUser");

    window.location.href = "login.html";

}

// ==========================================
// TOAST NOTIFICATION
// ==========================================

function showToast(message, type = "success") {

    let toast = document.querySelector(".toast");

    if (!toast) {

        toast = document.createElement("div");

        toast.className = "toast";

        document.body.appendChild(toast);

    }

    toast.innerText = message;

    toast.style.display = "block";

    toast.style.background =
        type === "error"
            ? "#ef4444"
            : "#22c55e";

    setTimeout(() => {

        toast.style.display = "none";

    }, 3000);

}

// ==========================================
// BACK TO TOP
// ==========================================

function setupBackToTop() {

    const button = document.querySelector(".back-to-top");

    if (!button) return;

    window.addEventListener("scroll", () => {

        button.style.display =
            window.scrollY > 300
                ? "flex"
                : "none";

    });

    button.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}

// ==========================================
// MOBILE NAVIGATION
// ==========================================

function setupNavigation() {

    const menu = document.querySelector(".menu-btn");

    const nav = document.querySelector(".nav-links");

    if (!menu || !nav) return;

    menu.addEventListener("click", () => {

        nav.classList.toggle("show");

    });

}

// ==========================================
// THEME
// ==========================================

function loadTheme() {

    const theme = localStorage.getItem("theme");

    if (theme === "light") {

        document.body.classList.add("light-theme");

    }

      }
