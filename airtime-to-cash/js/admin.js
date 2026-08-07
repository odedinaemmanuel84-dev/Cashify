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

        const response = await fetch(BASE_URL + endpoint, options);

        const data = await response.json();

        return data;

    } catch (err) {

        console.error(err);

        alert("Network Error");

        return {

            success: false

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

document.querySelectorAll(".sidebar-menu li[data-page]")
.forEach(item => {

    item.onclick = () => {

        document
            .querySelectorAll(".sidebar-menu li")
            .forEach(li => li.classList.remove("active"));

        item.classList.add("active");

        Object.values(pages).forEach(section => {

            if (section) {
                section.style.display = "none";
            }

        });

        const page = item.dataset.page;

        if (pages[page]) {
            pages[page].style.display = "block";
        }

    };

});

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

    if (!result.success) return;

    const data = result.dashboard;

    document.getElementById("totalUsers").textContent =
        Number(data.totalUsers || 0).toLocaleString();

    document.getElementById("totalTransactions").textContent =
        Number(data.totalTransactions || 0).toLocaleString();

    document.getElementById("pendingTransactions").textContent =
        Number(data.pendingTransactions || 0).toLocaleString();

    document.getElementById("walletTotal").textContent =
        "₦" + Number(data.totalWallet || 0).toLocaleString();

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

function renderTransactions(transactions){

    const tbody=document.getElementById("transactionTable");

    if(!tbody) return;

    tbody.innerHTML="";

    transactions.forEach(transaction=>{

        tbody.innerHTML+=`

<tr>

<td>

<img
class="table-image"
src="${transaction.screenshot || ''}"
onclick="openImageModal('${transaction.screenshot || ''}')">

</td>

<td>${transaction.transactionId}</td>

<td>${transaction.user?.fullName || "-"}</td>

<td>${transaction.network}</td>

<td>

₦${Number(transaction.airtimeAmount).toLocaleString()}

</td>

<td>

₦${Number(transaction.amountToReceive).toLocaleString()}

</td>

<td>

<span class="status ${transaction.status.toLowerCase()}">

${transaction.status}

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

    if (!result.success) return;

    renderUsers(result.users);

}

function renderUsers(users) {

    const tbody = document.getElementById("userTable");

    if (!tbody) return;

    tbody.innerHTML = "";

    users.forEach(user => {

        tbody.innerHTML += `

<tr>

<td>

<img
class="table-image"
src="${user.profileImage || 'https://via.placeholder.com/60'}">

</td>

<td>${user.fullName}</td>

<td>${user.email}</td>

<td>${user.phone}</td>

<td>

₦${Number(user.walletBalance).toLocaleString()}

</td>

<td>

<span class="status ${user.status}">

${user.status}

</span>

</td>

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

    const result = await apiRequest("/api/admin/withdrawals");

    if (!result.success) return;

    const tbody = document.getElementById("withdrawalTable");

    if (!tbody) return;

    tbody.innerHTML = "";

    result.withdrawals.forEach(item => {

        tbody.innerHTML += `

<tr>

<td>${item.user?.fullName || "-"}</td>

<td>${item.bank?.bankName || "-"}</td>

<td>

₦${Number(item.amount).toLocaleString()}

</td>

<td>

<span class="status ${item.status.toLowerCase()}">

${item.status}

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

function openImageModal(url){

    const modal=document.getElementById("transactionModal");

    const image=document.getElementById("modalScreenshot");

    if(image){

        image.src=url;

    }

    modal.classList.add("active");

}

function closeTransactionModal(){

    document

    .getElementById("transactionModal")

    .classList.remove("active");

}

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
// START
// ==========================================

loadDashboard();

loadTransactions();

loadUsers();
