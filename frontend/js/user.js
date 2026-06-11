import { connectWallet, getContract, getCurrentAccount } from "./blockchain.js";

let contract = null;
let currentElectionId = null;
let selectedCandidateId = null;
let isProcessing = false;

function setupListeners() {
  console.log("user.js setupListeners");
  const connectBtn = document.getElementById("connectWalletBtn");
  if (connectBtn) connectBtn.addEventListener("click", onConnectWallet);
  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) loginBtn.addEventListener("click", onLogin);
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) logoutBtn.addEventListener("click", logout);
  const castButton = document.getElementById("castBtn");
  if (castButton) {
    castButton.addEventListener("click", castVote);
    console.log("castBtn listener attached", castButton);
  } else {
    console.warn("castBtn not found on page");
  }
  const backBtn = document.getElementById("backToDashboard");
  if (backBtn) backBtn.addEventListener("click", () => showPage("dashboard"));
  const backConfirmBtn = document.getElementById("backToDashboardConfirm");
  if (backConfirmBtn) backConfirmBtn.addEventListener("click", () => showPage("dashboard"));

  // Add animations
  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(400px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(400px); opacity: 0; }
    }
    @keyframes cardRipple {
      from { width: 0; height: 0; opacity: 1; }
      to { width: 300px; height: 300px; opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupListeners);
} else {
  setupListeners();
}

async function onConnectWallet() {
  try {
    const btn = document.getElementById("connectWalletBtn");
    btn.disabled = true;
    btn.textContent = "⏳ CONNECTING...";
    
    const account = await connectWallet();
    contract = getContract();
    document.getElementById("voterId").value = account;
    
    btn.textContent = "✓ CONNECTED";
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = "🦊 CONNECT METAMASK";
    }, 2000);
    
    showNotification(`Connected: ${account.slice(0,6)}...${account.slice(-4)}`, "success");
  } catch (err) {
    showNotification(err.message || "MetaMask connection failed", "error");
    document.getElementById("connectWalletBtn").textContent = "🦊 CONNECT METAMASK";
    document.getElementById("connectWalletBtn").disabled = false;
  }
}

async function onLogin() {
  const voterAddress = document.getElementById("voterId").value.trim();
  if (!voterAddress) {
    showNotification("Enter wallet address", "error");
    return;
  }

  // 🔥 FIX: If contract is not ready, try to connect wallet automatically
  if (!contract) {
    try {
      showNotification("Connecting to wallet...", "info");
      const account = await connectWallet();
      contract = getContract();
      document.getElementById("voterId").value = account;
      showNotification(`Connected as ${account.slice(0,6)}...${account.slice(-4)}`, "success");
    } catch (err) {
      showNotification("Please click 'Connect MetaMask' first", "error");
      return;
    }
  }

  // Double-check we have a contract instance
  if (!contract) {
    showNotification("Contract not available. Please refresh and connect wallet.", "error");
    return;
  }

  const btn = document.getElementById("loginBtn");
  btn.disabled = true;
  btn.textContent = "⏳ LOGGING IN...";
  
  // Simulate a short delay and show dashboard
  setTimeout(() => {
    document.getElementById("voterIdDisplay").innerText = voterAddress.slice(0,10)+"...";
    document.getElementById("voterIdDisplay").style.display = "inline";
    document.getElementById("logoutBtn").style.display = "block";
    loadElections();
    showPage("dashboard");
    
    btn.disabled = false;
    btn.textContent = "🔓 LOGIN & CONTINUE";
  }, 600);
}

