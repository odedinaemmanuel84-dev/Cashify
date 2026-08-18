// ==========================================
// CASHIFY ADMIN PANEL
// PART 1
// ==========================================

// ==========================================
// CONFIG
// ==========================================

const BASE_URL = "https://cashify-backend-pvxb.onrender.com";

const token = localStorage.getItem("token");

const user = JSON.parse(localStorage.getItem("user"));

// ==========================================
// AUTH CHECK
// ==========================================

if (!token || !user) {

    window.location.href = "login.html";

}

if (user.role !== "admin") {

    alert("Access denied!");

    window.location.href = "dashboard.html";

}

// ==========================================
// API REQUEST
// ==========================================

async function apiRequest(endpoint, method = "GET", body = null) {

    try {

        const options = {
            method,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        console.log("API REQUEST:", method, BASE_URL + endpoint);

        const response = await fetch(BASE_URL + endpoint, options);

        const text = await response.text();

        let data;

        try {
            data = JSON.parse(text);
        } catch {
            console.error("SERVER DID NOT RETURN JSON:", text);

            return {
                success: false,
                message: `Server returned ${response.status}`
            };
        }

        console.log(
            "API RESPONSE:",
            endpoint,
            response.status,
            data
        );

        if (!response.ok) {

            console.error(
                `API ERROR ${response.status}:`,
                data
            );

        }

        return data;

    } catch (err) {

        console.error("FETCH ERROR:", err);

        return {
            success: false,
            message: err.message
        };

    }

}

// ==========================================
// MOBILE SIDEBAR
// ==========================================

const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");


// ==========================================
// OPEN / CLOSE SIDEBAR
// ==========================================

if (menuToggle && sidebar) {

    menuToggle.addEventListener("click", (event) => {

        event.stopPropagation();

        sidebar.classList.toggle("show");

    });


    // ======================================
    // CLOSE WHEN CLICKING OUTSIDE
    // ======================================

    document.addEventListener("click", (event) => {

        if (window.innerWidth <= 768) {

            if (
                !sidebar.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {

                sidebar.classList.remove("show");

            }

        }

    });


    // ======================================
    // CLOSE WHEN CLICKING SIDEBAR ITEM
    // ======================================

    document
        .querySelectorAll(".sidebar-menu li")
        .forEach(item => {

            item.addEventListener("click", () => {

                sidebar.classList.remove("show");

            });

        });


    // ======================================
    // ESC KEY CLOSE
    // ======================================

    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {

            sidebar.classList.remove("show");

        }

    });

}

// ==========================================
// PAGE SWITCHING
// ==========================================

const pages = {
    dashboard: document.getElementById("dashboardSection"),
    transactions: document.getElementById("transactionsSection"),
    users: document.getElementById("usersSection"),
    withdrawals: document.getElementById("withdrawalsSection"),
    support: document.getElementById("supportSection")
};

const sidebarItems = document.querySelectorAll(
    ".sidebar-menu li[data-page]"
);

function showPage(pageName) {

    // Hide every page
    Object.values(pages).forEach(section => {

        if (section) {
            section.style.display = "none";
        }

    });

    // Show selected page
    if (pages[pageName]) {
        pages[pageName].style.display = "block";
    }

    // Update active sidebar item
    sidebarItems.forEach(item => {

        item.classList.remove("active");

        if (item.dataset.page === pageName) {
            item.classList.add("active");
        }

    });

    // Load data when page is opened
    if (pageName === "transactions") {
        loadTransactions();
    }

    if (pageName === "users") {
        loadUsers();
    }

    if (pageName === "withdrawals") {
        loadWithdrawals();
    }

    if (pageName === "support") {
        loadSupportTickets();
    }

}


// Sidebar click
sidebarItems.forEach(item => {

    item.addEventListener("click", () => {

        const page = item.dataset.page;

        showPage(page);

        // Close mobile sidebar
        if (window.innerWidth <= 768 && sidebar) {
            sidebar.classList.remove("show");
        }

    });

});


