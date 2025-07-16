import { ethers } from 'ethers';

// TODO: Update this address after deploying the contract
const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000'; // Will be updated after deployment

const CONTRACT_ABI = [
  "function payForAuditETH(string memory contractAddress) external payable",
  "function payForAuditUSDT(string memory contractAddress) external",
  "function hasPaidForAudit(address user, string memory contractAddress) external view returns (bool)",
  "function ethFee() external view returns (uint256)",
  "function usdtFee() external view returns (uint256)",
  "function getStats() external view returns (uint256, uint256, uint256, uint256, uint256)",
  "function getUserStats(address user) external view returns (uint256)",
  "function owner() external view returns (address)",
  "function paused() external view returns (bool)",
  "event AuditPaid(address indexed user, string contractAddress, uint256 amount, bool isEth)"
];

export class Web3Service {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private contract: ethers.Contract | null = null;

  async connect() {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask is not installed');
    }

    this.provider = new ethers.BrowserProvider(window.ethereum);
    await this.provider.send('eth_requestAccounts', []);
    this.signer = await this.provider.getSigner();
    this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.signer);
    
    return await this.signer.getAddress();
  }

  async payForAuditETH(contractAddress: string) {
    if (!this.contract) throw new Error('Contract not initialized');
    
    const fee = await this.contract.ethFee();
    const tx = await this.contract.payForAuditETH(contractAddress, { value: fee });
    return await tx.wait();
  }

  async payForAuditUSDT(contractAddress: string) {
    if (!this.contract) throw new Error('Contract not initialized');
    
    const tx = await this.contract.payForAuditUSDT(contractAddress);
    return await tx.wait();
  }

  async hasPaidForAudit(userAddress: string, contractAddress: string) {
    if (!this.contract) throw new Error('Contract not initialized');
    
    return await this.contract.hasPaidForAudit(userAddress, contractAddress);
  }

  async getETHFee() {
    if (!this.contract) throw new Error('Contract not initialized');
    
    return await this.contract.ethFee();
  }

  async getUSDTFee() {
    if (!this.contract) throw new Error('Contract not initialized');
    
    return await this.contract.usdtFee();
  }

  isConnected() {
    return !!this.signer;
  }

  async getAddress() {
    if (!this.signer) throw new Error('Wallet not connected');
    return await this.signer.getAddress();
  }

  disconnect() {
    // Clear the connection state
    this.provider = null;
    this.signer = null;
    this.contract = null;
    
    // Clear any cached wallet data
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem('walletConnected');
    }
    
    // Trigger wallet disconnect event if available
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        // Some wallets support programmatic disconnect
        if (window.ethereum.disconnect) {
          await window.ethereum.disconnect();
        }
      } catch (error) {
        // Ignore errors - not all wallets support this
        console.log('Wallet disconnect not supported');
      }
    }
  }
}

export const web3Service = new Web3Service();