async function loadElections() {
  const container = document.getElementById("electionList");
  container.innerHTML = "<div class='loading'>⛓️ Loading elections from blockchain...</div>";
  try {
    const countRes = await fetch("/api/elections/count");
    const { count } = await countRes.json();
    console.log("Total elections:", count);
    if (count === 0) {
      container.innerHTML = "<div class='loading'>📭 No elections found.</div>";
      return;
    }
    let anyActive = false;
    const electionCards = [];
    for (let i = 1; i <= count; i++) {
      const electionRes = await fetch(`/api/elections/${i}`);
      const { election } = await electionRes.json();
      const [id, name, start, end, active] = election;
      if (!active) continue;
      anyActive = true;
      let hasVoted = false;
      try {
        const currentAccount = await getCurrentAccount();
        if (currentAccount) {
          hasVoted = await contract.hasAddressVoted(i, currentAccount);
        }
      } catch(e) { console.warn("Error checking vote status", e); }
      const div = document.createElement("div");
      div.className = "election-card";
      div.innerHTML = `
        <h3>${name}</h3>
        <p>🗓️ Ends: ${new Date(end*1000).toLocaleString()}</p>
        <div class="status ${hasVoted ? 'voted' : 'active'}">${hasVoted ? "✓ VOTED" : "● ACTIVE"}</div>
        ${!hasVoted ? `<button class="vote-btn" data-id="${i}" style="margin-top: 12px; width: 100%;">🗳️ CAST VOTE</button>` : ""}
      `;
      if (!hasVoted) {
        div.querySelector(".vote-btn").addEventListener("click", () => openVoting(i, name));
      }
      electionCards.push(div);
    }
    if (!anyActive) {
      container.innerHTML = "<div class='loading'>📭 No active elections at this time.</div>";
      return;
    }
    container.innerHTML = "";
    electionCards.forEach((card, idx) => {
      setTimeout(() => {
        container.appendChild(card);
      }, idx * 100);
    });
  } catch (err) {
    console.error(err);
    container.innerHTML = "<div class='error'>❌ Error: Make sure backend is running.</div>";
  }
}

async function openVoting(electionId, electionName) {
  console.log("openVoting", { electionId, electionName });
  currentElectionId = electionId;
  selectedCandidateId = null;
  const castBtn = document.getElementById("castBtn");
  if (castBtn) {
    castBtn.classList.remove("ready");
    castBtn.disabled = false;
    castBtn.textContent = "🗳️ CAST VOTE";
  }
  document.getElementById("votingElectionName").innerText = "⚙️ " + electionName;
  try {
    const res = await fetch(`/api/elections/${electionId}/candidates`);
    const { candidates } = await res.json();
    console.log("Candidates:", candidates);
    const grid = document.getElementById("candidatesGrid");
    grid.innerHTML = "<div class='loading'>⏳ Loading candidates...</div>";
    
    setTimeout(() => {
      grid.innerHTML = "";
      if (candidates.length === 0) {
        grid.innerHTML = "<div class='loading'>📭 No candidates added yet.</div>";
        return;
      }
      candidates.forEach((cand) => {
        const card = document.createElement("div");
        card.className = "candidate-card";
        const candId = Number(cand.id ?? cand[0]);
        const candName = String(cand.name ?? cand[1] ?? "Unnamed Candidate");
        const candParty = String(cand.party ?? cand[2] ?? "Independent");

        card.innerHTML = `
          <div class="radio"></div>
          <div class="info" style="flex: 1;">
            <div class="name">${candName}</div>
            <div class="party">${candParty || 'Independent'}</div>
          </div>
        `;
        card.addEventListener("click", () => {
          console.log("candidate clicked", { candId, candName, candParty });
          selectCandidate(candId, card);
        });
        grid.appendChild(card);
      });
      
      document.getElementById("selectedPreview").innerHTML = "👆 Select a candidate above";
      document.getElementById("castBtn").classList.remove("ready");
      showPage("voting");
    }, 300);
    
  } catch (err) {
    showNotification("Failed to load candidates: " + err.message, "error");
  }
}

function selectCandidate(candidateId, card) {
  document.querySelectorAll(".candidate-card").forEach(c => c.classList.remove("selected"));
  card.classList.add("selected");
  selectedCandidateId = candidateId;
  
  const candName = card.querySelector(".name").innerText;
  document.getElementById("selectedPreview").innerHTML = `✓ Selected: <strong>${candName}</strong>`;
  const castBtn = document.getElementById("castBtn");
  if (castBtn) {
    castBtn.classList.add("ready");
    castBtn.disabled = false;
  }
  
  // Add ripple effect
  const ripple = document.createElement("div");
  ripple.style.position = "absolute";
  ripple.style.borderRadius = "50%";
  ripple.style.background = "rgba(0, 255, 255, 0.5)";
  ripple.style.width = "20px";
  ripple.style.height = "20px";
  ripple.style.animation = "cardRipple 0.6s ease-out";
  card.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
}

