import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@6.13.2/+esm";

export let provider = null;
export let signer = null;
export let contract = null;
export let currentAccount = null;

const contractAddress = "0x3400f961ABb30F79771190607c1887563C62302A";

async function loadAbi() {
  const response = await fetch("/contract-abi");

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Could not load contract ABI: ${text}`);
  }

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
