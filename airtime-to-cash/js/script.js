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

    if (result.user.role === "admin") {

        window.location.href = "admin.html";

    } else {

        window.location.href = "dashboard.html";

    }

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

let airtimeQuotaVerified = false;


// ==========================================
// SELECTORS
// ==========================================

const convertForm =
    document.getElementById("convertForm");

const requestOtpBtn =
    document.getElementById("requestOtpBtn");

const verifyOtpBtn =
    document.getElementById("verifyOtpBtn");

const otpSection =
    document.getElementById("otpSection");

const pinSection =
    document.getElementById("pinSection");

const checkQuotaBtn =
    document.getElementById("checkQuotaBtn");

const convertNetwork =
    document.getElementById("convertNetwork");

const convertAmount =
    document.getElementById("convertAmount");

const airtimePinInput =
    document.getElementById("airtimePin");


// ==========================================
// RESET QUOTA STATE
// ==========================================

function resetAirtimeQuotaState() {

    airtimeQuotaVerified = false;

    if (checkQuotaBtn) {

        checkQuotaBtn.disabled = false;

        checkQuotaBtn.textContent =
            "Check Airtime Availability";

    }

}


// ==========================================
// RESET OTP + PIN FLOW
// ==========================================

function resetAirtimeOtpFlow() {

    if (otpSection) {
        otpSection.style.display = "none";
    }

    if (pinSection) {
        pinSection.style.display = "none";
    }

    const otpInput =
        document.getElementById("airtimeOtp");

    if (otpInput) {
        otpInput.value = "";
    }

    if (airtimePinInput) {
        airtimePinInput.value = "";
        airtimePinInput.dataset.submitting = "false";
    }

    if (requestOtpBtn) {

        requestOtpBtn.disabled = false;

        requestOtpBtn.textContent =
            "Request OTP";

    }

    if (verifyOtpBtn) {

        verifyOtpBtn.disabled = false;

        verifyOtpBtn.textContent =
            "Verify OTP";

    }

}


// ==========================================
// CONVERT FORM
// ==========================================

