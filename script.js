const API = "https://crypto-screener-backend-production.up.railway.app";

function showSection(id) {
    document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
    document.getElementById(id).classList.remove("hidden");
}

async function fetchData(url) {
    try {
        const box = `<div class="loading">Loading...</div>`;
        return fetch(url).then(res => res.json());
    } catch (e) {
        return { error: true, message: e.message };
    }
}

/* MARKET */
async function loadMarket() {
    document.getElementById("marketList").innerHTML = `<div class="loading">Loading Market...</div>`;
    const data = await fetchData(`${API}/api/market`);

    document.getElementById("marketList").innerHTML = data
        .slice(0, 10)
        .map(c => `
        <div class="card">
            <strong>${c.name} (${c.symbol.toUpperCase()})</strong><br>
            Price: $${c.current_price}<br>
            24h: ${c.price_change_percentage_24h.toFixed(2)}%
        </div>
    `).join("");
}

loadMarket();

/* BINANCE WHALE */
async function loadWhaleBinance() {
    const symbol = document.getElementById("symbolInput").value || "BTCUSDT";
    document.getElementById("binanceList").innerHTML = `<div class="loading">Loading...</div>`;

    const data = await fetchData(`${API}/api/whales/binance/${symbol}`);

    if (!data || data.length === 0) {
        document.getElementById("binanceList").innerHTML =
            `<div class="card">Tidak ada transaksi whale ditemukan.</div>`;
        return;
    }

    document.getElementById("binanceList").innerHTML = data
        .map(w => `
        <div class="card">
            <strong>Amount: ${w.amount}</strong><br>
            Price: ${w.price}<br>
            Side: ${w.side}
        </div>
    `).join("");
}

/* ONCHAIN WHALE */
async function loadOnchain() {
    document.getElementById("onchainList").innerHTML = `<div class="loading">Loading...</div>`;

    const data = await fetchData(`${API}/api/whales/onchain`);

    let html = "";

    html += `<h3>Ethereum</h3>`;
    html += data.eth.length
        ? data.eth.map(t => `<div class="card">${JSON.stringify(t)}</div>`).join("")
        : `<div class="card">No ETH whale data.</div>`;

    html += `<h3>Binance Smart Chain</h3>`;
    html += data.bsc.length
        ? data.bsc.map(t => `<div class="card">${JSON.stringify(t)}</div>`).join("")
        : `<div class="card">No BSC whale data.</div>`;

    document.getElementById("onchainList").innerHTML = html;
}

loadOnchain();