// Start on dashboard
showPage("dashboard");      

// ==========================================
// LOGOUT
// ==========================================

document.getElementById("logoutBtn").onclick=function(){

localStorage.removeItem("token");

localStorage.removeItem("user");

window.location.href="login.html";

};

// ==========================================
// LOAD DASHBOARD
// ==========================================

async function loadDashboard() {

    const result = await apiRequest("/api/admin/dashboard");

    console.log("DASHBOARD RESULT:", result);

    if (!result.success) {

        console.error(
            "Dashboard failed:",
            result.message
        );

        return;
    }

    const data = result.dashboard || {};

    const totalUsers =
        document.getElementById("totalUsers");

    const totalTransactions =
        document.getElementById("totalTransactions");

    const pendingTransactions =
        document.getElementById("pendingTransactions");

    const walletTotal =
        document.getElementById("walletTotal");

    if (totalUsers) {
        totalUsers.textContent =
            Number(data.totalUsers || 0).toLocaleString();
    }

    if (totalTransactions) {
        totalTransactions.textContent =
            Number(data.totalTransactions || 0).toLocaleString();
    }

    if (pendingTransactions) {
        pendingTransactions.textContent =
            Number(data.pendingTransactions || 0).toLocaleString();
    }

    if (walletTotal) {
        walletTotal.textContent =
            "₦" + Number(data.totalWallet || 0).toLocaleString();
    }

                   }

// ==========================================
// LOAD TRANSACTIONS
// ==========================================

let allTransactions = [];

async function loadTransactions() {

    const result = await apiRequest("/api/admin/transactions");

    if (!result.success) return;

    allTransactions = result.transactions;

    renderTransactions(allTransactions);

}

// ==========================================
// RENDER TRANSACTIONS
// ==========================================

function renderTransactions(transactions) {

    const tbody =
        document.getElementById("transactionTable");

    if (!tbody) return;

    tbody.innerHTML = "";

    if (!Array.isArray(transactions) || transactions.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align:center;padding:30px;">
                    No transactions found
                </td>
            </tr>
        `;

        return;
    }

    transactions.forEach(transaction => {

        const screenshot =
            transaction.screenshot || "";

        tbody.innerHTML += `

            <tr>

                <td>

                    ${
                        screenshot

                        ? `
                            <img
                                class="table-image"
                                src="${screenshot}"
                                alt="Transaction screenshot"
                                onclick="openImageModal('${transaction._id}')"
                            >
                        `

                        : `
                            <span>No image</span>
                        `
                    }

                </td>

                <td>
                    ${transaction.transactionId || "-"}
                </td>

                <td>
                    ${transaction.user?.fullName || "-"}
                </td>

                <td>
                    ${transaction.network || "-"}
                </td>

                <td>
                    ${transaction.phoneNumber || "-"}
                </td>

                <td>
                    ₦${Number(
                        transaction.airtimeAmount || 0
                    ).toLocaleString()}
                </td>

                <td>
                    ₦${Number(
                        transaction.amountToReceive || 0
                    ).toLocaleString()}
                </td>

                <td>

                    <span class="status ${String(
                        transaction.status || ""
                    ).toLowerCase()}">

                        ${transaction.status || "-"}

                    </span>

                </td>

                <td>

                    <button
                        class="action approve-btn"
                        onclick="approveTransaction('${transaction._id}')">

                        Approve

                    </button>

                    <button
                        class="action reject-btn"
                        onclick="rejectTransaction('${transaction._id}')">

                        Reject

                    </button>

                    <button
                        class="action complete-btn"
                        onclick="completeTransaction('${transaction._id}')">

                        Complete

                    </button>

                </td>

            </tr>

        `;

    });

}


// ==========================================
// LOAD USERS
// ==========================================

async function loadUsers() {

    const result = await apiRequest("/api/admin/users");

    console.log("USERS RESULT:", result);

    if (!result.success) {

        console.error("USERS ERROR:", result.message);

        return;
    }

    renderUsers(result.users || []);

}

// ==========================================
// RENDER USERS
// ==========================================

function renderUsers(users) {

    const tbody = document.getElementById("userTable");

    if (!tbody) return;

    tbody.innerHTML = "";

    if (!Array.isArray(users) || users.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center;padding:30px;">
                    No users found
                </td>
            </tr>
        `;

        return;
    }

    users.forEach(user => {

        tbody.innerHTML += `

            <tr>

                <!-- PROFILE -->

                <td>

                    <img
                        class="table-image"
                        src="${user.profileImage || 'https://via.placeholder.com/60'}"
                        alt="User">

                </td>

                <!-- NAME -->

                <td>
                    ${user.fullName || "-"}
                </td>

                <!-- EMAIL -->

                <td>
                    ${user.email || "-"}
                </td>

                <!-- PHONE -->

                <td>
                    ${user.phone || "-"}
                </td>

                <!-- WALLET -->

                <td>
                    ₦${Number(
                        user.walletBalance || 0
                    ).toLocaleString()}
                </td>

                <!-- STATUS -->

                <td>

                    <span class="status ${String(
                        user.status || ""
                    ).toLowerCase()}">

                        ${user.status || "Unknown"}

                    </span>

                </td>

                <!-- ACTIONS -->

                <td>

                    <button
                        class="action approve-btn"
                        onclick="activateUser('${user._id}')">

                        Activate

                    </button>

                    <button
                        class="action reject-btn"
                        onclick="suspendUser('${user._id}')">

                        Suspend

                    </button>

                </td>

            </tr>

        `;

    });

}

