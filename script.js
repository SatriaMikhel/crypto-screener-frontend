const BACKEND = "https://crypto-screener-backend-production.up.railway.app";

/* MARKET */
async function loadMarket() {
  const r = await fetch(BACKEND + "/api/market");
  const d = await r.json();

  document.getElementById("market").innerHTML =
    d.length ? d.slice(0, 10).map(c =>
      `${c.name}: $${c.current_price}`
    ).join("<br>") : "No data";
}

/* BINANCE WHALE */
async function loadWhaleBinance() {
  const r = await fetch(BACKEND + "/api/whales/binance/BTCUSDT");
  const d = await r.json();

  document.getElementById("whaleBinance").innerHTML =
    d.length ? d.map(x => 
      `<li>${x.side} — $${x.notional.toFixed(0)}</li>`
    ).join("") : "<li>No whale trades detected</li>";
}

/* ONCHAIN WHALE */
async function loadWhaleOnchain() {
  const r = await fetch(BACKEND + "/api/whales/onchain");
  const data = await r.json();
  const list = [...data.eth, ...data.bsc];

  document.getElementById("whaleOnchain").innerHTML =
    list.length ? list.map(x => `
      <li>${x.chain.toUpperCase()} — $${x.value_usd.toFixed(0)}</li>
    `).join("") : "<li>No on-chain whales</li>";
}

/* INIT */
loadMarket();
loadWhaleBinance();
loadWhaleOnchain();

/* AUTO REFRESH */
setInterval(loadWhaleBinance, 60000);
setInterval(loadWhaleOnchain, 120000);