if (convertForm) {

    convertForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();


            // ==========================================
            // GET VALUES
            // ==========================================

            const network =
                convertNetwork?.value
                ?.trim()
                ?.toUpperCase();

            const airtimeAmount =
                Number(
                    convertAmount?.value
                );

            const phoneNumber =
                document.getElementById(
                    "phoneNumber"
                )?.value
                ?.trim();

            const pin =
                airtimePinInput?.value
                ?.trim();

            const note =
                document.getElementById(
                    "conversionNote"
                )?.value
                ?.trim() || "";

            const screenshotInput =
                document.getElementById(
                    "screenshot"
                );

            const screenshot =
                screenshotInput?.files?.[0] || null;


            // ==========================================
            // VALIDATION
            // ==========================================

            if (!network) {

                showToast(
                    "Please select your network.",
                    "error"
                );

                return;

            }


            if (
                !Number.isFinite(airtimeAmount) ||
                airtimeAmount < 50
            ) {

                showToast(
                    "Minimum airtime conversion amount is ₦50.",
                    "error"
                );

                return;

            }


            if (!phoneNumber) {

                showToast(
                    "Please enter your phone number.",
                    "error"
                );

                return;

            }

       async function processAirtimeConversion(pin) {

    const network =
        document.getElementById("convertNetwork")?.value?.trim()?.toUpperCase();

    const airtimeAmount =
        Number(document.getElementById("convertAmount")?.value);

    const phoneNumber =
        document.getElementById("phoneNumber")?.value?.trim();

    const note =
        document.getElementById("conversionNote")?.value?.trim() || "";

    if (!network || !phoneNumber || !airtimeAmount) {
        throw new Error("Please complete the conversion details.");
    }

    if (!airtimeQuotaVerified) {
        throw new Error("Please check airtime availability first.");
    }

    if (!pin || pin.length !== 4) {
        throw new Error("Enter your 4-digit Share & Sell PIN.");
    }

    // Generate transaction reference
    const reference =
        "CFY-" +
        Date.now() +
        "-" +
        Math.random().toString(36).substring(2, 8).toUpperCase();

    console.log("🔥 Starting AirtimeBridge conversion...");

    const transferResult = await apiRequest(
        "/api/airtime-bridge/convert",
        "POST",
        {
            networkName: network,
            sender: phoneNumber,
            amount: airtimeAmount,
            reference,
            pin
        }
    );

    console.log("🔥 Conversion response:", transferResult);

    /*
     * WRONG PIN
     */
    const responseMessage =
        transferResult?.message ||
        transferResult?.data?.message ||
        "";

    const lowerMessage = String(responseMessage).toLowerCase();

    if (
        lowerMessage.includes("incorrect pin") ||
        lowerMessage.includes("invalid pin") ||
        lowerMessage.includes("wrong pin") ||
        lowerMessage.includes("invalid transfer pin") ||
        lowerMessage.includes("incorrect transfer pin")
    ) {
        throw new Error("Incorrect Share & Sell PIN. Please try again.");
    }

    /*
     * FAILED
     */
    if (!transferResult?.success) {
        throw new Error(
            responseMessage || "Airtime conversion failed."
        );
    }

    /*
     * SUCCESS
     */

    // Close PIN popup only after successful conversion
    closePinPopup();

    // Clear PIN
    if (airtimePinInput) {
        airtimePinInput.value = "";
        updatePinBoxes();
    }

    // Reset conversion state
    airtimeQuotaVerified = false;

    showToast(
        "Airtime conversion successful! Your cash is being processed."
    );

    // Optional: refresh dashboard/balance
    if (typeof loadDashboardData === "function") {
        try {
            await loadDashboardData();
        } catch (error) {
            console.warn("Dashboard refresh failed:", error);
        }
    }

    // Reset form fields
    const screenshotInput =
        document.getElementById("screenshot");

    if (screenshotInput) {
        screenshotInput.value = "";
    }

    const screenshotPreview =
        document.getElementById("screenshotPreview");

    if (screenshotPreview) {
        screenshotPreview.src = "";
        screenshotPreview.style.display = "none";
    }

    return transferResult;
       }

            // ==========================================
            // OTP VERIFICATION CHECK
            // ==========================================

            const otpVerified =
                verifyOtpBtn &&
                verifyOtpBtn.disabled &&
                verifyOtpBtn.textContent.includes(
                    "Verified"
                );


            if (!otpVerified) {

                showToast(
                    "Please verify your phone number with OTP first.",
                    "error"
                );

                if (otpSection) {
                    otpSection.style.display = "block";
                }

                return;

            }


            // ==========================================
            // QUOTA CHECK
            // ==========================================

            if (!airtimeQuotaVerified) {

                showToast(
                    "Please check airtime availability first.",
                    "error"
                );

                return;

            }

            if (!pin || pin.length !== 4) {
    openPinPopup();
    return;
}

// The actual conversion is handled by
// processAirtimeConversion() from the PIN popup.
return;
    
            // ==========================================
            // GET EXCHANGE RATE
            // ==========================================

            const rateText =
                document.getElementById(
                    "currentRate"
                )?.textContent
                ?.replace("%", "")
                ?.trim();

            const exchangeRate =
                Number(rateText);


            if (
                !Number.isFinite(exchangeRate) ||
                exchangeRate <= 0
            ) {

                showToast(
                    "Unable to determine the current exchange rate. Please select your network again.",
                    "error"
                );

                return;

            }


            // ==========================================
            // CALCULATE CASH AMOUNT
            // ==========================================

            const amountToReceive =
                (airtimeAmount * exchangeRate) / 100;


            if (
                !Number.isFinite(amountToReceive) ||
                amountToReceive <= 0
            ) {

                showToast(
                    "Unable to calculate conversion amount.",
                    "error"
                );

                return;

            }


            // ==========================================
            // GENERATE REFERENCE
            // ==========================================

            const reference =
                "CASHIFY-" +
                Date.now() +
                "-" +
                Math.random()
                    .toString(36)
                    .substring(2, 8)
                    .toUpperCase();


            // ==========================================
            // SUBMIT BUTTON
            // ==========================================

            const submitBtn =
                convertForm.querySelector(
                    'button[type="submit"]'
                );


            if (submitBtn) {

                submitBtn.disabled = true;

                submitBtn.innerHTML = `
                    <i class="fas fa-spinner fa-spin"></i>
                    Processing Airtime...
                `;

            }


            try {

                // ==========================================
                // STEP 1
                // AIRTIMEBRIDGE TRANSFER
                // ==========================================

                console.log(
                    "🔥 Starting AirtimeBridge transfer..."
                );


                const transferResult =
                    await apiRequest(
                        "/api/airtime-bridge/convert",
                        "POST",
                        {
                            networkName: network,
                            sender: phoneNumber,
                            amount: airtimeAmount,
                            reference: reference,
                            pin: pin
                        }
                    );


                console.log(
                    "🔥 AIRTIMEBRIDGE CONVERT RESPONSE:",
                    transferResult
                );


                if (!transferResult) {

                    showToast(
                        "Unable to connect to the airtime provider.",
                        "error"
                    );

                    return;

                }


                // ==========================================
                // TRANSFER SUCCESS
                // ==========================================

                if (
                    transferResult.success &&
                    transferResult.status === "successful"
                ) {

                    showToast(
                        "Airtime transfer successful. Creating your Cashify transaction..."
                    );


                    // ==========================================
                    // CREATE TRANSACTION
                    // ==========================================

                    const formData =
                        new FormData();


                    formData.append(
                        "network",
                        network
                    );

                    formData.append(
                        "phoneNumber",
                        phoneNumber
                    );

                    formData.append(
                        "airtimeAmount",
                        airtimeAmount
                    );

                    formData.append(
                        "exchangeRate",
                        exchangeRate
                    );

                    formData.append(
                        "amountToReceive",
                        amountToReceive
                    );

                    formData.append(
                        "note",
                        note
                    );

                    formData.append(
                        "reference",
                        reference
                    );


                    if (screenshot) {

                        formData.append(
                            "screenshot",
                            screenshot
                        );

                    }


                    const transactionResult =
                        await apiUpload(
                            "/api/transaction/create",
                            formData
                        );


                    console.log(
                        "🔥 CASHIFY TRANSACTION RESPONSE:",
                        transactionResult
                    );


                    if (
                        transactionResult &&
                        transactionResult.success
                    ) {

                        showToast(
                            transactionResult.message ||
                            "Conversion submitted successfully."
                        );


                        convertForm.reset();

                        resetAirtimeOtpFlow();

                        resetAirtimeQuotaState();


                        const preview =
                            document.getElementById(
                                "screenshotPreview"
                            );

                        if (preview) {

                            preview.src = "";

                            preview.style.display =
                                "none";

                        }


                        const receiveAmount =
                            document.getElementById(
                                "receiveAmount"
                            );

                        if (receiveAmount) {

                            receiveAmount.textContent =
                                "₦0.00";

                        }


                        const currentRate =
                            document.getElementById(
                                "currentRate"
                            );

                        if (currentRate) {

                            currentRate.textContent =
                                "--";

                        }


                        await loadTransactions();

                        await loadDashboard();

                    } else {

                        showToast(
                            transactionResult?.message ||
                            "Airtime was transferred, but Cashify could not create the transaction. Please contact support.",
                            "error"
                        );

                    }

                    return;

                }


                // ==========================================
                // TRANSFER PENDING
                // ==========================================

                if (
                    transferResult.status === "pending"
                ) {

                    showToast(
                        transferResult.message ||
                        "Airtime transfer is pending. Please wait for confirmation.",
                        "error"
                    );

                    return;

                }


                // ==========================================
                // TRANSFER FAILED
                // ==========================================

                const failedMessage =
                    transferResult.message || "";

                const lowerMessage =
                    failedMessage.toLowerCase();


                if (
                    lowerMessage.includes("pin") ||
                    lowerMessage.includes("invalid") ||
                    lowerMessage.includes("incorrect") ||
                    lowerMessage.includes("wrong")
                ) {

                    showToast(
                        "Incorrect Share & Sell PIN. Please check your PIN and try again.",
                        "error"
                    );


                    if (pinSection) {
                        pinSection.style.display = "block";
                    }


                    if (airtimePinInput) {

                        airtimePinInput.focus();

                        airtimePinInput.select();

                    }

                } else {

                    showToast(
                        failedMessage ||
                        "Airtime transfer failed. Please try again.",
                        "error"
                    );

                }


            } catch (error) {

                console.error(
                    "🔥 CONVERSION ERROR:",
                    error
                );


                showToast(
                    "Unable to process airtime conversion. Please try again.",
                    "error"
                );


            } finally {

                if (submitBtn) {

                    submitBtn.disabled = false;

                    submitBtn.innerHTML = `
                        <i class="fas fa-paper-plane"></i>
                        Submit Conversion
                    `;

                }

            }

        }
    );

}

