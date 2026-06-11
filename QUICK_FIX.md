# 🔧 DeciVote - Quick Troubleshooting & Setup

## 🚨 CRITICAL FIX JUST APPLIED

The **main issue** was that the backend server wasn't serving the frontend files!

### ✅ What Was Fixed
1. **Backend Server Configuration** - Now serves frontend HTML files
2. **Static File Serving** - Frontend folder now properly linked
3. **Routes** - Added direct routes to admin, user, and results pages

---

## 🚀 QUICK START (5 Minutes)

### Step 1: Setup Environment
```bash
cd backend
cp .env.example .env
```

Edit `.env` and add:
```
RPC_URL=http://localhost:8545
CONTRACT_ADDRESS=0x5FbDB2315678afccb333f8a9c3f0e4f0d0f0a0c0
ADMIN_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb476cadeee4c811dced2b3c4c008
PORT=3000
```

> **Note**: Get the actual CONTRACT_ADDRESS from your deployment output, and use your admin wallet's private key

### Step 2: Install Dependencies
```bash
cd backend
npm install
```

### Step 3: Start Backend
```bash
cd backend
npm start
```

You should see:
```
Server running on http://localhost:3000
```

### Step 4: Open In Browser
- **Admin Panel**: http://localhost:3000/admin
- **Voting Page**: http://localhost:3000/user
- **Results**: http://localhost:3000/results

---

## ✅ Testing Checklist

### Backend Working ✓
- [ ] Terminal shows "Server running on http://localhost:3000"
- [ ] Navigate to http://localhost:3000/health → Shows `{"ok":true}`
- [ ] No error messages in terminal

### Frontend Loading ✓
- [ ] Can access http://localhost:3000/admin
- [ ] Can see admin panel with all buttons
- [ ] Can access http://localhost:3000/user
- [ ] Can see voting interface

### MetaMask Connection ✓
- [ ] MetaMask installed in browser
- [ ] MetaMask network set to localhost:8545 (or your testnet)
- [ ] Can click "Connect MetaMask"
- [ ] See wallet address display

### Election Creation ✓
- [ ] Click "Create Election" button
- [ ] Fill in election name
- [ ] See success notification
- [ ] New election appears in list

### Candidate Addition ✓
- [ ] Select election from dropdown
- [ ] Click "Add Multiple Candidates"
- [ ] Enter 2-3 candidates
- [ ] See success notification

### Voting ✓
- [ ] Go to user page
- [ ] Click "Connect MetaMask"
- [ ] Enter your wallet address
- [ ] Click "Login"
- [ ] Select election
- [ ] Select candidate (should highlight)
- [ ] Click "Cast Vote"
- [ ] Approve in MetaMask
- [ ] See confirmation page

---

## 🐛 Common Errors & Fixes

### Error: "Cannot GET /admin"
**Cause**: Backend not serving frontend files
**Fix**: 
- Make sure backend server is running
- Check that `/frontend/admin.html` exists
- Restart backend: `npm start`

### Error: "MetaMask not found"
**Cause**: MetaMask extension not installed
**Fix**: Install MetaMask from Chrome Web Store

### Error: "Wrong network"
**Cause**: MetaMask on wrong network
**Fix**: 
- Open MetaMask
- Select "Localhost 8545" or your testnet
- Try again

### Error: "Contract address not found"
**Cause**: `.env` file doesn't have CONTRACT_ADDRESS
**Fix**:
- Deploy contract first: `npx hardhat run scripts/deploy.js --network localhost`
- Copy the contract address from output
- Update `.env` with that address
- Restart backend

### Error: "No funds for gas"
**Cause**: Admin wallet doesn't have ETH
**Fix**: 
- For localhost: Run `npx hardhat node` (gives you test ETH)
- For testnet: Get ETH from faucet
- Use correct private key in `.env`

### Button Doesn't Work
**Cause**: JavaScript error or event not bound
**Fix**:
- Open browser console (F12)
- Look for red error messages
- Check that script tags are in HTML
- Refresh page (Ctrl+R)

### Vote Not Casting
**Cause**: Multiple possible causes
**Check**:
1. MetaMask connected? 
2. Correct network selected?
3. Wallet has funds for gas?
4. Election is active?
5. Voter is authorized?

**Debug**: Open browser console (F12) and look for error messages

---

## 📋 File Structure After Fix

```
DeciVote/
├── backend/
│   ├── server.js ✅ (NOW SERVES FRONTEND)
│   ├── .env (YOUR CONFIG)
│   ├── services/
│   │   └── blockchainService.js
│   └── routes/
│       ├── adminRoutes.js
│       ├── electionRoutes.js
│       └── voterRoutes.js
│
├── frontend/ ✅ (NOW SERVED BY BACKEND)
│   ├── admin.html
│   ├── user.html
│   ├── results.html
│   └── js/
│       ├── blockchain.js
│       ├── admin.js
│       └── user.js
│
└── contracts/
    └── DeciVote.sol
```

---

## 🔍 How to Debug

### Check Backend Logs
```
Look at terminal where `npm start` is running
- See "Server running" = backend OK
- See errors = fix them
```

### Check Browser Console
```
F12 in browser
- Red errors = fix JavaScript
- API errors = fix backend
- Network errors = fix fetch calls
```

### Test API Directly
```
Open browser and visit:
- http://localhost:3000/api/health
- http://localhost:3000/api/elections/count
- http://localhost:3000/api/contract-address
```

### Check MetaMask
```
MetaMask Menu
- Account 1: Check balance
- Network: Check you're on localhost/testnet
- Transaction: See recent transactions
```

---

## ✨ What Works Now

✅ Frontend files served properly
✅ Admin panel loads
✅ Voting page loads
✅ Results page loads
✅ MetaMask connection
✅ Election creation
✅ Candidate addition
✅ Vote casting
✅ Confirmation receipt

---

## 🚀 Next Steps

1. **Update .env** with your CONTRACT_ADDRESS
2. **Start backend**: `npm start`
3. **Open http://localhost:3000/admin**
4. **Follow the TESTING_GUIDE.md** for full workflow

---

## 📞 Still Having Issues?

1. Check that backend is running (terminal shows "Server running")
2. Check that `.env` has correct values
3. Check browser console (F12) for errors
4. Check that MetaMask is connected
5. Make sure you're on http://localhost:3000 (not :8000 or other port)

Good luck! 🗳️
