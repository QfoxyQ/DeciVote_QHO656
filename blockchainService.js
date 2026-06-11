import { ethers } from "ethers";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rpcUrl = process.env.RPC_URL;
const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY;

let contractAddress;
try {
  const addrFile = fs.readFileSync(path.join(__dirname, "contract-address.json"), "utf8");
  contractAddress = JSON.parse(addrFile).address;
} catch (err) {
  console.error("❌ contract-address.json not found. Run deployment first.");
  process.exit(1);
}

const provider = new ethers.JsonRpcProvider(rpcUrl);
const wallet = new ethers.Wallet(adminPrivateKey, provider);

const artifactPath = path.resolve(__dirname, "artifacts/contracts/DeciVote.sol/DeciVote.json");
if (!fs.existsSync(artifactPath)) {
  console.error("❌ ABI file not found. Run 'npx hardhat compile' first.");
  process.exit(1);
}
const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
const abi = artifact.abi;

const contract = new ethers.Contract(contractAddress, abi, wallet);

export async function createElection(name, startTime, endTime) {
  const tx = await contract.createElection(name, startTime, endTime);
  return await tx.wait();
}

export async function addCandidate(electionId, name, party) {
  const tx = await contract.addCandidate(electionId, name, party);
  return await tx.wait();
}

export async function endElection(electionId) {
  const tx = await contract.endElection(electionId);
  return await tx.wait();
}

export async function getElection(electionId) {
  return await contract.getElection(electionId);
}

export async function getCandidates(electionId) {
  return await contract.getCandidates(electionId);
}

export async function getResults(electionId) {
  return await contract.getResults(electionId);
}

export async function getElectionCount() {
  return await contract.electionCount();
}

export { contract, provider };