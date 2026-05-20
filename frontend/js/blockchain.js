import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@6.13.2/+esm";

export let provider = null;
export let signer = null;
export let contract = null;
export let currentAccount = null;

const contractAddress = "0x6BA00e3341d44723B0858653d42AAea315BCa632";

async function loadAbi() {
  const response = await fetch("/artifacts/contracts/DeciVote.sol/DeciVote.json");
  const artifact = await response.json();
  return artifact.abi;
}

export async function connectWalletToBlockchain() {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  await window.ethereum.request({ method: "eth_requestAccounts" });

  provider = new ethers.BrowserProvider(window.ethereum);
  signer = await provider.getSigner();
  currentAccount = await signer.getAddress();

  const abi = await loadAbi();
  contract = new ethers.Contract(contractAddress, abi, signer);

  return currentAccount;
}
