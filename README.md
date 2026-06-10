# DeciVote

## Project Overview

DeciVote is a blockchain-based electronic voting prototype developed in a simulated local environment. The project explores how blockchain technology can support secure, transparent, and auditable vote submission without using real personal data or live election records.

The system demonstrates a complete voting workflow including election creation, candidate registration, voter wallet authorisation, vote casting, and on-chain result retrieval.

## Aim

The aim of this project is to design, implement, and evaluate a blockchain-based electronic voting prototype that demonstrates secure vote submission, wallet-based authorisation, one-vote-per-wallet enforcement, and immutable on-chain result recording.

## Technologies Used

- Solidity
- Hardhat
- Ganache
- MetaMask
- Ethers.js
- Node.js
- Express.js
- HTML / CSS / JavaScript

## Features

- Create elections
- Add candidates
- Authorise voters by wallet address
- Connect MetaMask wallet
- Cast votes on-chain
- Prevent double voting
- Retrieve election results
- Test in a local Ganache blockchain environment

## Project Structure

```text
DeciVote/
├── contracts/        # Solidity smart contracts
├── scripts/          # Deployment scripts
├── backend/          # Express backend and blockchain service
├── frontend/         # User/admin/results pages and frontend JS
├── test/             # Hardhat test files
├── hardhat.config.ts
├── package.json
└── README.md

## Prerequisites

Before running the project, make sure you have the following installed:

- Node.js
- npm
- Ganache
- MetaMask browser extension
- Visual Studio Code
- Live Server extension for VS Code

## Testing

Smart contract tests can be run using:

```bash
npx hardhat test

Security analysis tools such as Slither and Mythril can also be used to review the smart contract for potential vulnerabilities.


## Setup Instructions

1. Install dependencies
-npm install

2. Start Ganache
Open Ganache locally and keep it running.

!Suggested local settings:!

- RPC URL: http://127.0.0.1:7545
- Chain ID: 1337

3. Create a local .env file
Create a .env file in the project root:

PORT=3000
RPC_URL=http://127.0.0.1:7545
CONTRACT_ADDRESS=
ADMIN_PRIVATE_KEY=

Add the private key of a funded Ganache account into ADMIN_PRIVATE_KEY.

4. Deploy the smart contract
-npx hardhat run scripts/deploy.js --network ganache

After deployment, copy the deployed contract address.

5. Update the contract address
Paste the deployed address into:

.env as CONTRACT_ADDRESS
frontend/js/blockchain.js in the contractAddress variable

6. Start the backend
- node backend/server.js

7. Prepare blockchain data
Use Thunder Client or another API testing tool to:

-create an election
-add candidates
-authorise a voter wallet address


## Example create election request

POST

http://localhost:3000/api/elections

Body

{
  "name": "Student President Election",
  "startTime": 1713170000,
  "endTime": 1913179999
}


##Example add candidate request
POST
- http://localhost:3000/api/admin/candidate

Body
{
  "electionId": 1,
  "name": "John Downy",
  "party": "Student Future Party"
}


## Example authorise voter request
POST
- http://localhost:3000/api/admin/authorize-voter

Body
{
  "electionId": 1,
  "voterAddress": "0xYOUR_METAMASK_ADDRESS"
}


8. Open the frontend

Use Live Server in VS Code to open:
-frontend/user.html
-frontend/admin.html
-frontend/results.html


## Example Workflow
1.Deploy the smart contract to Ganache
2.Start the backend server
3.Create an election
4.Add candidates
5.Authorise a Ganache wallet address
6.Connect MetaMask on the user page
7.Cast a vote
8.Verify updated results from the backend endpoint


## Useful Endpoints
-Health check
http://localhost:3000/api/health
-Get candidates
http://localhost:3000/api/elections/1/candidates
-Get results
http://localhost:3000/api/elections/1/results


## Simulated Data Statement

This project uses simulated data only. Ganache-generated wallet accounts, fictitious candidate names, and dummy voter identifiers were used for testing and demonstration. No real personal data, human participants, or live election data were included in the artefact.


## Repository Access

-GitHub Repository: https://github.com/QfoxyQ/DeciVote_QHO656


##Author

Maria Tzvetanova Vladimirova - 10384918
Southampton Solent University
