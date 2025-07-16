import { AuditResult } from '../types';

const API_BASE_URL = '/api';

export class ApiService {
  async analyzeContract(contractAddress: string): Promise<AuditResult> {
    // Mock implementation - in production, this would call your backend
    const mockResult: AuditResult = {
      contractAddress,
      timestamp: new Date().toISOString(),
      riskScore: Math.floor(Math.random() * 100),
      summary: "AI-generated comprehensive analysis of smart contract security",
      issueCount: {
        critical: Math.floor(Math.random() * 3),
        medium: Math.floor(Math.random() * 5),
        low: Math.floor(Math.random() * 8),
        informational: Math.floor(Math.random() * 10)
      },
      contractInfo: {
        isVerified: Math.random() > 0.3,
        hasOwnable: Math.random() > 0.5,
        hasMintable: Math.random() > 0.7,
        hasUpgradeable: Math.random() > 0.8,
        compiler: "0.8.19"
      },
      freeReport: {
        summary: "This contract appears to be a standard ERC-20 token with basic functionality. Initial scan reveals some potential areas of concern.",
        basicVulnerabilities: [
          "Potential integer overflow in transfer function",
          "Missing access control on certain functions",
          "Unchecked external calls detected"
        ],
        riskLevel: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'][Math.floor(Math.random() * 4)] as any
      },
      premiumReport: {
        criticalVulnerabilities: [
          "Reentrancy vulnerability in withdraw function",
          "Unprotected selfdestruct function",
          "Backdoor in owner-only functions"
        ],
        mediumVulnerabilities: [
          "Gas optimization opportunities",
          "Missing event emissions",
          "Potential front-running issues"
        ],
        spywareRisks: [
          "Hidden data collection in transfer events",
          "Suspicious external contract calls",
          "Potential privacy violations"
        ],
        honeypotRisks: [
          "Restricted transfer conditions",
          "Hidden fees on transactions",
          "Blacklist functionality detected"
        ],
        backdoorRisks: [
          "Admin can change balances",
          "Emergency pause can be triggered arbitrarily",
          "Upgrade proxy with no timelock"
        ],
        recommendations: [
          "Implement proper access controls",
          "Add comprehensive test coverage",
          "Consider using OpenZeppelin libraries",
          "Add timelock for admin functions"
        ],
        detailedAnalysis: "Comprehensive technical analysis of the contract's architecture, security patterns, and potential vulnerabilities..."
      },
      isPaid: false
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return mockResult;
  }

  async getUserAudits(userAddress: string) {
    // Mock implementation
    const mockAudits = [
      {
        id: '1',
        contractAddress: '0x1234...5678',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        status: 'paid' as const,
        riskScore: 75
      },
      {
        id: '2',
        contractAddress: '0x9876...4321',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        status: 'free' as const,
        riskScore: 45
      }
    ];

    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockAudits;
  }
}

export const apiService = new ApiService();