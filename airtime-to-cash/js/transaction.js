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

    result.transactions.forEach(transaction => {

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
