# DeciVote
## Project Overview

DeciVote is a blockchain-based electronic voting prototype developed in a simulated local environment. The project was designed to explore how distributed ledger technology can support secure, transparent, and auditable vote submission without using real personal or live election data. The prototype demonstrates a full voting workflow including election creation, candidate registration, voter wallet authorisation, vote casting, and on-chain result retrieval.

The system was built using Solidity smart contracts deployed through Hardhat onto a local Ganache blockchain. MetaMask was used for wallet-based interaction, while Ethers.js and Express.js were used to connect the frontend and backend to the blockchain. The interface was developed using HTML, CSS, and JavaScript.

This project was implemented and tested using simulated data only. Ganache-generated wallet accounts, fictitious candidate names, and dummy voter identifiers were used throughout development and evaluation. No human participants or real election records were involved.

## Aim

The aim of this project is to design and evaluate a blockchain-based electronic voting prototype that demonstrates secure vote submission, wallet-based authorisation, one-vote-per-wallet enforcement, and immutable on-chain result recording within a simulated environment.

## Objectives

The objectives of this project are:

- to develop a Solidity smart contract that supports election creation, candidate registration, voter authorisation, vote casting, and result retrieval
- to build a backend service using Express.js and Ethers.js to interact with the deployed smart contract
- to create a frontend interface that allows a user to connect MetaMask, select a candidate, cast a vote, and view confirmation details
- to enforce one-vote-per-wallet logic and restrict voting to authorised wallet addresses
- to test the prototype using a local Ganache blockchain and simulated data only
- to evaluate key cybersecurity properties such as integrity, immutability, auditability, and resistance to double voting

## Technologies Used

- Solidity
- Hardhat
- Ganache
- MetaMask
- Ethers.js
- Node.js
- Express.js
- HTML / CSS / JavaScript

## Project Structure

```text
DeciVote/
├── contracts/        # Solidity smart contracts
├── scripts/          # Deployment scripts
├── backend/          # Express backend and API routes
├── frontend/         # User/admin/results pages and frontend JS
├── test/             # Hardhat test files
├── hardhat.config.ts # Hardhat configuration
├── package.json
└── README.md