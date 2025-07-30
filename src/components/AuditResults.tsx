import React, { useState } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  XCircle, 
  Lock, 
  Unlock, 
  Download,
  Eye,
  EyeOff,
  TrendingUp,
  Bug,
  Zap,
  FileText,
  BarChart3,
  Target,
  Activity,
  Layers,
  Settings,
  Users,
  Clock,
  Database,
  Network,
  Cpu,
  DollarSign,
  Award,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { AuditResult } from '../types';
import { PaymentModal } from './PaymentModal';

interface AuditResultsProps {
  result: AuditResult;
  onPaymentSuccess: () => void;
}

export const AuditResults: React.FC<AuditResultsProps> = ({ result, onPaymentSuccess }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showFullReport, setShowFullReport] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'LOW': return 'text-green-600 bg-green-50';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50';
      case 'HIGH': return 'text-orange-600 bg-orange-50';
      case 'CRITICAL': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const toggleModuleExpansion = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const getModuleIcon = (category: string) => {
    switch (category) {
      case 'Performance': return Zap;
      case 'Security': return Shield;
      case 'Architecture': return Layers;
      case 'Trust & Security': return Users;
      case 'Governance': return Settings;
      case 'Analysis': return BarChart3;
      case 'Testing': return Target;
      case 'Behavioral Analysis': return Activity;
      case 'Integration Security': return Network;
      case 'Threat Intelligence': return AlertTriangle;
      case 'Economic Security': return DollarSign;
      case 'Trust Analysis': return Award;
      case 'DeFi Security': return Database;
      default: return Info;
    }
  };

  const exportToPDF = () => {
    // Mock PDF export functionality
    console.log('Exporting to PDF...');
    // In production, use libraries like jsPDF or react-pdf
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Security Analysis Report</h2>
            <p className="text-sm text-gray-600 font-mono">{result.contractAddress}</p>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${getRiskScoreColor(result.riskScore)}`}>
              {result.riskScore}
            </div>
            <div className="text-sm text-gray-500">Risk Score</div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-xl font-bold text-red-600">{result.issueCount.critical}</div>
            <div className="text-sm text-gray-600">Critical</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-xl font-bold text-orange-600">{result.issueCount.medium}</div>
            <div className="text-sm text-gray-600">Medium</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-xl font-bold text-yellow-600">{result.issueCount.low}</div>
            <div className="text-sm text-gray-600">Low</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-xl font-bold text-blue-600">{result.issueCount.informational}</div>
            <div className="text-sm text-gray-600">Info</div>
          </div>
        </div>
      </div>

      {/* Contract Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Info className="h-5 w-5 mr-2 text-blue-600" />
          Contract Information
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            {result.contractInfo.isVerified ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            <span className="text-sm">
              {result.contractInfo.isVerified ? 'Verified' : 'Unverified'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {result.contractInfo.hasOwnable ? (
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            ) : (
              <CheckCircle className="h-5 w-5 text-green-500" />
            )}
            <span className="text-sm">
              {result.contractInfo.hasOwnable ? 'Has Owner' : 'No Owner'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {result.contractInfo.hasMintable ? (
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            ) : (
              <CheckCircle className="h-5 w-5 text-green-500" />
            )}
            <span className="text-sm">
              {result.contractInfo.hasMintable ? 'Mintable' : 'Fixed Supply'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {result.contractInfo.hasUpgradeable ? (
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            ) : (
              <CheckCircle className="h-5 w-5 text-green-500" />
            )}
            <span className="text-sm">
              {result.contractInfo.hasUpgradeable ? 'Upgradeable' : 'Immutable'}
            </span>
          </div>
        </div>
      </div>

      {/* Free Report */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Shield className="h-5 w-5 mr-2 text-blue-600" />
          Basic Security Analysis
        </h3>
        
        <div className="space-y-4">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(result.freeReport.riskLevel)}`}>
            <TrendingUp className="h-4 w-4 mr-1" />
            Risk Level: {result.freeReport.riskLevel}
          </div>
          
          <p className="text-gray-700">{result.freeReport.summary}</p>
          
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Basic Vulnerabilities Detected:</h4>
            <ul className="space-y-1">
              {result.freeReport.basicVulnerabilities.map((vuln, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <Bug className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{vuln}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Premium Report Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                Premium Security Analysis - 35 Professional Modules
              </h3>
              <p className="text-blue-100 text-sm mt-1">
                Complete security audit with 35 professional modules including advanced AI analysis
              </p>
            </div>
            {result.isPaid ? (
              <button
                onClick={() => setShowFullReport(!showFullReport)}
                className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
              >
                {showFullReport ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span>{showFullReport ? 'Hide' : 'Show'} Report</span>
              </button>
            ) : (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center space-x-2"
              >
                <Unlock className="h-4 w-4" />
                <span>Unlock for 0.01 ETH</span>
              </button>
            )}
          </div>
        </div>

        {result.isPaid && showFullReport && result.premiumReport && (
          <div className="p-6 space-y-8">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-xl font-semibold text-gray-900">Complete Security Analysis - 35 Modules</h4>
              <button
                onClick={exportToPDF}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export PDF</span>
              </button>
            </div>

            {/* Enhanced Module Results */}
            {result.premiumReport.moduleResults && (
              <div className="space-y-6">
                <h5 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Layers className="h-5 w-5 mr-2 text-purple-600" />
                  Professional Security Modules ({result.premiumReport.moduleResults.length})
                </h5>
                
                {/* Module Categories */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {Object.entries(
                    result.premiumReport.moduleResults.reduce((acc, module) => {
                      if (!acc[module.category]) acc[module.category] = [];
                      acc[module.category].push(module);
                      return acc;
                    }, {} as Record<string, any[]>)
                  ).map(([category, modules]) => (
                    <div key={category} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        {React.createElement(getModuleIcon(category), { className: "h-4 w-4 text-blue-600" })}
                        <span className="font-medium text-gray-900">{category}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {modules.length} modules • {modules.filter(m => m.passed).length} passed
                      </div>
                    </div>
                  ))}
                </div>

                {/* Individual Module Results */}
                <div className="space-y-4">
                  {result.premiumReport.moduleResults.map((module, index) => (
                    <div key={module.moduleId} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div 
                        className={`p-4 cursor-pointer transition-colors ${
                          module.passed ? 'bg-green-50 hover:bg-green-100' : 'bg-red-50 hover:bg-red-100'
                        }`}
                        onClick={() => toggleModuleExpansion(module.moduleId)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {React.createElement(getModuleIcon(module.category), { 
                              className: `h-5 w-5 ${module.passed ? 'text-green-600' : 'text-red-600'}` 
                            })}
                            <div>
                              <h6 className="font-medium text-gray-900">{module.moduleName}</h6>
                              <p className="text-sm text-gray-600">{module.category}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="text-right">
                              <div className={`text-lg font-bold ${getRiskScoreColor(module.score)}`}>
                                {module.score}
                              </div>
                              <div className="text-xs text-gray-500">Score</div>
                            </div>
                            <div className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(module.riskLevel)}`}>
                              {module.riskLevel}
                            </div>
                            {expandedModules.has(module.moduleId) ? 
                              <ChevronUp className="h-4 w-4 text-gray-400" /> : 
                              <ChevronDown className="h-4 w-4 text-gray-400" />
                            }
                          </div>
                        </div>
                      </div>
                      
                      {expandedModules.has(module.moduleId) && (
                        <div className="p-4 border-t border-gray-200 bg-white">
                          <div className="space-y-4">
                            <p className="text-sm text-gray-700">{module.details}</p>
                            
                            {module.issues.length > 0 && (
                              <div>
                                <h7 className="font-medium text-gray-900 mb-2 block">Issues Found ({module.issues.length})</h7>
                                <div className="space-y-2">
                                  {module.issues.map((issue, issueIndex) => (
                                    <div key={issueIndex} className={`p-3 rounded-lg border-l-4 ${
                                      issue.severity === 'CRITICAL' ? 'bg-red-50 border-red-400' :
                                      issue.severity === 'HIGH' ? 'bg-orange-50 border-orange-400' :
                                      issue.severity === 'MEDIUM' ? 'bg-yellow-50 border-yellow-400' :
                                      'bg-blue-50 border-blue-400'
                                    }`}>
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                          <div className="flex items-center space-x-2 mb-1">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(issue.severity)}`}>
                                              {issue.severity}
                                            </span>
                                            <span className="text-sm font-medium text-gray-900">{issue.description}</span>
                                          </div>
                                          {issue.code && (
                                            <div className="bg-gray-100 rounded p-2 mt-2">
                                              <code className="text-xs text-gray-800">{issue.code}</code>
                                            </div>
                                          )}
                                          {issue.fix && (
                                            <div className="mt-2 text-sm text-green-700">
                                              <strong>Fix:</strong> {issue.fix}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {module.recommendations.length > 0 && (
                              <div>
                                <h7 className="font-medium text-gray-900 mb-2 block">Recommendations</h7>
                                <ul className="space-y-1">
                                  {module.recommendations.map((rec, recIndex) => (
                                    <li key={recIndex} className="flex items-start space-x-2">
                                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                      <span className="text-sm text-gray-700">{rec}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {module.gasImpact && (
                              <div className="bg-blue-50 rounded-lg p-3">
                                <div className="flex items-center space-x-2">
                                  <Zap className="h-4 w-4 text-blue-600" />
                                  <span className="text-sm font-medium text-blue-900">
                                    Estimated Gas Impact: {module.gasImpact.toLocaleString()} gas
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced Analytics */}
            {result.premiumReport.severityBreakdown && (
              <div className="space-y-6">
                <h5 className="text-lg font-semibold text-gray-900 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                  Security Analytics Dashboard
                </h5>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Severity Breakdown */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h6 className="font-medium text-gray-900 mb-3">Issue Distribution</h6>
                    <div className="space-y-2">
                      {Object.entries(result.premiumReport.severityBreakdown).map(([severity, data]) => (
                        <div key={severity} className="flex items-center justify-between">
                          <span className="text-sm capitalize text-gray-600">{severity}</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(severity.toUpperCase())}`}>
                            {data.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Security Score */}
                  {result.premiumReport.securityScore && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h6 className="font-medium text-gray-900 mb-3">Security Score</h6>
                      <div className="text-center">
                        <div className={`text-3xl font-bold ${getRiskScoreColor(result.premiumReport.securityScore.overall)}`}>
                          {Math.round(result.premiumReport.securityScore.overall)}
                        </div>
                        <div className="text-sm text-gray-500">Overall Score</div>
                      </div>
                      <div className="mt-3 space-y-1">
                        {Object.entries(result.premiumReport.securityScore.categories).map(([category, score]) => (
                          <div key={category} className="flex items-center justify-between text-xs">
                            <span className="capitalize text-gray-600">{category}</span>
                            <span className={getRiskScoreColor(score)}>{Math.round(score)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Gas Optimization */}
                  {result.premiumReport.gasOptimization && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h6 className="font-medium text-gray-900 mb-3">Gas Optimization</h6>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Optimizations</span>
                          <span className="font-medium">{result.premiumReport.gasOptimization.totalOptimizations}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Est. Savings</span>
                          <span className="font-medium text-green-600">
                            {result.premiumReport.gasOptimization.estimatedSavings.toLocaleString()} gas
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Critical Vulnerabilities */}
            <div className="space-y-3">
              <h5 className="font-medium text-red-600 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Critical Vulnerabilities
              </h5>
              <ul className="space-y-2">
                {result.premiumReport.criticalVulnerabilities.map((vuln, index) => (
                  <li key={index} className="flex items-start space-x-2 bg-red-50 p-3 rounded-lg">
                    <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{vuln}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Spyware Risks */}
            <div className="space-y-3">
              <h5 className="font-medium text-purple-600 flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                Spyware & Privacy Risks
              </h5>
              <ul className="space-y-2">
                {result.premiumReport.spywareRisks.map((risk, index) => (
                  <li key={index} className="flex items-start space-x-2 bg-purple-50 p-3 rounded-lg">
                    <Eye className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{risk}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Honeypot Risks */}
            <div className="space-y-3">
              <h5 className="font-medium text-orange-600 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Honeypot Risks
              </h5>
              <ul className="space-y-2">
                {result.premiumReport.honeypotRisks.map((risk, index) => (
                  <li key={index} className="flex items-start space-x-2 bg-orange-50 p-3 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{risk}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Backdoor Risks */}
            <div className="space-y-3">
              <h5 className="font-medium text-red-600 flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                Backdoor Risks
              </h5>
              <ul className="space-y-2">
                {result.premiumReport.backdoorRisks.map((risk, index) => (
                  <li key={index} className="flex items-start space-x-2 bg-red-50 p-3 rounded-lg">
                    <Lock className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{risk}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="space-y-3">
              <h5 className="font-medium text-green-600 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Recommendations
              </h5>
              <ul className="space-y-2">
                {result.premiumReport.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start space-x-2 bg-green-50 p-3 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Detailed Analysis */}
            <div className="space-y-3">
              <h5 className="font-medium text-blue-600 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Detailed Technical Analysis
              </h5>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">{result.premiumReport.detailedAnalysis}</p>
              </div>
            </div>
          </div>
        )}

        {!result.isPaid && (
          <div className="p-6 bg-gray-50 border-t">
            <div className="text-center space-y-4">
              <div className="text-6xl opacity-20">
                <Lock className="h-16 w-16 mx-auto text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">
                Unlock 35 Professional Security Modules
              </h4>
              <p className="text-gray-600 max-w-md mx-auto">
                Get access to all 35 professional security modules including advanced AI analysis, 
                gas optimization, formal verification, economic attack simulation, and comprehensive reporting.
              </p>
              <ul className="text-sm text-gray-600 space-y-1 max-w-md mx-auto">
                <li>• 20 Advanced Security Modules (Gas, Reentrancy, Access Control, etc.)</li>
                <li>• 8 DeFi Security Modules (Flash Loans, Oracle, AMM, etc.)</li>
                <li>• 4 Economic Analysis Modules (Tokenomics, Attack Simulation, etc.)</li>
                <li>• 3 Behavioral Analysis Modules (On-chain, Reputation, etc.)</li>
                <li>• Professional PDF Report with Executive Summary</li>
              </ul>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 mx-auto"
              >
                <Unlock className="h-5 w-5" />
                <span>Unlock 35 Modules for 0.01 ETH</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          contractAddress={result.contractAddress}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            setShowPaymentModal(false);
            onPaymentSuccess();
          }}
        />
      )}
    </div>
  );
};