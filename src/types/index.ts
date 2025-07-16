export interface AuditResult {
  contractAddress: string;
  timestamp: string;
  riskScore: number;
  summary: string;
  issueCount: {
    critical: number;
    medium: number;
    low: number;
    informational: number;
  };
  contractInfo: {
    isVerified: boolean;
    hasOwnable: boolean;
    hasMintable: boolean;
    hasUpgradeable: boolean;
    compiler: string;
  };
  freeReport: {
    summary: string;
    basicVulnerabilities: string[];
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  };
  premiumReport?: {
    criticalVulnerabilities: string[];
    mediumVulnerabilities: string[];
    spywareRisks: string[];
    honeypotRisks: string[];
    backdoorRisks: string[];
    recommendations: string[];
    detailedAnalysis: string;
  };
  isPaid: boolean;
}

export interface PaymentStatus {
  hasPaid: boolean;
  transactionHash?: string;
  timestamp?: string;
}

export interface UserAudit {
  id: string;
  contractAddress: string;
  timestamp: string;
  status: 'free' | 'paid';
  riskScore: number;
}