import { ethers } from 'ethers';
import { getAccount, getPublicClient, getWalletClient } from '@wagmi/core';
import { config } from '../wagmi';

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
  private contract: ethers.Contract | null = null;

  async connect() {
    // This method is now handled by RainbowKit
    const account = getAccount(config);
    if (!account.address) {
      throw new Error('Please connect your wallet using the connect button');
    }
    return account.address;
  }

  async getContract() {
    const walletClient = await getWalletClient(config);
    if (!walletClient) {
      throw new Error('Wallet not connected');
    }

    const provider = new ethers.BrowserProvider(walletClient);
    const signer = await provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  }

  async payForAuditETH(contractAddress: string) {
    const contract = await this.getContract();
    const fee = await contract.ethFee();
    const tx = await contract.payForAuditETH(contractAddress, { value: fee });
    return await tx.wait();
  }

  async payForAuditUSDT(contractAddress: string) {
    const contract = await this.getContract();
    const tx = await contract.payForAuditUSDT(contractAddress);
    return await tx.wait();
  }

  async hasPaidForAudit(userAddress: string, contractAddress: string) {
    const contract = await this.getContract();
    return await contract.hasPaidForAudit(userAddress, contractAddress);
  }

  async getETHFee() {
    const contract = await this.getContract();
    return await contract.ethFee();
  }

  async getUSDTFee() {
    const contract = await this.getContract();
    return await contract.usdtFee();
  }

  isConnected() {
    const account = getAccount(config);
    return !!account.address;
  }

  async getAddress() {
    const account = getAccount(config);
    if (!account.address) {
      throw new Error('Wallet not connected');
    }
    return account.address;
  }

  disconnect() {
    // Disconnect is handled by RainbowKit
    this.contract = null;
  }
}

export const web3Service = new Web3Service();