async function castVote() {
  console.log("castVote clicked", { 
    currentElectionId, 
    selectedCandidateId, 
    isProcessing, 
    contractPresent: !!contract 
  });
  
  if (isProcessing) {
    showNotification("Vote already in progress...", "info");
    return;
  }
  if (currentElectionId == null) {
    showNotification("Pick an election first", "error");
    return;
  }
  if (selectedCandidateId == null) {
    showNotification("Select a candidate first", "error");
    return;
  }
  
  // 🔥 FIX: Ensure contract is available before proceeding
  if (!contract) {
    try {
      showNotification("Reconnecting to wallet...", "info");
      await connectWallet();
      contract = getContract();
      if (!contract) throw new Error("Contract still not available");
    } catch (err) {
      showNotification("Please click 'Connect MetaMask' and try again", "error");
      return;
    }
  }
  
  isProcessing = true;
  const btn = document.getElementById("castBtn");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "⏳ CASTING VOTE...";
  }
  showNotification("Casting vote...", "info");
  
  try {
    console.log("Calling contract.vote", { electionId: currentElectionId, candidateId: selectedCandidateId });
    const tx = await contract.vote(Number(currentElectionId), Number(selectedCandidateId));
    
    if (btn) btn.textContent = "⛓️ CONFIRMING ON BLOCKCHAIN...";
    const receipt = await tx.wait();
    console.log("Vote receipt:", receipt);
    
    document.getElementById("confirmTxHash").innerText = tx.hash.slice(0,18)+"...";
    document.getElementById("confirmBlock").innerText = "#" + receipt.blockNumber;
    document.getElementById("confirmElection").innerText = document.getElementById("votingElectionName").innerText.replace("⚙️ ", "");
    const voterAddr = await getCurrentAccount();
    document.getElementById("confirmVoter").innerText = voterAddr?.slice(0,10)+"...";
    document.getElementById("confirmTime").innerText = new Date().toISOString();
    
    showNotification("✓ Vote cast successfully!", "success");
    
    setTimeout(() => {
      showPage("confirm");
    }, 500);
  } catch (err) {
    console.error("Vote error details:", err);
    const btn = document.getElementById("castBtn");
    if (btn) {
      btn.textContent = "🗳️ CAST VOTE";
      btn.disabled = false;
    }
    // Try to extract a readable error message
    let errorMsg = "Unknown error";
    if (err?.data?.message) errorMsg = err.data.message;
    else if (err?.reason) errorMsg = err.reason;
    else if (err?.message) errorMsg = err.message;
    else if (typeof err === "string") errorMsg = err;
    
    if (errorMsg.includes("Voter is not authorized")) {
      showNotification("❌ Your wallet is not authorized for this election. Ask admin to authorize you.", "error");
    } else if (errorMsg.includes("already voted")) {
      showNotification("❌ You have already voted in this election", "error");
    } else if (errorMsg.includes("not active") || errorMsg.includes("Election has ended")) {
      showNotification("❌ This election is no longer active", "error");
    } else {
      showNotification("Failed to cast vote: " + errorMsg.slice(0, 100), "error");
    }
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = "🗳️ CAST VOTE";
    }
    isProcessing = false;
  }
}

function showPage(page) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(`page-${page}`).classList.add("active");
}

function logout() {
  document.getElementById("voterIdDisplay").style.display = "none";
  document.getElementById("logoutBtn").style.display = "none";
  document.getElementById("voterId").value = "";
  selectedCandidateId = null;
  currentElectionId = null;
  showPage("login");
  showNotification("👋 Logged out successfully", "success");
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
  } else if (type === "info") {
    notif.style.background = "rgba(0, 100, 255, 0.9)";
    notif.style.borderColor = "rgba(0, 130, 255, 0.5)";
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
