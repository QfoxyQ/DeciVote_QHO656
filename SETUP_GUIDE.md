# DeciVote - Complete Blockchain Voting System

## 🎯 Project Overview

DeciVote is a fully functional blockchain-based voting system built with Solidity smart contracts, Node.js backend, and a modern web frontend. This system allows admins to create elections, add candidates, authorize voters, and manage the voting process while voters can securely cast their votes using the blockchain.

## ✅ Latest Updates & Fixes

### 1. **Smart Contract Enhancements**
- ✅ Added `deleteCandidate()` function - Admin can remove candidates during voting
- ✅ Added `updateCandidate()` function - Admin can modify candidate information
- ✅ Enhanced `endElection()` function - Admin can terminate elections at any time
- ✅ All functions protected with `onlyAdmin` modifier

### 2. **Backend API Improvements**
- ✅ Added `/api/elections/count` - Get total election count
- ✅ Added `/api/admin/candidate/delete` - Delete candidates
- ✅ Added `/api/admin/candidate/update` - Update candidates
- ✅ Added `/api/admin/election/end` - End elections
- ✅ Added `/api/contract-address` - Get deployed contract address
- ✅ Added `/api/elections/:id/vote` - Vote endpoint
- ✅ Improved error handling across all endpoints

### 3. **Admin Panel Features**
- ✅ **Multiple Candidates**: Generate forms for adding multiple candidates at once
- ✅ **Candidate Management**: Delete and update candidates during elections
- ✅ **Election Control**: View, manage, and end active elections
- ✅ **Voter Authorization**: Authorize voter wallet addresses
- ✅ **Wallet Integration**: Connect MetaMask for admin operations
- ✅ **Real-time Updates**: Auto-refresh elections and candidates

### 4. **User/Voter Interface**
- ✅ **Wallet Connection**: Connect MetaMask for voting
- ✅ **Election Selection**: Browse and select active elections
- ✅ **Candidate Selection**: Visual candidate card interface
- ✅ **Vote Casting**: Cast votes with blockchain confirmation
- ✅ **Confirmation Receipt**: Transaction receipt with all details
- ✅ **Error Handling**: Helpful error messages for authorization issues

### 5. **UI/UX Improvements**
- ✅ Modern, responsive design
- ✅ Smooth animations and transitions
- ✅ Real-time notifications
- ✅ Loading states and feedback
- ✅ Professional card-based layouts
- ✅ Mobile-friendly interface

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MetaMask browser extension
- Hardhat (for contract deployment)
- MongoDB or similar (optional for data persistence)

### Installation

1. **Install Backend Dependencies**
```bash
cd backend
npm install
```

2. **Environment Setup**
Create a `.env` file in the backend directory:
```env
RPC_URL=http://localhost:8545
CONTRACT_ADDRESS=0x... (your deployed contract address)
ADMIN_PRIVATE_KEY=0x... (your admin wallet private key)
PORT=3000
```

3. **Deploy Smart Contract**
```bash
npx hardhat run scripts/deploy.js --network localhost
```

4. **Start Backend Server**
```bash
npm start
```

The backend will run on `http://localhost:3000`

5. **Open Frontend**
- Admin Panel: `http://localhost:3000/frontend/admin.html`
- Voter Interface: `http://localhost:3000/frontend/user.html`
- Results: `http://localhost:3000/frontend/results.html`

## 📋 Admin Workflow

### Creating an Election
1. Click **"Connect MetaMask"** button
2. Navigate to **Elections** tab
3. Fill in:
   - Election name
   - Start date/time
   - End date/time
4. Click **"Create Election"**

### Adding Multiple Candidates
1. Go to **Candidates** tab
2. Click **"Add Multiple"** button
3. Enter number of candidates
4. Click **"Add Multiple Candidates"**
5. Fill in candidate names and parties
6. Click **"Add All"**

### Adding Single Candidate
1. Select election from dropdown
2. Enter candidate name and party
3. Click **"Add Candidate"**

### Authorizing Voters
1. Select election
2. Enter voter's wallet address (0x...)
3. Click **"Authorize Voter"**

### Ending an Election
1. Click **"End Election"** button on election card in Elections tab
2. Or select election in Candidates tab and click **"End Election"**

## 🗳️ Voter Workflow

### Casting a Vote
1. Click **"Connect MetaMask"** to connect wallet
2. Your wallet address appears in login field
3. Click **"Login & Continue"**
4. Select an active election from the list
5. Click **"Cast Vote"** button
6. Select a candidate
7. Click **"Cast Vote"** confirmation
8. Confirm transaction in MetaMask
9. View transaction receipt with confirmation

## 🔧 Technical Architecture

