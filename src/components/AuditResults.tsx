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
  FileText
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
                Premium Security Analysis
              </h3>
              <p className="text-blue-100 text-sm mt-1">
                Get comprehensive spyware, backdoor, and honeypot detection
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
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Full Security Report</h4>
              <button
                onClick={exportToPDF}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export PDF</span>
              </button>
            </div>

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
                Unlock Complete Security Analysis
              </h4>
              <p className="text-gray-600 max-w-md mx-auto">
                Get detailed spyware detection, backdoor analysis, honeypot identification, 
                and comprehensive security recommendations.
              </p>
              <ul className="text-sm text-gray-600 space-y-1 max-w-md mx-auto">
                <li>• Advanced AI-powered vulnerability detection</li>
                <li>• Spyware and malicious code analysis</li>
                <li>• Honeypot and backdoor identification</li>
                <li>• Detailed security recommendations</li>
                <li>• Exportable PDF report</li>
              </ul>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 mx-auto"
              >
                <Unlock className="h-5 w-5" />
                <span>Unlock for 0.01 ETH</span>
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