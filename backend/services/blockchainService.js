import { ethers } from "ethers";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const rpcUrl = process.env.RPC_URL || "http://127.0.0.1:8545";
let contractAddress = process.env.CONTRACT_ADDRESS;
const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY;

const projectRoot = process.cwd();
if (!contractAddress) {
  const addressPath = path.resolve(projectRoot, "contract-address.json");
  if (fs.existsSync(addressPath)) {
    const data = JSON.parse(fs.readFileSync(addressPath, "utf8"));
    contractAddress = data?.address?.trim();
  }
}

if (!contractAddress) {
  throw new Error("Contract address not found. Set CONTRACT_ADDRESS or create contract-address.json in the project root.");
}
if (!adminPrivateKey) {
  throw new Error("ADMIN_PRIVATE_KEY is not set in .env");
}

const provider = new ethers.JsonRpcProvider(rpcUrl);
const wallet = new ethers.Wallet(adminPrivateKey, provider);

const artifactPath = path.resolve(projectRoot, "artifacts/contracts/DeciVote.sol/DeciVote.json");

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

export async function authorizeVoter(electionId, voterAddress) {
  const tx = await contract.authorizeVoter(electionId, voterAddress);
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

export async function isAuthorizedVoter(electionId, voterAddress) {
  return await contract.isAuthorizedVoter(electionId, voterAddress);
}

export async function hasAddressVoted(electionId, voterAddress) {
  return await contract.hasAddressVoted(electionId, voterAddress);
}

export async function endElection(electionId) {
  const tx = await contract.endElection(electionId);
  return await tx.wait();
}

export async function deleteCandidate(electionId, candidateId) {
  const tx = await contract.deleteCandidate(electionId, candidateId);
  return await tx.wait();
}

export async function updateCandidate(electionId, candidateId, name, party) {
  const tx = await contract.updateCandidate(electionId, candidateId, name, party);
  return await tx.wait();
}

export async function vote(electionId, candidateId) {
  const tx = await contract.vote(electionId, candidateId);
  return await tx.wait();
}

export async function authorizeVoterBatch(electionId, voterAddresses) {
  const promises = voterAddresses.map(voterAddress => 
    authorizeVoter(electionId, voterAddress)
  );
  return await Promise.all(promises);
}

export async function getElectionCount() {
  return await contract.electionCount();
}

export { contract, provider };
