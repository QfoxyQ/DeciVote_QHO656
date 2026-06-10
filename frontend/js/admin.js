const connectBtn = document.getElementById("connectWalletBtn");
const walletAddress = document.getElementById("walletAddress");

async function connectWallet() {
  try {
    if (!window.ethereum) {
      alert("MetaMask is not installed. Please install MetaMask first.");
      return;
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const account = accounts[0];

    walletAddress.textContent =
      account.slice(0, 6) + "..." + account.slice(-4);

    connectBtn.textContent = "Wallet Connected";
    connectBtn.disabled = true;

    console.log("Connected wallet:", account);
  } catch (error) {
    console.error("Wallet connection failed:", error);
    alert("Wallet connection failed. Check MetaMask and try again.");
  }
}

connectBtn.addEventListener("click", connectWallet);
