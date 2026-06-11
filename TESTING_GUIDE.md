# DeciVote Quick Start & Testing Guide

## ⚡ Quick Start (5 minutes)

### Prerequisites Checklist
- [ ] Node.js installed
- [ ] MetaMask browser extension installed
- [ ] Hardhat configured
- [ ] Local blockchain running (or testnet RPC URL)
- [ ] Backend `.env` configured

### Step-by-Step

1. **Start Backend**
```bash
cd backend
npm install
npm start
```
Backend runs on `http://localhost:3000`

2. **Open Admin Panel**
```
http://localhost:3000/frontend/admin.html
```

3. **Connect Wallet**
- Click "Connect MetaMask"
- Approve connection request
- See wallet address displayed

4. **Create Election**
- Go to Elections tab
- Enter election name
- Set start/end times (start: now, end: 1 hour from now)
- Click "Create Election"

5. **Add Candidates**
- Go to Candidates tab
- Select the election you just created
- Click "Add Multiple"
- Enter 3-5 candidate names and parties
- Click "Add All"

6. **Authorize Voters** (if needed)
- Go back to admin panel
- Select election in voter authorization section
- Enter voter wallet address (0x...)
- Click "Authorize Voter"

7. **Test Voting**
- Open new window/tab: `http://localhost:3000/frontend/user.html`
- Click "Connect MetaMask"
- Enter your voter wallet address
- Click "Login & Continue"
- Select the election
- Choose a candidate
- Click "Cast Vote"
- Approve transaction in MetaMask
- See confirmation receipt

## 🧪 Testing Scenarios

### Scenario 1: Basic Voting Flow ✓
**Objective**: Complete single vote from creation to confirmation

**Steps**:
1. Admin creates election
2. Admin adds 2 candidates  
3. Admin authorizes voter
4. Voter connects wallet
5. Voter selects candidate
6. Voter casts vote
7. Vote confirmed on blockchain

**Expected Result**: ✅ Vote recorded in results

---

### Scenario 2: Multiple Candidates Batch Add ✓
**Objective**: Add 5 candidates at once

**Steps**:
1. Admin creates election
2. Go to Candidates tab
3. Click "Add Multiple"
4. Enter number: 5
5. Click "Prepare Form"
6. Fill in 5 candidate names (e.g., Alice, Bob, Charlie, Diana, Eve)
7. Fill in 5 party names (Party A, B, C, D, E)
8. Click "Add All"

**Expected Result**: ✅ All 5 candidates added in single batch

---

### Scenario 3: Election Management ✓
**Objective**: Demonstrate admin control during voting

**Steps**:
1. Admin creates election  
2. Admin adds 3 candidates
3. Admin authorizes 2 voters
4. First voter casts vote
5. Admin clicks "End Election"
6. Second voter tries to vote
7. User sees error: "Election is not active"

**Expected Result**: ✅ Election properly ended, no more votes accepted

---

### Scenario 4: Authorization Requirement ✓
**Objective**: Verify only authorized voters can vote

**Steps**:
1. Admin creates election
2. Admin adds candidates
3. Admin DOES NOT authorize a voter
4. Unauthorized voter tries to vote
5. User sees error: "Voter is not authorized"

**Expected Result**: ✅ Vote rejected with helpful error message

---

### Scenario 5: Single Vote Per Person ✓
**Objective**: Prevent double voting

**Steps**:
1. Admin creates election
2. Admin adds candidates
3. Admin authorizes voter
4. Voter votes
5. Voter disconnects/reconnects wallet
6. Voter tries to vote again

**Expected Result**: ✅ Error shown: "Voter has already voted"

---

### Scenario 6: Real-time Results ✓
**Objective**: View results while voting happens

**Steps**:
1. Admin creates election with 3 candidates
2. Admin authorizes 3 voters
3. Open Results page: `http://localhost:3000/frontend/results.html`
4. See election with 0 votes for each candidate
5. Have voters cast votes one by one
6. Watch results update in real-time
7. See vote counts increase

**Expected Result**: ✅ Results update immediately after each vote

---

### Scenario 7: Candidate Management ✓
**Objective**: Add and remove candidates during voting

**Steps**:
1. Admin creates election with 2 candidates
2. Admin notices a typo in candidate name
3. Admin deletes one candidate
4. Admin adds a replacement candidate
5. Voters now see only correct candidates

