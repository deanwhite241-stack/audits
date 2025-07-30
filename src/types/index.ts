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
    // Enhanced with 20 new professional modules
    moduleResults?: ModuleAnalysisResult[];
    severityBreakdown?: SeverityBreakdown;
    gasOptimization?: GasAnalysis;
    securityScore?: SecurityScore;
    riskAssessment?: RiskAssessment;
  };
  isPaid: boolean;
}

export interface ModuleAnalysisResult {
  moduleId: string;
  moduleName: string;
  category: string;
  passed: boolean;
  score: number;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  issues: Array<{
    type: string;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
    description: string;
    location?: string;
    code?: string;
    fix?: string;
  }>;
  recommendations: string[];
  details: string;
  gasImpact?: number;
}

export interface SeverityBreakdown {
  critical: {
    count: number;
    modules: string[];
    topIssues: string[];
  };
  high: {
    count: number;
    modules: string[];
    topIssues: string[];
  };
  medium: {
    count: number;
    modules: string[];
    topIssues: string[];
  };
  low: {
    count: number;
    modules: string[];
    topIssues: string[];
  };
  informational: {
    count: number;
    modules: string[];
    topIssues: string[];
  };
}

export interface GasAnalysis {
  totalOptimizations: number;
  estimatedSavings: number;
  criticalOptimizations: string[];
  recommendations: string[];
}

export interface SecurityScore {
  overall: number;
  categories: {
    accessControl: number;
    reentrancy: number;
    arithmetic: number;
    oracle: number;
    governance: number;
    economics: number;
  };
}

export interface RiskAssessment {
  rugPullRisk: number;
  centralizedRisk: number;
  technicalRisk: number;
  economicRisk: number;
  overallRisk: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  riskFactors: string[];
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

export interface Project {
  id: string;
  name: string;
  description: string;
  logo: string;
  contractAddress: string;
  chain: string;
  type: 'Token' | 'NFT' | 'DeFi' | 'Staking' | 'Launchpad' | 'DAO' | 'Other';
  website?: string;
  twitter?: string;
  telegram?: string;
  auditUrl: string;
  certificate: 'Gold ESR' | 'Verified' | 'None';
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  approvedAt?: string;
  approvedBy?: string;
}

export interface ProjectSubmission {
  name: string;
  description: string;
  logo: File | null;
  contractAddress: string;
  chain: string;
  type: Project['type'];
  website?: string;
  twitter?: string;
  telegram?: string;
}