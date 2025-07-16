import { AuditResult } from '../types';
import { Project, ProjectSubmission } from '../types';

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

  async getProjects(filters?: {
    search?: string;
    chain?: string;
    type?: string;
    certificateOnly?: boolean;
  }): Promise<Project[]> {
    // Mock implementation
    let mockProjects: Project[] = [
      {
        id: '1',
        name: 'RocketVault',
        description: 'Advanced DeFi auto-yield protocol with innovative staking mechanisms and cross-chain compatibility.',
        logo: 'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        contractAddress: '0x1234567890123456789012345678901234567890',
        chain: 'Ethereum',
        type: 'DeFi',
        website: 'https://rocketvault.finance',
        twitter: 'https://twitter.com/rocketvault',
        auditUrl: '/audit/0x1234567890123456789012345678901234567890',
        certificate: 'Gold ESR',
        status: 'approved',
        submittedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
        approvedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        approvedBy: 'admin@contractguard.com'
      },
      {
        id: '2',
        name: 'CryptoKitties V2',
        description: 'Next-generation NFT collection with breeding mechanics and play-to-earn gaming features.',
        logo: 'https://images.pexels.com/photos/1404819/pexels-photo-1404819.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        contractAddress: '0x2345678901234567890123456789012345678901',
        chain: 'Ethereum',
        type: 'NFT',
        website: 'https://cryptokitties.co',
        auditUrl: '/audit/0x2345678901234567890123456789012345678901',
        certificate: 'Gold ESR',
        status: 'approved',
        submittedAt: new Date(Date.now() - 86400000 * 14).toISOString(),
        approvedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
        approvedBy: 'admin@contractguard.com'
      },
      {
        id: '3',
        name: 'StakePool Pro',
        description: 'Professional staking solution with automated rewards distribution and governance features.',
        logo: 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        contractAddress: '0x3456789012345678901234567890123456789012',
        chain: 'Polygon',
        type: 'Staking',
        auditUrl: '/audit/0x3456789012345678901234567890123456789012',
        certificate: 'Verified',
        status: 'approved',
        submittedAt: new Date(Date.now() - 86400000 * 21).toISOString(),
        approvedAt: new Date(Date.now() - 86400000 * 18).toISOString(),
        approvedBy: 'admin@contractguard.com'
      },
      {
        id: '4',
        name: 'LaunchPad Elite',
        description: 'Premium token launchpad with KYC verification and anti-bot protection mechanisms.',
        logo: 'https://images.pexels.com/photos/186461/pexels-photo-186461.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        contractAddress: '0x4567890123456789012345678901234567890123',
        chain: 'BSC',
        type: 'Launchpad',
        website: 'https://launchpadelite.io',
        telegram: 'https://t.me/launchpadelite',
        auditUrl: '/audit/0x4567890123456789012345678901234567890123',
        certificate: 'Gold ESR',
        status: 'approved',
        submittedAt: new Date(Date.now() - 86400000 * 30).toISOString(),
        approvedAt: new Date(Date.now() - 86400000 * 28).toISOString(),
        approvedBy: 'admin@contractguard.com'
      },
      {
        id: '5',
        name: 'SafeToken',
        description: 'Community-driven token with built-in anti-whale mechanisms and automatic liquidity provision.',
        logo: 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        contractAddress: '0x5678901234567890123456789012345678901234',
        chain: 'Ethereum',
        type: 'Token',
        twitter: 'https://twitter.com/safetoken',
        auditUrl: '/audit/0x5678901234567890123456789012345678901234',
        certificate: 'Verified',
        status: 'approved',
        submittedAt: new Date(Date.now() - 86400000 * 45).toISOString(),
        approvedAt: new Date(Date.now() - 86400000 * 42).toISOString(),
        approvedBy: 'admin@contractguard.com'
      }
    ];

    // Apply filters
    if (filters) {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        mockProjects = mockProjects.filter(p => 
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.contractAddress.toLowerCase().includes(searchLower)
        );
      }
      if (filters.chain) {
        mockProjects = mockProjects.filter(p => p.chain === filters.chain);
      }
      if (filters.type) {
        mockProjects = mockProjects.filter(p => p.type === filters.type);
      }
      if (filters.certificateOnly) {
        mockProjects = mockProjects.filter(p => p.certificate === 'Gold ESR');
      }
    }

    await new Promise(resolve => setTimeout(resolve, 800));
    return mockProjects;
  }

  async submitProject(submission: ProjectSubmission): Promise<{ success: boolean; message: string }> {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate validation
    if (!submission.name || !submission.contractAddress) {
      return { success: false, message: 'Name and contract address are required' };
    }

    return { success: true, message: 'Project submitted successfully for review' };
  }

  async getPendingProjects(): Promise<Project[]> {
    // Mock implementation for admin
    const mockPending: Project[] = [
      {
        id: 'pending-1',
        name: 'NewDeFi Protocol',
        description: 'Innovative DeFi protocol with yield farming capabilities.',
        logo: 'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        contractAddress: '0x9876543210987654321098765432109876543210',
        chain: 'Ethereum',
        type: 'DeFi',
        auditUrl: '/audit/0x9876543210987654321098765432109876543210',
        certificate: 'None',
        status: 'pending',
        submittedAt: new Date(Date.now() - 86400000 * 2).toISOString()
      }
    ];

    await new Promise(resolve => setTimeout(resolve, 500));
    return mockPending;
  }

  async approveProject(projectId: string, certificate: 'Gold ESR' | 'Verified'): Promise<{ success: boolean }> {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  }

  async rejectProject(projectId: string, reason: string): Promise<{ success: boolean }> {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  }
}

export const apiService = new ApiService();