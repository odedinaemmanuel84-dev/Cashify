// ==========================================
// ADMIN AUTH CHECK
// ==========================================

const user = JSON.parse(localStorage.getItem("user"));

if (!user || user.role !== "admin") {

    window.location.href = "login.html";

}

// ==========================================
// CONFIG
// ==========================================

const BASE_URL = "https://cashify-backend-pvxb.onrender.com";

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

// ==========================================
// API REQUEST
// ==========================================

async function apiRequest(endpoint, method = "GET", body = null) {

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

    return await response.json();

}

// ==========================================
// LOAD ADMIN DASHBOARD
// ==========================================

async function loadDashboard() {

    const result = await apiRequest("/api/admin/dashboard");

    if (!result.success) return;

    const data = result.dashboard;

    document.getElementById("totalUsers").textContent =
        data.totalUsers;

    document.getElementById("totalTransactions").textContent =
        data.totalTransactions;

    document.getElementById("pendingTransactions").textContent =
        data.pendingTransactions;

    document.getElementById("totalWallet").textContent =
        "₦" +
        Number(data.totalWallet).toLocaleString();

}

// ==========================================
// LOAD TRANSACTIONS
// ==========================================

async function loadTransactions() {

    const result = await apiRequest("/api/admin/transactions");

    if (!result.success) return;

    const tbody = document.getElementById("transactionTable");

    tbody.innerHTML = "";

    result.transactions.forEach(transaction => {


tbody.innerHTML += `

<tr>

<td>${transaction.transactionId}</td>

<td>${transaction.user?.fullName || "-"}</td>

<td>${transaction.network}</td>

<td>₦${Number(transaction.airtimeAmount).toLocaleString()}</td>

<td>

<span class="status ${transaction.status.toLowerCase()}">

${transaction.status}

</span>

</td>

<td>

<img
src="${transaction.screenshot}"
alt="Screenshot"
style="
width:70px;
height:70px;
object-fit:cover;
border-radius:10px;
cursor:pointer;"
onclick="openImageModal('${transaction.screenshot}')">

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
        
// ==========================================
// APPROVE
// ==========================================

async function approveTransaction(id) {

    const result = await apiRequest(
        `/api/transaction/approve/${id}`,
        "PATCH"
    );

    if (result.success) {

        alert(result.message);

        await loadDashboard();

        await loadTransactions();

    } else {

        alert(result.message);

    }

}

// ==========================================
// REJECT
// ==========================================

async function rejectTransaction(id) {

    const result = await apiRequest(
        `/api/transaction/reject/${id}`,
        "PATCH"
    );

    if (result.success) {

        alert(result.message);

        await loadDashboard();

        await loadTransactions();

    } else {

        alert(result.message);

    }

}

// ==========================================
// COMPLETE
// ==========================================

async function completeTransaction(id) {

    const result = await apiRequest(
        `/api/transaction/complete/${id}`,
        "PATCH"
    );

    if (result.success) {

        alert(result.message);

        await loadDashboard();

        await loadTransactions();

    } else {

        alert(result.message);

    }

}
        
// ==========================================
// LOGOUT
// ==========================================

function logout(){

    localStorage.removeItem("token");

    window.location.href = "login.html";

}

// ==========================================
// START
// ==========================================

loadDashboard();

loadTransactions();

 function openImageModal(imageUrl) {

    document.getElementById("modalImage").src = imageUrl;

    document.getElementById("imageModal").style.display = "flex";

}

function closeImageModal() {

    document.getElementById("imageModal").style.display = "none";

}   

// ==========================================
// LIVE SEARCH
// ==========================================

document.getElementById("searchInput")?.addEventListener("keyup", function () {

    const value = this.value.toLowerCase();

    const rows = document.querySelectorAll("#transactionTable tr");

    rows.forEach(row => {

        row.style.display =
            row.innerText.toLowerCase().includes(value)
                ? ""
                : "none";

    });

});

// ==========================================
// STATUS FILTER
// ==========================================

document.getElementById("statusFilter")?.addEventListener("change", function () {

    const status = this.value.toLowerCase();

    const rows = document.querySelectorAll("#transactionTable tr");

    rows.forEach(row => {

        if (!status) {

            row.style.display = "";

            return;

        }

        row.style.display =
            row.innerText.toLowerCase().includes(status)
                ? ""
                : "none";

    });

});
