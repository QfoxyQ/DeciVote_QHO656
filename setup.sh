#!/bin/bash
# DeciVote - Setup and Testing Script

echo "================================"
echo "DeciVote Blockchain Voting System"
echo "Setup & Testing Script"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check Node.js
echo -e "${BLUE}[1/5] Checking Node.js installation...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓ Node.js ${NODE_VERSION} found${NC}"
else
    echo -e "${RED}✗ Node.js not found. Please install Node.js v14+${NC}"
    exit 1
fi

# Check npm
echo -e "${BLUE}[2/5] Checking npm installation...${NC}"
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓ npm ${NPM_VERSION} found${NC}"
else
    echo -e "${RED}✗ npm not found${NC}"
    exit 1
fi

# Install backend dependencies
echo -e "${BLUE}[3/5] Installing backend dependencies...${NC}"
if [ -d "backend" ]; then
    cd backend
    npm install --save-dev 2>/dev/null || echo -e "${YELLOW}⚠ Some dependencies may need manual installation${NC}"
    cd ..
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
else
    echo -e "${RED}✗ Backend directory not found${NC}"
    exit 1
fi

# Check .env file
echo -e "${BLUE}[4/5] Checking environment configuration...${NC}"
if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✓ .env file found${NC}"
else
    echo -e "${YELLOW}⚠ .env file not found in backend directory${NC}"
    echo -e "${YELLOW}  Creating template .env file...${NC}"
    cat > backend/.env << 'EOF'
RPC_URL=http://localhost:8545
CONTRACT_ADDRESS=0x... (replace with deployed contract address)
ADMIN_PRIVATE_KEY=0x... (replace with your admin wallet private key)
PORT=3000
EOF
    echo -e "${YELLOW}  Please update backend/.env with your values${NC}"
fi

# Summary
echo ""
echo -e "${BLUE}[5/5] Setup Complete!${NC}"
echo ""
echo -e "${GREEN}================================"
echo "✓ Setup Completed Successfully"
echo "================================${NC}"
echo ""

echo -e "${BLUE}Next Steps:${NC}"
echo ""
echo "1. Update backend/.env with your configuration:"
echo -e "   ${YELLOW}RPC_URL${NC}         - Your blockchain RPC endpoint"
echo -e "   ${YELLOW}CONTRACT_ADDRESS${NC} - Deployed DeciVote contract address"
echo -e "   ${YELLOW}ADMIN_PRIVATE_KEY${NC} - Your admin wallet private key"
echo ""

echo "2. Deploy smart contract (if not already deployed):"
echo -e "   ${YELLOW}cd backend${NC}"
echo -e "   ${YELLOW}npx hardhat run scripts/deploy.js --network localhost${NC}"
echo ""

echo "3. Start the backend server:"
echo -e "   ${YELLOW}cd backend${NC}"
echo -e "   ${YELLOW}npm start${NC}"
echo ""

echo "4. Open in your browser:"
echo -e "   ${YELLOW}Admin Panel: http://localhost:3000/frontend/admin.html${NC}"
echo -e "   ${YELLOW}Voter Interface: http://localhost:3000/frontend/user.html${NC}"
echo -e "   ${YELLOW}Results: http://localhost:3000/frontend/results.html${NC}"
echo ""

echo -e "${BLUE}For detailed setup instructions, see SETUP_GUIDE.md${NC}"
echo ""