// ==========================================
// CASHIFY SHARE & SELL PIN POPUP
// ==========================================

const pinOverlay =
    document.getElementById("pinOverlay");

const closePinPopup =
    document.getElementById("closePinPopup");

const pinContinueBtn =
    document.getElementById("pinContinueBtn");

const pinError =
    document.getElementById("pinError");

const pinBoxes =
    document.querySelectorAll(".pin-box");

const popupPinInput =
    document.getElementById("airtimePin");

const pinKeys =
    document.querySelectorAll(".pin-key[data-digit]");

const pinBackspace =
    document.getElementById("pinBackspace");


// ==========================================
// UPDATE PIN DISPLAY
// ==========================================

function updatePinBoxes() {

    const pin =
        popupPinInput?.value || "";

    pinBoxes.forEach(
        (box, index) => {

            box.classList.remove("filled");
            box.classList.remove("active");

            if (index < pin.length) {

                box.classList.add(
                    "filled"
                );

            }

            if (index === pin.length) {

                box.classList.add(
                    "active"
                );

            }

        }
    );


    if (pinContinueBtn) {

        pinContinueBtn.disabled =
            pin.length !== 4;

    }

}


// ==========================================
// OPEN PIN POPUP
// ==========================================

function openPinPopup() {

    if (!pinOverlay) return;


    if (popupPinInput) {

        popupPinInput.value = "";

    }


    if (pinError) {

        pinError.textContent = "";

    }


    updatePinBoxes();


    pinOverlay.classList.add("show");

}


