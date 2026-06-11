import { connectWallet, getContract, getCurrentAccount } from "./blockchain.js";

let contract = null;
let hideEnded = false;

document.addEventListener("DOMContentLoaded", () => {
  // Auto-fill datetimes
  const now = new Date();
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
  const formatDateTime = (date) => date.toISOString().slice(0, 16);
  document.getElementById("startTime").value = formatDateTime(now);
  document.getElementById("endTime").value = formatDateTime(oneHourLater);

  document.getElementById("connectWalletBtn").addEventListener("click", onConnectWallet);
  document.getElementById("generateCandidateFormBtn").addEventListener("click", generateCandidateForm);
  document.getElementById("submitAllCandidatesBtn").addEventListener("click", submitAllCandidates);
  document.getElementById("addSingleCandidateBtn").addEventListener("click", onAddCandidate);
  document.getElementById("endElectionBtn").addEventListener("click", onEndElection);
  document.getElementById("authorizeVoterBtn").addEventListener("click", onAuthorizeVoter);

  // Add "Hide Ended" checkbox
  const hideCheckbox = document.createElement("label");
  hideCheckbox.style.cssText = "display: block; margin: 12px 0; color: #00aeff; cursor: pointer;";
  hideCheckbox.innerHTML = '<input type="checkbox" id="hideEndedCheckbox" style="margin-right: 8px;"> Hide ended elections';
  document.getElementById("electionsList").before(hideCheckbox);
  document.getElementById("hideEndedCheckbox").addEventListener("change", (e) => {
    hideEnded = e.target.checked;
    loadElections();
  });

  // Notification styles
  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideIn { from { transform: translateX(400px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(400px); opacity: 0; } }
  `;
  document.head.appendChild(style);

  setTimeout(loadElections, 500);
});

async function onConnectWallet() {
  try {
    const btn = document.getElementById("connectWalletBtn");
    btn.disabled = true;
    btn.textContent = "⏳ CONNECTING...";
    await connectWallet();
    contract = getContract();
    const adminAddress = await getCurrentAccount();
    document.getElementById("adminStatus").innerHTML = `✅ Admin: ${adminAddress.slice(0,6)}...${adminAddress.slice(-4)}`;
    btn.textContent = "🦊 CONNECT METAMASK";
    btn.disabled = false;
    showNotification(`Connected as Admin: ${adminAddress.slice(0,6)}...${adminAddress.slice(-4)}`, "success");
    await loadElections();
  } catch (err) {
    showNotification("Connection failed: " + err.message, "error");
    document.getElementById("connectWalletBtn").textContent = "🦊 CONNECT METAMASK";
    document.getElementById("connectWalletBtn").disabled = false;
  }
}

async function loadElections() {
  const container = document.getElementById("electionsList");
  container.innerHTML = "<div style='text-align: center; padding: 20px; color: #00aeff;'>⏳ Loading elections...</div>";
  try {
    const countRes = await fetch("/api/elections/count");
    const { count } = await countRes.json();
    container.innerHTML = "";
    updateElectionSelects();
    if (count === 0) {
      container.innerHTML = "<div style='text-align: center; padding: 20px; color: #00aeff;'>📭 No elections created yet</div>";
      return;
    }
    const cards = [];
    for (let i = 1; i <= count; i++) {
      const res = await fetch(`/api/elections/${i}`);
      const { election } = await res.json();
      const [id, name, start, end, active] = election;
      // Skip ended elections if hideEnded is true
      if (hideEnded && !active) continue;
      const div = document.createElement("div");
      div.className = "election-card";
      div.innerHTML = `
        <h3>📋 ${name}</h3>
        <p>🕐 Start: ${new Date(start*1000).toLocaleString()}</p>
        <p>🕐 End: ${new Date(end*1000).toLocaleString()}</p>
        <p class="status-badge">${active ? "● ACTIVE" : "⏹️ ENDED"}</p>
        ${active ? `<button class="end-election" data-id="${id}" style="margin-top: 12px; width: 100%;">⏹️ END ELECTION</button>` : ""}
      `;
      if (active) {
        div.querySelector(".end-election").addEventListener("click", () => endElectionById(id));
      }
      cards.push(div);
    }
    cards.forEach((card, idx) => setTimeout(() => container.appendChild(card), idx * 100));
  } catch (err) {
    container.innerHTML = "<div style='color: #ff4444;'>❌ Error loading elections</div>";
    console.error(err);
  }
}

async function updateElectionSelects() {
  try {
    const countRes = await fetch("/api/elections/count");
    const { count } = await countRes.json();
    const selects = ["selectElectionForCandidate", "selectElectionForVoter", "selectElectionToEnd"];
    selects.forEach(selectId => {
      const select = document.getElementById(selectId);
      if (select) {
        const currentValue = select.value;
        select.innerHTML = '<option value="">-- Select Election --</option>';
        for (let i = 1; i <= count; i++) {
          fetch(`/api/elections/${i}`)
            .then(r => r.json())
            .then(data => {
              if (data.election) {
                const [id, name] = data.election;
                const option = document.createElement("option");
                option.value = id;
                option.textContent = name;
                select.appendChild(option);
              }
            });
        }
        select.value = currentValue;
      }
    });
  } catch (err) {
    console.error("Error updating selects:", err);
  }
}

function generateCandidateForm() {
  const count = parseInt(document.getElementById("candidateCount").value) || 1;
  const container = document.getElementById("candidatesInputs");
  const formDiv = document.getElementById("candidateFormContainer");
  if (count < 1 || count > 50) {
    showNotification("Enter between 1 and 50 candidates", "error");
    return;
  }
  container.innerHTML = "";
  for (let i = 1; i <= count; i++) {
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.placeholder = `Candidate ${i} Name`;
    nameInput.className = "candidate-name-input";
    nameInput.style.marginBottom = "8px";
    const partyInput = document.createElement("input");
    partyInput.type = "text";
    partyInput.placeholder = `Candidate ${i} Party`;
    partyInput.className = "candidate-party-input";
    partyInput.style.marginBottom = "12px";
    container.appendChild(nameInput);
    container.appendChild(partyInput);
  }
  formDiv.style.display = "block";
  showNotification(`Form prepared for ${count} candidates`, "success");
}

async function submitAllCandidates() {
  const name = document.getElementById("electionName").value.trim();
  let startInput = document.getElementById("startTime").value;
  let endInput = document.getElementById("endTime").value;

  if (!name) { showNotification("❌ Election name is missing", "error"); return; }
  if (!startInput) { showNotification("❌ Start time is missing", "error"); return; }
  if (!endInput) { showNotification("❌ End time is missing", "error"); return; }

  const start = Math.floor(new Date(startInput).getTime() / 1000);
  const end = Math.floor(new Date(endInput).getTime() / 1000);
  if (start >= end) { showNotification("End time must be after start time", "error"); return; }

  const nameInputs = document.querySelectorAll(".candidate-name-input");
  if (nameInputs.length === 0) {
    showNotification("Please click 'PREPARE CANDIDATES FORM' first", "error");
    return;
  }

  const candidates = [];
  nameInputs.forEach((input, idx) => {
    const candName = input.value.trim();
    const candParty = document.querySelectorAll(".candidate-party-input")[idx]?.value.trim() || "";
    if (candName) candidates.push({ name: candName, party: candParty });
  });
  if (candidates.length === 0) { showNotification("Enter at least one candidate name", "error"); return; }

  const btn = document.getElementById("submitAllCandidatesBtn");
  btn.disabled = true;
  btn.textContent = "⏳ CREATING ELECTION...";

  try {
    const electionRes = await fetch("/api/elections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, startTime: start, endTime: end })
    });
    const electionData = await electionRes.json();
    if (!electionData.success) throw new Error(electionData.error);

    const countRes = await fetch("/api/elections/count");
    const { count } = await countRes.json();
    const newElectionId = count;

    let added = 0;
    for (const candidate of candidates) {
      try {
        const candRes = await fetch("/api/admin/candidate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ electionId: newElectionId, name: candidate.name, party: candidate.party })
        });
        const candData = await candRes.json();
        if (candData.success) added++;
      } catch (err) { console.error(err); }
    }
    showNotification(`✓ Election created with ${added}/${candidates.length} candidates!`, "success");

    // Reset form
    document.getElementById("electionName").value = "";
    document.getElementById("candidateCount").value = "1";
    document.getElementById("candidateFormContainer").style.display = "none";
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    document.getElementById("startTime").value = now.toISOString().slice(0, 16);
    document.getElementById("endTime").value = oneHourLater.toISOString().slice(0, 16);

    await loadElections();
  } catch (err) {
    showNotification("Failed: " + err.message, "error");
  } finally {
    btn.disabled = false;
    btn.textContent = "✓ CREATE ELECTION & ADD CANDIDATES";
  }
}

async function onAddCandidate() {
  const electionId = parseInt(document.getElementById("selectElectionForCandidate").value);
  const name = document.getElementById("addCandName").value.trim();
  const party = document.getElementById("addCandParty").value.trim();
  if (!electionId || !name) { showNotification("Select election and enter candidate name", "error"); return; }
  const btn = document.getElementById("addSingleCandidateBtn");
  btn.disabled = true;
  btn.textContent = "⏳ ADDING...";
  try {
    const res = await fetch("/api/admin/candidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ electionId, name, party })
    });
    const data = await res.json();
    if (data.success) {
      showNotification("✓ Candidate added!", "success");
      document.getElementById("addCandName").value = "";
      document.getElementById("addCandParty").value = "";
    } else {
      showNotification("Error: " + data.error, "error");
    }
  } catch (err) {
    showNotification("Add candidate failed: " + err.message, "error");
  } finally {
    btn.disabled = false;
    btn.textContent = "➕ ADD CANDIDATE";
  }
}

async function onEndElection() {
  const electionId = parseInt(document.getElementById("selectElectionToEnd").value);
  if (!electionId) { showNotification("Select an election to end", "error"); return; }
  await endElectionById(electionId);
}

async function endElectionById(id) {
  const btn = document.querySelector(`[data-id="${id}"]`) || document.getElementById("endElectionBtn");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "⏳ ENDING...";
  }
  showNotification(`Ending election ${id}... confirm in MetaMask`, "info");
  try {
    const res = await fetch("/api/admin/election/end", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ electionId: id })
    });
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch(e) { data = { success: false, error: text || res.statusText }; }
    if (!res.ok || !data.success) {
      throw new Error(data.error || res.statusText);
    }
    showNotification(`✓ Election ${id} ended successfully!`, "success");
    await loadElections(); // Refresh list
  } catch (err) {
    console.error("End election error:", err);
    showNotification("Failed to end election: " + err.message, "error");
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = "⏹️ END ELECTION";
    }
  }
}

async function onAuthorizeVoter() {
  const electionId = parseInt(document.getElementById("selectElectionForVoter").value);
  const voterAddress = document.getElementById("voterAddress").value.trim();
  if (!electionId || !voterAddress) { showNotification("Select election and enter voter address", "error"); return; }
  if (!voterAddress.match(/^0x[a-fA-F0-9]{40}$/)) { showNotification("Invalid wallet address format", "error"); return; }
  const btn = document.getElementById("authorizeVoterBtn");
  btn.disabled = true;
  btn.textContent = "⏳ AUTHORIZING...";
  try {
    const res = await fetch("/api/admin/authorize-voter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ electionId, voterAddress })
    });
    const data = await res.json();
    if (data.success) {
      showNotification("✓ Voter authorized!", "success");
      document.getElementById("voterAddress").value = "";
    } else {
      showNotification("Error: " + data.error, "error");
    }
  } catch (err) {
    showNotification("Authorization failed: " + err.message, "error");
  } finally {
    btn.disabled = false;
    btn.textContent = "✓ AUTHORIZE VOTER";
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
}