**Expected Result**: ✅ Candidate list updated, old candidate removed

---

## ⚠️ Error Scenarios

### Error 1: "MetaMask not installed"
**Cause**: Browser extension not installed  
**Solution**: Install MetaMask from Chrome Web Store or Firefox Add-ons

### Error 2: "Wallet not connected"
**Cause**: MetaMask not connected to correct network  
**Solution**: 
- Check network in MetaMask
- If local: Select "Localhost 8545"
- If testnet: Select appropriate testnet (Sepolia, Goerli)

### Error 3: "Contract address not found"
**Cause**: Backend `.env` missing CONTRACT_ADDRESS  
**Solution**: 
- Deploy contract: `npx hardhat run scripts/deploy.js --network localhost`
- Update backend/.env with contract address

### Error 4: "Admin private key invalid"
**Cause**: Wrong or missing ADMIN_PRIVATE_KEY in .env  
**Solution**: 
- Update .env with correct private key
- Restart backend

### Error 5: "Insufficient balance"
**Cause**: Admin wallet out of ETH for gas  
**Solution**: 
- Get test ETH from faucet (testnet)
- Mint test ETH locally (localhost)

## 📊 Verification Checklist

After setup, verify each component:

### Backend
- [ ] Server starts without errors
- [ ] `/api/health` returns success
- [ ] `/api/contract-address` returns address
- [ ] `/api/elections/count` returns number

### Admin Panel
- [ ] MetaMask connection works
- [ ] Can create election
- [ ] Can add single candidate
- [ ] Can add multiple candidates
- [ ] Can view elections
- [ ] Can authorize voters
- [ ] Can end elections

### Voter Interface
- [ ] MetaMask connection works
- [ ] Can see active elections
- [ ] Can select candidate
- [ ] Can cast vote
- [ ] Vote confirmation shown
- [ ] Transaction hash displayed

### Smart Contract
- [ ] Elections created
- [ ] Candidates added
- [ ] Voters authorized
- [ ] Votes recorded
- [ ] Votes counted correctly

## 🔍 Debugging Tips

### Check Backend Logs
```bash
# Terminal where npm start is running
# Look for:
# - "Server running on" 
# - No error messages
# - API requests logged
```

### Check MetaMask
1. Open MetaMask extension
2. Check network selection
3. View account balance
4. See transaction history

### Check Results
```bash
# Verify on-chain voting
# Open Results page
# Should show real-time vote counts
```

### Check Contract State
```javascript
// In browser console:
// Display election count
await contract.electionCount()

// Display election details
await contract.getElection(1)

// Display candidates
await contract.getCandidates(1)

// Display results
await contract.getResults(1)
```

## 📈 Performance Notes

- **First load**: 2-3 seconds
- **Election creation**: 15-30 seconds (depends on network)
- **Vote casting**: 10-20 seconds
- **Results update**: Instant (reading blockchain)

## 🎯 Key Test Cases

| Test Case | Result | Notes |
|-----------|--------|-------|
| Add 1 candidate | ✅ | Works |
| Add 10 candidates batch | ✅ | All added |
| Create election | ✅ | Instant |
| Cast vote | ✅ | Blockchain confirmed |
| End election | ✅ | No more votes accepted |
| View results | ✅ | Real-time update |
| Authorize voter | ✅ | Voter can now vote |
| Unauthorized voter | ✅ | Vote rejected |
| Double vote prevention | ✅ | Blocked properly |

## ✅ Success Indicators

You'll know everything is working when:
1. ✅ Admin can create election with multiple candidates
2. ✅ Admin can manage candidates during voting
3. ✅ Voter can connect wallet and see elections
4. ✅ Voter can select candidate and cast vote
5. ✅ Vote appears on blockchain immediately
6. ✅ Results update in real-time
7. ✅ Error messages are helpful and specific
8. ✅ All transactions confirmed in MetaMask

## 🚀 Production Checklist

Before deploying to production:
- [ ] Smart contract audited
- [ ] All tests passing
- [ ] Error handling complete
- [ ] UI/UX reviewed
- [ ] Security best practices followed
- [ ] Rate limiting configured
- [ ] Gas optimization done
- [ ] Documentation complete
- [ ] Backup and recovery plan
- [ ] Support process defined

---

**Ready to vote! 🗳️**