// ==========================================
// CLOSE PIN POPUP
// ==========================================

function closePinPopupFunction() {

    if (!pinOverlay) return;

    pinOverlay.classList.remove("show");


    if (popupPinInput) {

        popupPinInput.value = "";

    }


    if (pinError) {

        pinError.textContent = "";

    }


    updatePinBoxes();

}


// ==========================================
// NUMBER BUTTONS
// ==========================================

pinKeys.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                if (!popupPinInput) return;


                let pin =
                    popupPinInput.value || "";


                if (pin.length >= 4) {
                    return;
                }


                const digit =
                    this.dataset.digit;


                if (!digit) return;


                pin += digit;


                popupPinInput.value =
                    pin;


                if (pinError) {

                    pinError.textContent =
                        "";

                }


                updatePinBoxes();

            }
        );

    }
);


// ==========================================
// BACKSPACE
// ==========================================

if (pinBackspace) {

    pinBackspace.addEventListener(
        "click",
        function () {

            if (!popupPinInput) return;


            let pin =
                popupPinInput.value || "";


            pin =
                pin.slice(0, -1);


            popupPinInput.value =
                pin;


            if (pinError) {

                pinError.textContent =
                    "";

            }


            updatePinBoxes();

        }
    );

}


// ==========================================
// CONTINUE
// ==========================================

pinContinueBtn.addEventListener("click", async function () {

    const pin = airtimePinInput?.value?.trim();

    if (!pin || pin.length !== 4) {
        pinError.textContent = "Enter your 4-digit Share & Sell PIN.";
        return;
    }

    pinError.textContent = "";

    // Prevent double clicking
    if (this.dataset.processing === "true") return;

    this.dataset.processing = "true";
    this.disabled = true;
    this.textContent = "Processing...";

    try {
        await processAirtimeConversion(pin);
    } catch (error) {
        console.error("PIN conversion error:", error);

        pinError.textContent =
            error?.message || "Unable to process conversion.";
    } finally {
        this.dataset.processing = "false";
        this.disabled = false;
        this.textContent = "Continue";
    }
});

