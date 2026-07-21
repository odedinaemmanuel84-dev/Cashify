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

document.addEventListener("DOMContentLoaded", () => {

    if(document.getElementById("transactionList") ||
       document.getElementById("transactionTable")){

        loadTransactions();

    }

});

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