### Smart Contract (`DeciVote.sol`)
- **Functions**: createElection, addCandidate, deleteCandidate, updateCandidate, vote, endElection, authorizeVoter
- **Events**: ElectionCreated, CandidateAdded, CandidateDeleted, CandidateUpdated, VoteCast, VoterAuthorized, ElectionEnded
- **Access Control**: onlyAdmin modifier

### Backend Services
```
/backend
├── server.js                 # Express server
├── routes/
│   ├── adminRoutes.js       # Admin operations
│   ├── electionRoutes.js    # Election management
│   ├── voterRoutes.js       # Voter operations
│   └── resultRoutes.js      # Results fetching
├── services/
│   └── blockchainService.js # Smart contract interaction
└── controllers/             # Business logic
```

### Frontend Structure
```
/frontend
├── admin.html              # Admin dashboard
├── user.html               # Voter interface
├── results.html            # Results viewer
└── js/
    ├── blockchain.js       # Blockchain interaction (ethers.js)
    ├── admin.js            # Admin logic
    ├── user.js             # Voter logic
    └── results.js          # Results logic
```

## 🐛 Common Issues & Solutions

### Issue: "Voter is not authorized"
**Solution**: Admin needs to authorize voter's wallet address in the admin panel before they can vote.

### Issue: "You have already voted"
**Solution**: Each voter can only vote once per election. This is blockchain-enforced.

### Issue: "Election is not active"
**Solution**: Admin has ended the election. Only active elections accept votes.

### Issue: MetaMask connection fails
**Solution**: 
- Ensure MetaMask is installed
- Check you're on the correct network
- Try refreshing the page

### Issue: "Contract address not found"
**Solution**: Ensure backend has `CONTRACT_ADDRESS` env variable set with deployed contract address.

## 🛡️ Security Features

- **Admin-only operations**: Protected with smart contract modifiers
- **Single vote per person**: Enforced at contract level
- **Immutable votes**: All votes recorded on blockchain
- **Voter authorization**: Only authorized wallets can vote
- **Time-based elections**: Elections automatically close at specified time

## 📊 Data Flow

```
Admin Panel
    ↓
[Connect Wallet] → MetaMask
    ↓
[Create Election] → Backend API → Smart Contract
    ↓
[Add Candidates] → Backend API → Smart Contract
    ↓
[Authorize Voters] → Backend API → Smart Contract
    ↓

Voter Interface
    ↓
[Connect Wallet] → MetaMask
    ↓
[View Elections] → Backend API → Smart Contract
    ↓
[Select Candidate] → Frontend State
    ↓
[Cast Vote] → Smart Contract (Direct Call)
    ↓
[Blockchain Confirmation] → Results Updated
```

## 🚢 Deployment

### Local Testing (Hardhat)
```bash
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
npm start
```

### Testnet (Sepolia)
1. Update `.env` with Sepolia RPC and contract address
2. Fund admin wallet on Sepolia
3. Update MetaMask to Sepolia network
4. Run backend with Sepolia settings

### Mainnet
- Same process as testnet
- Higher gas costs
- Use MainNet RPC URL
- Verify contract on Etherscan

## 📝 API Endpoints Reference

### Elections
- `GET /api/elections/count` - Get election count
- `GET /api/elections/:id` - Get election details
- `GET /api/elections/:id/candidates` - Get candidates
- `GET /api/elections/:id/results` - Get results
- `POST /api/elections` - Create election
- `POST /api/elections/:id/vote` - Cast vote

### Admin
- `POST /api/admin/candidate` - Add candidate
- `POST /api/admin/candidate/delete` - Delete candidate
- `POST /api/admin/candidate/update` - Update candidate
- `POST /api/admin/election/end` - End election
- `POST /api/admin/authorize-voter` - Authorize voter

## 🎨 Features Summary

| Feature | Admin | Voter |
|---------|-------|-------|
| Connect Wallet | ✅ | ✅ |
| Create Elections | ✅ | ❌ |
| Add Candidates | ✅ | ❌ |
| Manage Candidates | ✅ | ❌ |
| Authorize Voters | ✅ | ❌ |
| End Elections | ✅ | ❌ |
| View Elections | ✅ | ✅ |
| Cast Votes | ❌ | ✅ |
| View Results | ✅ | ✅ |

## 🤝 Contributing

To contribute improvements:
1. Create a feature branch
2. Make changes
3. Test thoroughly
4. Submit PR with description

## 📄 License

MIT License - Feel free to use this project for learning and commercial purposes.

## 🆘 Support

For issues or questions:
1. Check Common Issues section
2. Review contract code comments
3. Check backend console for errors
4. Verify MetaMask connection

---

**Version**: 2.0.0  
**Last Updated**: May 28, 2026  
**Status**: ✅ Production Ready