// ==========================================
// CLOSE BUTTON
// ==========================================

if (closePinPopup) {

    closePinPopup.addEventListener(
        "click",
        function () {

            closePinPopupFunction();

        }
    );

}


// ==========================================
// CLICK OUTSIDE
// ==========================================

if (pinOverlay) {

    pinOverlay.addEventListener(
        "click",
        function (e) {

            if (e.target === pinOverlay) {

                closePinPopupFunction();

            }

        }
    );

}


// ==========================================
// INITIAL DISPLAY
// ==========================================

updatePinBoxes();

// ==========================================
// REQUEST OTP
// ==========================================

if (requestOtpBtn) {

    requestOtpBtn.addEventListener(
        "click",
        async function () {

            const network =
                convertNetwork?.value
                ?.trim()
                ?.toUpperCase();

            const phoneNumber =
                document.getElementById(
                    "phoneNumber"
                )?.value
                ?.trim();


            if (!network) {

                showToast(
                    "Please select your network first.",
                    "error"
                );

                return;

            }


            if (!phoneNumber) {

                showToast(
                    "Please enter your phone number.",
                    "error"
                );

                return;

            }


            requestOtpBtn.disabled = true;

            requestOtpBtn.textContent =
                "Sending OTP...";


            try {

                const result =
                    await apiRequest(
                        "/api/airtime-bridge/request-otp",
                        "POST",
                        {
                            networkName: network,
                            sender: phoneNumber
                        }
                    );


                console.log(
                    "🔥 REQUEST OTP RESPONSE:",
                    result
                );


                if (!result) {

                    requestOtpBtn.disabled = false;

                    requestOtpBtn.textContent =
                        "Request OTP";

                    return;

                }


                if (result.success) {

                    showToast(
                        result.message ||
                        "OTP sent successfully."
                    );


                    if (otpSection) {

                        otpSection.style.display =
                            "block";

                    }


                    const otpInput =
                        document.getElementById(
                            "airtimeOtp"
                        );

                    if (otpInput) {
                        otpInput.focus();
                    }


                    requestOtpBtn.textContent =
                        "OTP Sent ✓";


                } else {

                    showToast(
                        result.message ||
                        "Unable to send OTP.",
                        "error"
                    );


                    requestOtpBtn.disabled = false;

                    requestOtpBtn.textContent =
                        "Request OTP";

                }


            } catch (error) {

                console.error(
                    "🔥 REQUEST OTP ERROR:",
                    error
                );


                showToast(
                    "Unable to request OTP. Please try again.",
                    "error"
                );


                requestOtpBtn.disabled = false;

                requestOtpBtn.textContent =
                    "Request OTP";

            }

        }
    );

}


// ==========================================
// VERIFY OTP
// ========================================

if (verifyOtpBtn) {

    verifyOtpBtn.addEventListener(
        "click",
        async function () {

            const network =
                convertNetwork?.value
                ?.trim()
                ?.toUpperCase();

            const phoneNumber =
                document.getElementById(
                    "phoneNumber"
                )?.value
                ?.trim();

            const otp =
                document.getElementById(
                    "airtimeOtp"
                )?.value
                ?.trim();


            if (!network || !phoneNumber) {

                showToast(
                    "Please select your network and enter your phone number.",
                    "error"
                );

                return;

            }


            if (!otp) {

                showToast(
                    "Please enter the OTP.",
                    "error"
                );

                return;

            }


            verifyOtpBtn.disabled = true;

            verifyOtpBtn.textContent =
                "Verifying...";


            try {

                const result =
                    await apiRequest(
                        "/api/airtime-bridge/verify-otp",
                        "POST",
                        {
                            networkName: network,
                            sender: phoneNumber,
                            otp: otp
                        }
                    );


                console.log(
                    "🔥 VERIFY OTP RESPONSE:",
                    result
                );


                if (!result) {

                    verifyOtpBtn.disabled = false;

                    verifyOtpBtn.textContent =
                        "Verify OTP";

                    return;

                }


                if (result.success) {

                    showToast(
                        result.message ||
                        "OTP verified successfully."
                    );


                    verifyOtpBtn.textContent =
                        "Verified ✓";

                    verifyOtpBtn.disabled = true;


                    const quotaSection =
                        document.getElementById(
                            "quotaSection"
                        );


                    if (quotaSection) {

                        quotaSection.style.display =
                            "block";

                    }


                } else {

                    showToast(
                        result.message ||
                        "OTP verification failed.",
                        "error"
                    );


                    verifyOtpBtn.disabled = false;

                    verifyOtpBtn.textContent =
                        "Verify OTP";

                }


            } catch (error) {

                console.error(
                    "🔥 VERIFY OTP ERROR:",
                    error
                );


                showToast(
                    "Unable to verify OTP. Please try again.",
                    "error"
                );


                verifyOtpBtn.disabled = false;

                verifyOtpBtn.textContent =
                    "Verify OTP";

            }

        }
    );

}


