# DeciVote – Blockchain-Based Decentralised Voting System
A web-based blockchain voting prototype for creating elections, authorising voters, casting votes through MetaMask, and retrieving results on-chain.


## Table of Contents
- [Project Overview](#project-overview)
- [Purpose of the Application](#purpose-of-the-application)
- [Project Milestones](#project-milestones)
- [Technology Stack](#technology-stack)
- [Main Features](#main-features)
- [Authentication and Authorisation](#authentication-and-authorisation)
- [User Roles](#user-roles)
- [Election Management](#election-management)
- [Candidate Management](#candidate-management)
- [Voting Workflow](#voting-workflow)
- [Results and Verification](#results-and-verification)
- [Security](#security)
- [Environment Variables](#environment-variables)
- [Setup Instructions](#setup-instructions)
- [Example Create Election Request](#example-create-election-request)
- [Example Add Candidate Request](#example-add-candidate-request)
- [Example Authorise Voter Request](#example-authorise-voter-request)
- [Example Workflow](#example-workflow)
- [Useful Endpoints](#useful-endpoints)
- [Simulated Data Statement](#simulated-data-statement)
- [Repository Access](#repository-access)
- [Author](#author)


## Project Overview
DeciVote is a blockchain-based electronic voting prototype developed in a simulated local environment. The system was created to explore how blockchain technology can support secure, transparent, and auditable vote submission without using real personal data or live election records.

The project demonstrates a complete workflow including election creation, candidate registration, voter authorisation, MetaMask wallet connection, vote casting, and on-chain result retrieval.

This project was developed as part of a dissertation project at Southampton Solent University.


## Purpose of the Application
The purpose of DeciVote is to demonstrate how a decentralised voting system can reduce dependence on centralised vote management by moving core election logic into an Ethereum smart contract.

The application enables:

- secure wallet-based voter access
- election creation and management
- candidate registration
- voter authorisation by wallet address
- one-vote-per-wallet enforcement
- on-chain vote recording
- blockchain-based result retrieval
- transparent and auditable election data

The project follows a prototype-first approach and was developed in a simulated local blockchain environment using Ganache.


## Project Milestones
The project was structured around the main stages of a dissertation software artefact lifecycle.


### Stage 1 – Research and Planning
Focus areas:

- project proposal and problem definition
- research question and objectives
- background reading and literature survey
- identification of technical and security challenges
- project planning


### Stage 2 – Design and Proof of Concept
Focus areas:

- smart contract design
- local blockchain setup with Ganache
- initial backend integration
- early frontend structure
- MetaMask testing
- proof of concept voting flow


### Stage 3 – Final Prototype and Evaluation
Focus areas:

- working blockchain voting prototype
- completed backend and frontend integration
- testing and evaluation
- usability and security review
- final dissertation report and presentation preparation

The current version of the project represents the final prototype stage.


## Technology Stack
### Frontend
- HTML
- CSS
- JavaScript


### Blockchain
- Solidity
- Hardhat
- Ganache
- MetaMask
- Ethers.js


### Backend
- Node.js
- Express.js
- dotenv


### Security and Evaluation Tools
- Hardhat testing
- Slither
- Mythril


## Main Features
The prototype implements the core functionality required for a blockchain voting workflow:

- role-separated admin and voter functionality
- election creation
- candidate addition
- voter authorisation
- MetaMask wallet integration
- secure vote casting
- result retrieval
- double-voting prevention
- blockchain-backed auditability


## Authentication and Authorisation
The system uses Ethereum wallet-based interaction through MetaMask.

Implemented features:

- MetaMask wallet connection
- contract-owner admin actions
- voter authorisation by wallet address
- restricted voting for authorised voters only
- prevention of multiple votes from the same wallet in the same election


## User Roles
### Administrator
The administrator can:

- create elections
- add candidates
- authorise voters
- end elections
- retrieve election and candidate data
- manage contract-controlled election lifecycle actions


### Voter
The voter can:

- connect a MetaMask wallet
- view active elections
- view candidates
- cast a vote
- receive a vote confirmation receipt
- view results where available


## Election Management
The system supports election creation and lifecycle control.

Implemented features:

- create election with name, start time, and end time
- store elections on-chain
- track election status
- end elections through admin control


## Candidate Management
Candidates are stored per election in the smart contract.

Implemented features:

- add candidate to a selected election
- retrieve candidate list for display
- track candidate vote counts
- support batch-style candidate entry through the frontend workflow


## Voting Workflow
The voter workflow includes:

- connect MetaMask wallet
- select an active election
- view candidate list
- choose a candidate
- sign the transaction in MetaMask
- submit the vote to the blockchain
- receive transaction confirmation
- verify updated results

The system prevents unauthorised users from voting and blocks repeat voting attempts from the same authorised address.


## Results and Verification
The system supports result retrieval directly from the blockchain.

Implemented features:

- get election candidates
- get election results
- display vote counts
- verify vote outcome through backend endpoints
- observe transactions and blocks in Ganache

This provides a simple audit trail and demonstrates blockchain-based transparency.


## Security
The prototype includes several security-focused design choices.

Implemented security controls:

- admin-only contract functions for election management
- wallet-based voter authorisation
- one-vote-per-wallet enforcement
- immutable on-chain vote storage
- backend environment variable usage for sensitive configuration
- simulated local testing instead of real voter data

The project can also be analysed with:

- Slither
- Mythril


## Environment Variables
The project uses environment variables for local blockchain configuration.

Create a `.env` file in the project root with:

```env
PORT=3000
RPC_URL=http://127.0.0.1:7545
CONTRACT_ADDRESS=
ADMIN_PRIVATE_KEY=


#### Setup Instructions
1. Install dependencies
npm install

2. Start Ganache
Open Ganache locally and keep it running.


## Suggested local settings:
RPC URL: http://127.0.0.1:7545
Chain ID: 1337


## 3. Create a local .env file
#Create a .env file in the project root:

PORT=3000
RPC_URL=http://127.0.0.1:7545
CONTRACT_ADDRESS=
ADMIN_PRIVATE_KEY=

Add the private key of a funded Ganache account into ADMIN_PRIVATE_KEY.


## 4. Deploy the smart contract
npx hardhat run scripts/deploy.js --network ganache

After deployment, copy the deployed contract address.


## 5. Update the contract address

Paste the deployed address into:

.env as CONTRACT_ADDRESS
frontend/js/blockchain.js in the contractAddress variable


## 6. Start the backend
node backend/server.js


## 7. Prepare blockchain data
# Use Thunder Client or another API testing tool to:

create an election
add candidates
authorise a voter wallet address


## 8. Open the frontend
# Use Live Server in VS Code to open:

frontend/user.html
frontend/admin.html
frontend/results.html
Example Create Election Request

-POST
http://localhost:3000/api/elections

-Body
{
  "name": "Student President Election",
  "startTime": 1713170000,
  "endTime": 1913179999
}


## Example Add Candidate Request
-POST
http://localhost:3000/api/admin/candidate

-Body
{
  "electionId": 1,
  "name": "John Downy",
  "party": "Student Future Party"
}


## Example Authorise Voter Request
-POST

http://localhost:3000/api/admin/authorize-voter

-Body
{
  "electionId": 1,
  "voterAddress": "0xYOUR_METAMASK_ADDRESS"
}


## Example Workflow
1.  Deploy the smart contract to Ganache
2.  Start the backend server
3.  Create an election
4.  Add candidates
5.  Authorise a Ganache wallet address
6.  Connect MetaMask on the user page
7.  Cast a vote
8.  Verify updated results from the backend endpoint


### Useful Endpoints
-Health Check
http://localhost:3000/api/health

-Get Candidates
http://localhost:3000/api/elections/1/candidates

-Get Results
http://localhost:3000/api/elections/1/results


### Simulated Data Statement
This project uses simulated data only. Ganache-generated wallet accounts, fictitious candidate names, and dummy voter identifiers were used for testing and demonstration. No real personal data, human participants, or live election data were included in the artefact.


#### Repository Access
GitHub Repository: https://github.com/QfoxyQ/DeciVote_QHO656


## Author

Maria Tzvetanova Vladimirova
Student ID: 10384918
Southampton Solent University