// ==========================================
// LOAD WITHDRAWALS
// ==========================================

async function loadWithdrawals() {

    const result =
        await apiRequest("/api/admin/withdrawals");

    console.log("WITHDRAWALS RESULT:", result);

    if (!result.success) {

        console.error(
            "Withdrawals failed:",
            result.message
        );

        return;
    }

    const tbody =
        document.getElementById("withdrawalTable");

    if (!tbody) return;

    tbody.innerHTML = "";

    const withdrawals = result.withdrawals || [];

    if (withdrawals.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align:center;padding:30px;">
                    No withdrawal requests found
                </td>
            </tr>
        `;

        return;
    }

    withdrawals.forEach(item => {

        tbody.innerHTML += `

            <tr>

                <td>
                    ${item.withdrawalId || "-"}
                </td>

                <td>
                    ${item.user?.fullName || "-"}
                </td>

                <td>
                    ${item.bankName || "-"}
                </td>

                <td>
                    ${item.accountName || "-"}
                </td>

                <td>
                    ${item.accountNumber || "-"}
                </td>

                <td>
                    ₦${Number(
                        item.amount || 0
                    ).toLocaleString()}
                </td>

                <td>

                    <span class="status ${String(
                        item.status || ""
                    ).toLowerCase()}">

                        ${item.status || "-"}

                    </span>

                </td>

                <td>

                    <button
                        class="action approve-btn">

                        Approve

                    </button>

                </td>

            </tr>

        `;

    });

}

// ==========================================
// LOAD SUPPORT TICKETS
// ==========================================

async function loadSupportTickets() {

    const result = await apiRequest("/api/admin/support");

    if (!result.success) return;

    const tbody = document.getElementById("supportTable");

    if (!tbody) return;

    tbody.innerHTML = "";

    result.tickets.forEach(ticket => {

        tbody.innerHTML += `

<tr>

<td>${ticket.user?.fullName || "-"}</td>

<td>${ticket.subject}</td>

<td>

<span class="status ${ticket.status.toLowerCase()}">

${ticket.status}

</span>

</td>

<td>

${new Date(ticket.createdAt).toLocaleDateString()}

</td>

<td>

<button class="action view-btn">