// ==========================================
// CHECK AIRTIME QUOTA
// ==========================================

if (checkQuotaBtn) {

    checkQuotaBtn.addEventListener(
        "click",
        async function () {

            const network =
                convertNetwork?.value
                ?.trim()
                ?.toUpperCase();

            const amount =
                Number(
                    convertAmount?.value
                );


            if (!network) {

                showToast(
                    "Please select your network first.",
                    "error"
                );

                return;

            }


            if (
                !Number.isFinite(amount) ||
                amount < 50
            ) {

                showToast(
                    "Minimum airtime conversion amount is ₦50.",
                    "error"
                );

                return;

            }


            airtimeQuotaVerified = false;

            checkQuotaBtn.disabled = true;

            checkQuotaBtn.textContent =
                "Checking...";


            try {

                const result =
                    await apiRequest(
                        "/api/airtime-bridge/check-quota",
                        "POST",
                        {
                            networkName: network,
                            amount: amount
                        }
                    );


                console.log(
                    "🔥 CHECK QUOTA RESPONSE:",
                    result
                );


                if (!result) {

                    checkQuotaBtn.disabled = false;

                    checkQuotaBtn.textContent =
                        "Check Airtime Availability";

                    return;

                }


                if (
                    result.success &&
                    result.available === true
                ) {

                    airtimeQuotaVerified = true;


                    showToast(
                        result.message ||
                        "Airtime is available for conversion."
                    );


                    checkQuotaBtn.textContent =
                        "Airtime Available ✓";

                    checkQuotaBtn.disabled = true;


                    const screenshotSection =
                        document.getElementById(
                            "screenshotSection"
                        );


                    if (screenshotSection) {

                        screenshotSection.style.display =
                            "block";

                    }


                    console.log(
                        "✅ Airtime quota verified."
                    );


                    return;

                }


                airtimeQuotaVerified = false;


                showToast(
                    result.message ||
                    "Airtime is currently unavailable.",
                    "error"
                );


                checkQuotaBtn.disabled = false;

                checkQuotaBtn.textContent =
                    "Check Airtime Availability";


            } catch (error) {

                console.error(
                    "🔥 CHECK QUOTA ERROR:",
                    error
                );


                airtimeQuotaVerified = false;


                showToast(
                    "Unable to check airtime availability.",
                    "error"
                );


                checkQuotaBtn.disabled = false;

                checkQuotaBtn.textContent =
                    "Check Airtime Availability";

            }

        }
    );

        }
                
       // ==========================================
// RESET QUOTA WHEN NETWORK OR AMOUNT CHANGES
// ==========================================

if (convertNetwork) {

    convertNetwork.addEventListener(
        "change",
        function () {

            resetAirtimeQuotaState();

        }
    );

}


if (convertAmount) {

    convertAmount.addEventListener(
        "input",
        function () {

            resetAirtimeQuotaState();

        }
    );

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
        "₦" + Number(data.walletBalance || 0).toLocaleString("en-NG", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    if (totalEarned)
    totalEarned.textContent =
        "₦" + Number(data.totalEarned || 0).toLocaleString("en-NG", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    
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
       
});
