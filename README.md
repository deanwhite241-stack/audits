# ContractGuard - Smart Contract Security Auditor

A comprehensive SaaS platform for auditing smart contracts using AI-powered analysis. Built with React, TypeScript, and Web3 integration.

## Features

### Core Functionality
- **AI-Powered Analysis**: Advanced vulnerability detection using ChatGPT
- **Free & Premium Tiers**: Basic analysis free, comprehensive reports behind paywall
- **Web3 Integration**: MetaMask payment processing with ETH/USDT
- **Real-time Analysis**: Instant security reports with risk scoring
- **Dashboard**: User audit history and report management

### Security Analysis
- **Vulnerability Detection**: Critical, medium, and low severity issues
- **Spyware Detection**: Hidden data collection and privacy risks
- **Honeypot Identification**: Trading restriction detection
- **Backdoor Analysis**: Hidden administrative functions
- **Contract Information**: Ownership, upgradeability, and token details

### Technical Features
- **Multi-chain Support**: Ethereum and EVM-compatible networks
- **Source Code Analysis**: Verified contract analysis via Etherscan
- **Bytecode Decompilation**: Unverified contract analysis
- **PDF Export**: Downloadable security reports
- **Responsive Design**: Mobile-first UI with modern aesthetics

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Ethers.js** for Web3 integration

### Backend (Reference Implementation)
- **Node.js** with Express
- **OpenAI API** for AI analysis
- **Etherscan API** for contract data
- **PostgreSQL** for data storage

### Smart Contract
- **Solidity 0.8.x** 
- **OpenZeppelin** libraries
- **Payment Processing** for ETH/USDT

## Getting Started

### Prerequisites
- Node.js 18+
- MetaMask wallet
- Ethereum testnet ETH (for testing)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourorg/contractguard.git
cd contractguard
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env and add your API keys:
# OPENAI_API_KEY=your_openai_api_key
# ETHERSCAN_API_KEY=your_etherscan_api_key
```

4. Start the backend server
```bash
node src/backend/server.js
```

5. Start the frontend development server
```bash
npm run dev
```

6. Open your browser to `http://localhost:5173`

### Environment Variables

The application requires the following environment variables:

```env
# Required for AI analysis
OPENAI_API_KEY=your_openai_api_key_here

# Required for contract data fetching
ETHERSCAN_API_KEY=your_etherscan_api_key_here

# Optional - Database URL if using persistent storage
DATABASE_URL=your_database_url_here

# Server configuration
PORT=3001
NODE_ENV=production
ALLOWED_ORIGINS=https://your-frontend-domain.com
```

## Smart Contract Deployment

The payment contract is located in `src/contracts/AuditPay.sol`. To deploy:

1. Install Hardhat or Foundry
2. Configure network settings
3. Deploy the contract
4. Update the contract address in the frontend

## Architecture

### Frontend Structure
```
src/
├── components/          # React components
├── services/           # API and Web3 services
├── types/             # TypeScript definitions
├── contracts/         # Smart contract files
└── App.tsx           # Main application
```

### Payment Flow
1. User submits contract address
2. System fetches and analyzes contract
3. Free report displayed immediately
4. Premium features require payment via MetaMask
5. Smart contract verifies payment
6. Full report unlocked for user

### Security Features
- **Rate Limiting**: API request throttling
- **Input Validation**: Address and input sanitization
- **Secure Payments**: On-chain payment verification
- **Data Privacy**: User data protection

## API Endpoints

### POST /api/audit
Analyze a smart contract
```json
{
  "contractAddress": "0x...",
  "includeSource": true
}
```

### GET /api/audit/:address
Retrieve audit results
```json
{
  "contractAddress": "0x...",
  "riskScore": 75,
  "vulnerabilities": [...],
  "isPaid": true
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@contractguard.com or join our Discord community.

## Roadmap

- [ ] Multi-chain support (Polygon, BSC, etc.)
- [ ] Advanced DeFi protocol analysis
- [ ] Automated monitoring and alerts
- [ ] API for developers
- [ ] Mobile app development
- [ ] Enterprise features and pricing

Smart Contract is Now Ready for Hardhat Deployment!

I've created a complete Hardhat setup with:
📦 What's Included:

    Enhanced Smart Contract (contracts/AuditPay.sol):
        Production-ready with proper error handling
        Gas-optimized with custom errors
        Pausable functionality for emergencies
        Comprehensive statistics tracking
        Multi-network USDT support

    Complete Hardhat Configuration:
        Multi-network support (Mainnet, Sepolia, Polygon, BSC)
        Gas optimization settings
        Etherscan verification setup

    Deployment Scripts:
        scripts/deploy.js - Automated deployment with network detection
        scripts/verify.js - Contract verification on Etherscan

    Comprehensive Tests:
        Full test suite covering all functions
        Mock USDT contract for testing
        Gas usage and edge case testing


🚀 How to Deploy:

    Install Dependencies:

npm install

    Set Up Environment:

# Copy and fill out .env file
cp .env.example .env
# Add your PRIVATE_KEY and RPC URLs

    Test Locally:

npm run test
npm run compile

    Deploy to Testnet (Sepolia):

npm run deploy:sepolia

    Deploy to Mainnet:

npm run deploy:mainnet

    Verify on Etherscan:

npm run verify -- <contract_address> <usdt_address>

Key Features:

    ✅ Multi-network USDT support (Mainnet, Polygon, BSC)
    ✅ Gas-optimized with custom errors
    ✅ Emergency pause functionality
    ✅ Automatic refunds for excess ETH
    ✅ Comprehensive statistics tracking
    ✅ Full test coverage
    ✅ Etherscan verification ready

📋 After Deployment:

    Update CONTRACT_ADDRESS in src/services/web3.ts
    Test with small amounts first
    Verify contract on Etherscan
    Update frontend documentation

The contract is now production-ready and can be deployed to any EVM network!

This tool is for educational and informational purposes. Always perform additional security audits for production contracts.