View

</button>

</td>

</tr>

`;

    });

}

// ==========================================
// APPROVE TRANSACTION
// ==========================================

async function approveTransaction(id){

    if(!confirm("Approve this transaction?")) return;

    const result=await apiRequest(

        `/api/transaction/approve/${id}`,

        "PATCH"

    );

    alert(result.message);

    if(result.success){

        loadDashboard();

        loadTransactions();

    }

}

// ==========================================
// REJECT TRANSACTION
// ==========================================

async function rejectTransaction(id){

    if(!confirm("Reject this transaction?")) return;

    const result=await apiRequest(

        `/api/transaction/reject/${id}`,

        "PATCH"

    );

    alert(result.message);

    if(result.success){

        loadDashboard();

        loadTransactions();

    }

}

// ==========================================
// COMPLETE TRANSACTION
// ==========================================

async function completeTransaction(id){

    if(!confirm("Mark transaction as completed?")) return;

    const result=await apiRequest(

        `/api/transaction/complete/${id}`,

        "PATCH"

    );

    alert(result.message);

    if(result.success){

        loadDashboard();

        loadTransactions();

    }

}

// ==========================================
// ACTIVATE USER
// ==========================================

async function activateUser(id){

    const result=await apiRequest(

        `/api/admin/user/${id}/activate`,

        "PATCH"

    );

    alert(result.message);

    if(result.success){

        loadUsers();

    }

}

// ==========================================
// SUSPEND USER
// ==========================================

async function suspendUser(id){

    const result=await apiRequest(

        `/api/admin/user/${id}/suspend`,

        "PATCH"

    );

    alert(result.message);

    if(result.success){

        loadUsers();

    }

}

// ==========================================
// IMAGE MODAL
// ==========================================

function openImageModal(id) {

    const transaction = allTransactions.find(
        t => t._id === id
    );

    if (!transaction) {
        console.error("Transaction not found:", id);
        return;
    }

    const modal = document.getElementById("transactionModal");

    // ==============================
    // SCREENSHOT
    // ==============================

    const image = document.getElementById("modalScreenshot");

    if (image) {
        image.src = transaction.screenshot || "";
    }

    // ==============================
    // TRANSACTION DETAILS
    // ==============================

    document.getElementById("modalTransactionId").textContent =
        transaction.transactionId || "-";

    document.getElementById("modalUser").textContent =
        transaction.user?.fullName || "-";

    document.getElementById("modalNetwork").textContent =
        transaction.network || "-";

    document.getElementById("modalPhone").textContent =
        transaction.phoneNumber || "-";

    document.getElementById("modalAmount").textContent =
        "₦" +
        Number(transaction.airtimeAmount || 0).toLocaleString();

    document.getElementById("modalReceive").textContent =
        "₦" +
        Number(transaction.amountToReceive || 0).toLocaleString();

    document.getElementById("modalStatus").textContent =
        transaction.status || "-";

    document.getElementById("modalDate").textContent =
        transaction.createdAt
            ? new Date(transaction.createdAt).toLocaleString()
            : "-";

    document.getElementById("modalNote").textContent =
        transaction.note || "No note";

    // ==============================
    // MODAL ACTION BUTTONS
    // ==============================

    const approveBtn =
        document.getElementById("modalApproveBtn");

    const rejectBtn =
        document.getElementById("modalRejectBtn");

    const completeBtn =
        document.getElementById("modalCompleteBtn");


    // APPROVE

    if (approveBtn) {

        approveBtn.onclick = async function () {

            await approveTransaction(id);

            closeTransactionModal();

        };

    }


    // REJECT

    if (rejectBtn) {

        rejectBtn.onclick = async function () {

            await rejectTransaction(id);

            closeTransactionModal();

        };

    }


    // COMPLETE

    if (completeBtn) {

        completeBtn.onclick = async function () {

            await completeTransaction(id);

            closeTransactionModal();

        };

    }


    // ==============================
    // SHOW MODAL
    // ==============================

    modal.classList.add("active");
}

// ==========================================
// CLOSE TRANSACTION MODAL
// ==========================================

function closeTransactionModal() {

    const modal = document.getElementById("transactionModal");

    if (modal) {
        modal.classList.remove("active");
    }

}

document.getElementById("transactionModal")?.addEventListener(
    "click",
    function(event) {

        if (event.target === this) {
            closeTransactionModal();
        }

    }
);

// ==========================================
// SEARCH
// ==========================================

document.getElementById("searchInput")?.addEventListener("keyup",function(){

    const value=this.value.toLowerCase();

    renderTransactions(

        allTransactions.filter(t=>

            t.transactionId.toLowerCase().includes(value)||

            t.user?.fullName?.toLowerCase().includes(value)||

            t.network.toLowerCase().includes(value)

        )

    );

});

// ==========================================
// TEST AIRTIMEBRIDGE OTP
// ==========================================

async function testAirtimeOtp() {

    const network = prompt(
        "Enter network: MTN, AIRTEL, GLO or 9MOBILE"
    );

    if (!network) return;

    const sender = prompt(
        "Enter YOUR phone number:"
    );

    if (!sender) return;

    const result = await apiRequest(
        "/api/airtime-bridge/request-otp",
        "POST",
        {
            networkName: network,
            sender: sender
        }
    );

    console.log("OTP TEST RESULT:", result);

    alert(
        result.success
            ? "✅ " + result.message
            : "❌ " + (result.message || "OTP request failed.")
    );
}

async function testAirtimeOtpVerify() {

    const network = prompt(
        "Enter network: MTN, AIRTEL, GLO or 9MOBILE"
    );

    if (!network) return;

    const sender = prompt(
        "Enter the same phone number:"
    );

    if (!sender) return;

    const otp = prompt(
        "Enter the OTP you received:"
    );

    if (!otp) return;

    const result = await apiRequest(
        "/api/airtime-bridge/verify-otp",
        "POST",
        {
            networkName: network,
            sender: sender,
            otp: otp
        }
    );

    console.log("FULL OTP VERIFY RESULT:", result);

alert(
    JSON.stringify(result, null, 2)
);

}

// ==========================================
// TEST AIRTIMEQUOTA
// ==========================================

async function testAirtimeQuota() {

    const network = prompt(
        "Enter network: MTN, AIRTEL, GLO or 9MOBILE"
    );

    if (!network) return;

    const amount = prompt(
        "Enter airtime amount to test:"
    );

    if (!amount) return;

    const result = await apiRequest(
        "/api/airtime-bridge/check-quota",
        "POST",
        {
            networkName: network,
            amount: Number(amount)
        }
    );

    console.log("🔥 QUOTA TEST RESULT:", result);

    alert(
        result.success
            ? "✅ Quota available\n\n" + (result.message || "")
            : "❌ Quota check failed\n\n" +
              (result.message || "Unknown error")
    );
}

// ==========================================
// START ADMIN PANEL
// ==========================================

async function initializeAdminPanel() {

    console.log("Initializing Cashify Admin Panel...");

    await loadDashboard();

    await loadTransactions();

    await loadUsers();

    await loadWithdrawals();

    await loadSupportTickets();

    console.log("Cashify Admin Panel loaded successfully.");

}

initializeAdminPanel();

// ==========================================
// TEST AIRTIMEBRIDGE CONNECTION
// ==========================================

async function testAirtimeBridge() {

    try {

        const result = await apiRequest(
            "/api/airtime-bridge/test"
        );

        console.log("AIRTIMEBRIDGE TEST:", result);

        alert(
            result.success
                ? "AirtimeBridge connection is working!"
                : "AirtimeBridge test failed."
        );

    } catch (error) {

        console.error(
            "AirtimeBridge test error:",
            error
        );

        alert("Connection test failed.");

    }

}
