import { auditModules } from './auditModules';
import { extendedAuditModules } from './auditModulesExtended';
import { finalAuditModules } from './auditModulesFinal';
import { AuditModule, ModuleResult } from './auditModules';

// Combine all 20 new modules (6 + 6 + 8 = 20)
const allNewModules = [
  ...auditModules,
  ...extendedAuditModules,
  ...finalAuditModules
];

export interface EnhancedAuditResult {
  contractAddress: string;
  timestamp: string;
  riskScore: number;
  summary: string;
  issueCount: {
    critical: number;
    high: number;
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
  premiumReport: {
    criticalVulnerabilities: string[];
    mediumVulnerabilities: string[];
    spywareRisks: string[];
    honeypotRisks: string[];
    backdoorRisks: string[];
    recommendations: string[];
    detailedAnalysis: string;
    // Enhanced with 20 new modules
    moduleResults: ModuleAnalysisResult[];
    severityBreakdown: SeverityBreakdown;
    gasOptimization: GasAnalysis;
    securityScore: SecurityScore;
    riskAssessment: RiskAssessment;
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

export class EnhancedAuditService {
  private modules: AuditModule[] = allNewModules;

  async runComprehensiveAnalysis(
    sourceCode: string, 
    contractAddress: string, 
    bytecode?: string
  ): Promise<EnhancedAuditResult> {
    console.log(`Starting comprehensive analysis for ${contractAddress} with ${this.modules.length} modules`);
    
    // Run all 20 new modules
    const moduleResults: ModuleAnalysisResult[] = [];
    
    for (const module of this.modules) {
      try {
        console.log(`Running module: ${module.name}`);
        const result = await module.analyze(sourceCode, contractAddress, bytecode);
        
        moduleResults.push({
          moduleId: module.id,
          moduleName: module.name,
          category: module.category,
          passed: result.passed,
          score: result.score,
          riskLevel: result.riskLevel,
          issues: result.issues,
          recommendations: result.recommendations,
          details: result.details,
          gasImpact: result.gasImpact
        });
      } catch (error) {
        console.error(`Error in module ${module.name}:`, error);
        // Continue with other modules even if one fails
        moduleResults.push({
          moduleId: module.id,
          moduleName: module.name,
          category: module.category,
          passed: false,
          score: 0,
          riskLevel: 'HIGH',
          issues: [{
            type: 'module-error',
            severity: 'HIGH',
            description: `Module analysis failed: ${error.message}`,
            fix: 'Manual review required'
          }],
          recommendations: ['Manual security review recommended'],
          details: `Module failed to complete analysis`
        });
      }
    }

    // Calculate severity breakdown
    const severityBreakdown = this.calculateSeverityBreakdown(moduleResults);
    
    // Calculate gas analysis
    const gasAnalysis = this.calculateGasAnalysis(moduleResults);
    
    // Calculate security score
    const securityScore = this.calculateSecurityScore(moduleResults);
    
    // Calculate risk assessment
    const riskAssessment = this.calculateRiskAssessment(moduleResults);
    
    // Calculate overall risk score
    const overallRiskScore = this.calculateOverallRiskScore(moduleResults);
    
    // Generate comprehensive summary
    const summary = this.generateComprehensiveSummary(moduleResults, severityBreakdown);
    
    // Extract contract info
    const contractInfo = this.extractContractInfo(sourceCode);
    
    // Generate free report (basic info only)
    const freeReport = this.generateFreeReport(moduleResults, overallRiskScore);
    
    // Generate premium report with all 35 modules
    const premiumReport = {
      criticalVulnerabilities: this.extractCriticalVulnerabilities(moduleResults),
      mediumVulnerabilities: this.extractMediumVulnerabilities(moduleResults),
      spywareRisks: this.extractSpywareRisks(moduleResults),
      honeypotRisks: this.extractHoneypotRisks(moduleResults),
      backdoorRisks: this.extractBackdoorRisks(moduleResults),
      recommendations: this.generateAllRecommendations(moduleResults),
      detailedAnalysis: this.generateDetailedAnalysis(moduleResults),
      moduleResults,
      severityBreakdown,
      gasOptimization: gasAnalysis,
      securityScore,
      riskAssessment
    };

    return {
      contractAddress,
      timestamp: new Date().toISOString(),
      riskScore: overallRiskScore,
      summary,
      issueCount: {
        critical: severityBreakdown.critical.count,
        high: severityBreakdown.high.count,
        medium: severityBreakdown.medium.count,
        low: severityBreakdown.low.count,
        informational: severityBreakdown.informational.count
      },
      contractInfo,
      freeReport,
      premiumReport,
      isPaid: false // Will be updated based on payment status
    };
  }

  private calculateSeverityBreakdown(moduleResults: ModuleAnalysisResult[]): SeverityBreakdown {
    const breakdown: SeverityBreakdown = {
      critical: { count: 0, modules: [], topIssues: [] },
      high: { count: 0, modules: [], topIssues: [] },
      medium: { count: 0, modules: [], topIssues: [] },
      low: { count: 0, modules: [], topIssues: [] },
      informational: { count: 0, modules: [], topIssues: [] }
    };

    moduleResults.forEach(result => {
      result.issues.forEach(issue => {
        const severity = issue.severity.toLowerCase() as keyof SeverityBreakdown;
        if (breakdown[severity]) {
          breakdown[severity].count++;
          if (!breakdown[severity].modules.includes(result.moduleName)) {
            breakdown[severity].modules.push(result.moduleName);
          }
          if (breakdown[severity].topIssues.length < 5) {
            breakdown[severity].topIssues.push(issue.description);
          }
        }
      });
    });

    return breakdown;
  }

  private calculateGasAnalysis(moduleResults: ModuleAnalysisResult[]): GasAnalysis {
    const gasModule = moduleResults.find(r => r.moduleId === 'gas-optimization');
    const totalOptimizations = gasModule?.issues.length || 0;
    const estimatedSavings = gasModule?.gasImpact || 0;
    
    return {
      totalOptimizations,
      estimatedSavings,
      criticalOptimizations: gasModule?.issues
        .filter(i => i.severity === 'HIGH' || i.severity === 'CRITICAL')
        .map(i => i.description) || [],
      recommendations: gasModule?.recommendations || []
    };
  }

  private calculateSecurityScore(moduleResults: ModuleAnalysisResult[]): SecurityScore {
    const categories = {
      accessControl: this.getModuleScore(moduleResults, 'access-control'),
      reentrancy: this.getModuleScore(moduleResults, 'reentrancy-detection'),
      arithmetic: this.getModuleScore(moduleResults, 'integer-overflow'),
      oracle: this.getModuleScore(moduleResults, 'oracle-manipulation'),
      governance: this.getModuleScore(moduleResults, 'timelock-emergency'),
      economics: this.getModuleScore(moduleResults, 'tokenomics-supply-risk')
    };

    const overall = Object.values(categories).reduce((sum, score) => sum + score, 0) / Object.keys(categories).length;

    return { overall, categories };
  }

  private getModuleScore(moduleResults: ModuleAnalysisResult[], moduleId: string): number {
    const module = moduleResults.find(r => r.moduleId === moduleId);
    return module?.score || 50; // Default score if module not found
  }

  private calculateRiskAssessment(moduleResults: ModuleAnalysisResult[]): RiskAssessment {
    const rugPullModule = moduleResults.find(r => r.moduleId === 'rug-pull-risk');
    const accessControlModule = moduleResults.find(r => r.moduleId === 'access-control');
    const economicModule = moduleResults.find(r => r.moduleId === 'economic-attack-simulation');
    
    const rugPullRisk = rugPullModule ? (100 - rugPullModule.score) : 50;
    const centralizedRisk = accessControlModule ? (100 - accessControlModule.score) : 50;
    const technicalRisk = this.calculateTechnicalRisk(moduleResults);
    const economicRisk = economicModule ? (100 - economicModule.score) : 50;

    const overallRiskScore = (rugPullRisk + centralizedRisk + technicalRisk + economicRisk) / 4;
    
    let overallRisk: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    if (overallRiskScore >= 75) overallRisk = 'CRITICAL';
    else if (overallRiskScore >= 50) overallRisk = 'HIGH';
    else if (overallRiskScore >= 25) overallRisk = 'MEDIUM';
    else overallRisk = 'LOW';

    const riskFactors = this.extractRiskFactors(moduleResults);

    return {
      rugPullRisk,
      centralizedRisk,
      technicalRisk,
      economicRisk,
      overallRisk,
      riskFactors
    };
  }

  private calculateTechnicalRisk(moduleResults: ModuleAnalysisResult[]): number {
    const technicalModules = ['reentrancy-detection', 'integer-overflow', 'flash-loan-attack', 'upgradeability-security'];
    const scores = technicalModules.map(id => this.getModuleScore(moduleResults, id));
    const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    return 100 - avgScore;
  }

  private extractRiskFactors(moduleResults: ModuleAnalysisResult[]): string[] {
    const riskFactors: string[] = [];
    
    moduleResults.forEach(result => {
      result.issues.forEach(issue => {
        if (issue.severity === 'CRITICAL' || issue.severity === 'HIGH') {
          riskFactors.push(`${result.moduleName}: ${issue.description}`);
        }
      });
    });

    return riskFactors.slice(0, 10); // Top 10 risk factors
  }

  private calculateOverallRiskScore(moduleResults: ModuleAnalysisResult[]): number {
    const totalScore = moduleResults.reduce((sum, result) => sum + result.score, 0);
    return Math.round(totalScore / moduleResults.length);
  }

  private generateComprehensiveSummary(moduleResults: ModuleAnalysisResult[], severityBreakdown: SeverityBreakdown): string {
    const totalIssues = Object.values(severityBreakdown).reduce((sum, category) => sum + category.count, 0);
    const passedModules = moduleResults.filter(r => r.passed).length;
    
    return `Comprehensive analysis completed with ${this.modules.length} security modules. ` +
           `Found ${totalIssues} total issues across ${moduleResults.length} analysis categories. ` +
           `${passedModules}/${moduleResults.length} modules passed validation. ` +
           `${severityBreakdown.critical.count} critical and ${severityBreakdown.high.count} high severity issues require immediate attention.`;
  }

  private extractContractInfo(sourceCode: string) {
    return {
      isVerified: sourceCode.length > 100, // Simple check
      hasOwnable: /Ownable|onlyOwner/.test(sourceCode),
      hasMintable: /mint|_mint/.test(sourceCode),
      hasUpgradeable: /Upgradeable|Proxy|initialize/.test(sourceCode),
      compiler: sourceCode.match(/pragma solidity ([^;]+);/)?.[1] || 'unknown'
    };
  }

  private generateFreeReport(moduleResults: ModuleAnalysisResult[], riskScore: number) {
    const criticalIssues = moduleResults.flatMap(r => r.issues.filter(i => i.severity === 'CRITICAL'));
    const basicVulnerabilities = criticalIssues.slice(0, 3).map(i => i.description);
    
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    if (riskScore >= 80) riskLevel = 'CRITICAL';
    else if (riskScore >= 60) riskLevel = 'HIGH';
    else if (riskScore >= 40) riskLevel = 'MEDIUM';
    else riskLevel = 'LOW';

    return {
      summary: `Basic security analysis completed. Risk score: ${riskScore}/100. ${criticalIssues.length} critical issues detected.`,
      basicVulnerabilities,
      riskLevel
    };
  }

  private extractCriticalVulnerabilities(moduleResults: ModuleAnalysisResult[]): string[] {
    return moduleResults
      .flatMap(r => r.issues.filter(i => i.severity === 'CRITICAL'))
      .map(i => i.description);
  }

  private extractMediumVulnerabilities(moduleResults: ModuleAnalysisResult[]): string[] {
    return moduleResults
      .flatMap(r => r.issues.filter(i => i.severity === 'MEDIUM'))
      .map(i => i.description);
  }

  private extractSpywareRisks(moduleResults: ModuleAnalysisResult[]): string[] {
    const spywareKeywords = ['data collection', 'privacy', 'tracking', 'surveillance', 'personal information'];
    return moduleResults
      .flatMap(r => r.issues)
      .filter(i => spywareKeywords.some(keyword => i.description.toLowerCase().includes(keyword)))
      .map(i => i.description);
  }

  private extractHoneypotRisks(moduleResults: ModuleAnalysisResult[]): string[] {
    const honeypotKeywords = ['trading restriction', 'sell limitation', 'liquidity lock', 'transfer block'];
    return moduleResults
      .flatMap(r => r.issues)
      .filter(i => honeypotKeywords.some(keyword => i.description.toLowerCase().includes(keyword)))
      .map(i => i.description);
  }

  private extractBackdoorRisks(moduleResults: ModuleAnalysisResult[]): string[] {
    const backdoorKeywords = ['hidden function', 'admin access', 'owner control', 'backdoor', 'unauthorized access'];
    return moduleResults
      .flatMap(r => r.issues)
      .filter(i => backdoorKeywords.some(keyword => i.description.toLowerCase().includes(keyword)))
      .map(i => i.description);
  }

  private generateAllRecommendations(moduleResults: ModuleAnalysisResult[]): string[] {
    const allRecommendations = moduleResults.flatMap(r => r.recommendations);
    // Remove duplicates and return top 20
    return [...new Set(allRecommendations)].slice(0, 20);
  }

  private generateDetailedAnalysis(moduleResults: ModuleAnalysisResult[]): string {
    const analysis = moduleResults.map(result => {
      return `${result.moduleName} (${result.category}): ${result.details} ` +
             `Score: ${result.score}/100. ${result.issues.length} issues found.`;
    }).join('\n\n');

    return `Detailed Technical Analysis:\n\n${analysis}\n\n` +
           `This comprehensive analysis covers ${moduleResults.length} security domains including ` +
           `gas optimization, reentrancy protection, access control, oracle security, ` +
           `flash loan protection, liquidity pool security, upgradeability patterns, ` +
           `rug pull indicators, governance mechanisms, formal verification, ` +
           `behavioral analysis, dependency security, cross-contract interactions, ` +
           `exploit pattern matching, economic attack vectors, tokenomics analysis, ` +
           `severity classification, and developer reputation assessment.`;
  }
}

export const enhancedAuditService = new EnhancedAuditService();