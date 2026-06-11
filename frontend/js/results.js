import { connectWallet } from "./blockchain.js";

let contract = null;
let isLoading = false;

document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("refreshResults").addEventListener("click", () => {
    if (!isLoading) loadAllResults();
  });
  
  // Add notification styles
  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideIn { from { transform: translateX(400px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(400px); opacity: 0; } }
  `;
  document.head.appendChild(style);
  
  try {
    await connectWallet();
    await loadAllResults();
  } catch (err) {
    console.error("Connection error:", err);
  }
});

async function loadAllResults() {
  if (isLoading) return;
  isLoading = true;
  
  const container = document.getElementById("resultsContainer");
  container.innerHTML = "<div class='loading'>⛓️ Loading election results from blockchain...</div>";
  
  const btn = document.getElementById("refreshResults");
  btn.disabled = true;
  btn.textContent = "⏳ REFRESHING...";
  
  try {
    const countRes = await fetch("/api/elections/count");
    const { count } = await countRes.json();
    
    if (count === 0) { 
      container.innerHTML = "<div class='loading'>📭 No elections yet.</div>";
      showNotification("No active elections", "info");
      return; 
    }
    
    container.innerHTML = "";
    const cards = [];
    let hasResults = false;
    
    for (let i = 1; i <= count; i++) {
      const electionRes = await fetch(`/api/elections/${i}`);
      const { election } = await electionRes.json();
      const [id, name, start, end, active] = election;
      if (!active) continue;
      hasResults = true;
      
      const resultsRes = await fetch(`/api/elections/${i}/results`);
      const { results } = await resultsRes.json();
      const total = results.reduce((sum, c) => sum + Number(c[3]), 0);
      
      const card = document.createElement("div");
      card.className = "result-card";
      card.innerHTML = `<h2>🗳️ ${name}</h2>`;
      
      results.forEach((c, idx) => {
        const pct = total === 0 ? 0 : (c[3] / total) * 100;
        const row = document.createElement("div");
        row.className = "candidate-row";
        row.innerHTML = `
          <div><span class="candidate-name">${c[1]}</span><br><small>${c[2]}</small></div>
          <div class="candidate-votes">${c[3]} votes (${pct.toFixed(1)}%)</div>
        `;
        
        const bar = document.createElement("div");
        bar.className = "bar-container";
        const fill = document.createElement("div");
        fill.className = "bar-fill animated";
        fill.style.width = "0%";
        bar.appendChild(fill);
        
        // Animate bar fill with delay
        setTimeout(() => {
          fill.style.width = `${pct}%`;
        }, idx * 200);
        
        card.appendChild(row);
        card.appendChild(bar);
      });
      
      const totalDiv = document.createElement("div");
      totalDiv.className = "total-votes";
      totalDiv.innerText = `⭐ Total Votes: ${total}`;
      card.appendChild(totalDiv);
      
      cards.push(card);
    }
    
    if (!hasResults) {
      container.innerHTML = "<div class='loading'>📭 No active election results available.</div>";
      return;
    }
    
    // Animate card reveals
    cards.forEach((card, idx) => {
      setTimeout(() => {
        container.appendChild(card);
      }, idx * 150);
    });
    
    showNotification(`✓ Loaded ${cards.length} election result${cards.length !== 1 ? 's' : ''}`, "success");
    
  } catch (err) {
    console.error(err);
    container.innerHTML = `<div class='error'>❌ Error: ${err.message}</div>`;
    showNotification("Failed to load results", "error");
  } finally {
    btn.disabled = false;
    btn.textContent = "🔄 REFRESH RESULTS";
    isLoading = false;
  }
}

function showNotification(message, type) {
  const notif = document.createElement("div");
  notif.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 14px 20px;
    border-radius: 40px;
    color: white;
    font-weight: bold;
    z-index: 9999;
    animation: slideIn 0.4s ease-out;
    font-family: 'Orbitron', system-ui;
    letter-spacing: 1px;
    border: 2px solid;
    max-width: 300px;
    box-shadow: 0 0 20px rgba(0, 170, 255, 0.4);
  `;
  
  if (type === "error") {
    notif.style.background = "rgba(255, 68, 68, 0.9)";
    notif.style.borderColor = "rgba(255, 100, 100, 0.5)";
  } else if (type === "success") {
    notif.style.background = "rgba(0, 255, 100, 0.9)";
    notif.style.borderColor = "rgba(0, 255, 100, 0.5)";
  } else {
    notif.style.background = "rgba(0, 170, 255, 0.9)";
    notif.style.borderColor = "rgba(0, 170, 255, 0.5)";
  }
  
  notif.innerText = message;
  document.body.appendChild(notif);
  
  setTimeout(() => {
    notif.style.animation = "slideOut 0.4s ease-out";
    setTimeout(() => notif.remove(), 400);
  }, 3000);
<<<<<<< HEAD
}
=======
}
>>>>>>> 42f8b72 (docs: update dissertation project files)
