import { connectWalletToBlockchain, contract } from "./blockchain.js";

window.walletConnect = async function () {
  try {
    const account = await connectWalletToBlockchain();

    document.getElementById("voterId").value = account;
    document.getElementById("voterIdDisplay").textContent = account.slice(0, 10) + "...";
    document.getElementById("voterIdDisplay").style.display = "flex";
    document.getElementById("logoutBtn").style.display = "block";
    document.getElementById("dashVoterId").textContent = account + " · Verified Wallet";

    showPage("page-dashboard");
    alert("MetaMask connected successfully");
  } catch (error) {
    console.error(error);
    alert(error.shortMessage || error.message);
  }
};

window.castVote = async function () {
  const overlay = document.getElementById("processingOverlay");

  try {
    if (!contract) {
      alert("Connect MetaMask first");
      return;
    }

    const selectedCard = document.querySelector(".vote-candidate-card.selected");

    if (!selectedCard) {
      alert("Select a candidate first");
      return;
    }

    const candidateId = Number(selectedCard.dataset.candidateId);
    const electionId = 1;

    overlay.classList.add("show");

    const tx = await contract.vote(electionId, candidateId);
    const receipt = await tx.wait();

    overlay.classList.remove("show");

    const electionName = document.getElementById("votingElectionName")?.textContent || "General Election 2026";

    document.getElementById("confirmTxHash").textContent = receipt.hash;
    document.getElementById("confirmBlock").textContent = "#" + receipt.blockNumber;
    document.getElementById("confirmElection").textContent = electionName;
    document.getElementById("confirmTime").textContent =
      new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC";
    document.getElementById("confirmVoter").textContent =
      document.getElementById("voterIdDisplay").textContent;

    document.getElementById("receiptRow").style.display = "table-row";
    document.getElementById("receiptTxHash").textContent = receipt.hash.slice(0, 20) + "...";
    document.getElementById("receiptBlock").textContent = "#" + receipt.blockNumber;

    showPage("page-confirm");
  } catch (error) {
    console.error(error);
    overlay?.classList.remove("show");
    alert(error.shortMessage || error.message);
  }
};
