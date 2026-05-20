import { ethers } from "ethers";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const rpcUrl = process.env.RPC_URL;
const contractAddress = process.env.CONTRACT_ADDRESS;
const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY;

const provider = new ethers.JsonRpcProvider(rpcUrl);
const wallet = new ethers.Wallet(adminPrivateKey, provider);

const artifactPath = path.resolve(
  "artifacts/contracts/DeciVote.sol/DeciVote.json"
);

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

export async function getVoteCastEvents() {
  const filter = contract.filters.VoteCast();
  return await contract.queryFilter(filter, 0, "latest");
}

export { contract, provider };
