import { ethers } from 'ethers';

const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000'; // Deploy address will be set here
const CONTRACT_ABI = [
  "function payForAuditETH(string memory contractAddress) external payable",
  "function payForAuditUSDT(string memory contractAddress) external",
  "function hasPaidForAudit(address user, string memory contractAddress) external view returns (bool)",
  "function ethFee() external view returns (uint256)",
  "function usdtFee() external view returns (uint256)",
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
}

export const web3Service = new Web3Service();