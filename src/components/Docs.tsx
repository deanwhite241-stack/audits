import React from 'react';
import { 
  Search, 
  Shield, 
  Wallet, 
  FileText, 
  Download, 
  CheckCircle, 
  AlertTriangle,
  Copy,
  ExternalLink,
  Zap,
  Lock,
  Eye,
  CreditCard
} from 'lucide-react';

export const Docs: React.FC = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const steps = [
    {
      number: 1,
      title: "Enter Contract Address",
      description: "Paste any Ethereum contract address into the search box on the homepage",
      icon: Search,
      details: [
        "Must be a valid Ethereum address format (0x...)",
        "Works with both verified and unverified contracts",
        "Supports all EVM-compatible chains"
      ],
      example: "0xA0b86a33E6441d1E3c7B6C47A1B5Ad4b2e86A24e"
    },
    {
      number: 2,
      title: "Get Free Analysis",
      description: "Receive instant basic security analysis at no cost",
      icon: Shield,
      details: [
        "Basic vulnerability detection",
        "Risk score from 0-100",
        "Contract verification status",
        "Ownership and upgrade information"
      ]
    },
    {
      number: 3,
      title: "Connect Wallet (Optional)",
      description: "Connect MetaMask to unlock premium features and save audit history",
      icon: Wallet,
      details: [
        "Save your audit history",
        "Access premium reports",
        "Pay for advanced analysis",
        "Export PDF certificates"
      ]
    },
    {
      number: 4,
      title: "Upgrade to Pro ($500)",
      description: "Unlock comprehensive AI-powered security analysis",
      icon: Lock,
      details: [
        "Advanced spyware detection",
        "Backdoor vulnerability analysis",
        "Honeypot risk assessment",
        "Detailed recommendations",
        "PDF export and Gold ESR certification"
      ]
    }
  ];

  const features = [
    {
      title: "Multi-Chain Support",
      description: "Analyze contracts across 17+ blockchain networks",
      icon: Zap,
      chains: ["Ethereum", "BSC", "Polygon", "Arbitrum", "Base", "ESR"]
    },
    {
      title: "AI-Powered Analysis",
      description: "Advanced machine learning detects hidden vulnerabilities",
      icon: Shield,
      capabilities: ["Spyware Detection", "Backdoor Analysis", "Honeypot Identification"]
    },
    {
      title: "Instant Results",
      description: "Get security reports in under 30 seconds",
      icon: Zap,
      metrics: ["< 30s scan time", "95% accuracy", "Real-time analysis"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            How to Use <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">ContractGuard</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Simple step-by-step guide to analyzing smart contract security with our AI-powered platform
          </p>
        </div>

        {/* Quick Start */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Zap className="h-6 w-6 mr-3 text-yellow-400" />
            Quick Start (30 seconds)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-500/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-400 font-bold">1</span>
              </div>
              <h3 className="font-semibold text-white mb-2">Paste Address</h3>
              <p className="text-gray-300 text-sm">Enter any contract address</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-500/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-400 font-bold">2</span>
              </div>
              <h3 className="font-semibold text-white mb-2">Click Analyze</h3>
              <p className="text-gray-300 text-sm">Get instant free report</p>
            </div>
            <div className="text-center">
              <div className="bg-green-500/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-green-400 font-bold">3</span>
              </div>
              <h3 className="font-semibold text-white mb-2">View Results</h3>
              <p className="text-gray-300 text-sm">See security analysis</p>
            </div>
          </div>
        </div>

        {/* Detailed Steps */}
        <div className="space-y-8 mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Detailed Guide
          </h2>
          
          {steps.map((step, index) => (
            <div key={step.number} className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full w-12 h-12 flex items-center justify-center">
                    <step.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                      Step {step.number}
                    </span>
                    <h3 className="text-xl font-bold text-white">{step.title}</h3>
                  </div>
                  
                  <p className="text-gray-300 mb-4">{step.description}</p>
                  
                  <ul className="space-y-2 mb-4">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center space-x-2 text-gray-300">
                        <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                        <span className="text-sm">{detail}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {step.example && (
                    <div className="bg-slate-800/50 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Example:</span>
                        <button
                          onClick={() => copyToClipboard(step.example!)}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                      <code className="text-blue-300 font-mono text-sm">{step.example}</code>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Features Overview */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Platform Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-2">
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-white">{feature.title}</h3>
                </div>
                
                <p className="text-gray-300 text-sm mb-4">{feature.description}</p>
                
                {feature.chains && (
                  <div className="space-y-1">
                    {feature.chains.map((chain, chainIndex) => (
                      <span key={chainIndex} className="inline-block bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs mr-2 mb-1">
                        {chain}
                      </span>
                    ))}
                  </div>
                )}
                
                {feature.capabilities && (
                  <ul className="space-y-1">
                    {feature.capabilities.map((capability, capIndex) => (
                      <li key={capIndex} className="flex items-center space-x-2">
                        <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                        <span className="text-gray-300 text-xs">{capability}</span>
                      </li>
                    ))}
                  </ul>
                )}
                
                {feature.metrics && (
                  <div className="grid grid-cols-1 gap-2">
                    {feature.metrics.map((metric, metricIndex) => (
                      <div key={metricIndex} className="bg-green-500/10 border border-green-500/20 rounded px-2 py-1">
                        <span className="text-green-300 text-xs font-medium">{metric}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="font-semibold text-white mb-3 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-yellow-400" />
                What types of vulnerabilities can you detect?
              </h3>
              <p className="text-gray-300 text-sm">
                Our AI detects reentrancy attacks, integer overflows, access control issues, backdoors, 
                honeypots, spyware, hidden malicious functions, and many other security vulnerabilities.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="font-semibold text-white mb-3 flex items-center">
                <Eye className="h-5 w-5 mr-2 text-blue-400" />
                Do you work with unverified contracts?
              </h3>
              <p className="text-gray-300 text-sm">
                Yes! We can analyze both verified source code and unverified bytecode. 
                Our AI can decompile and analyze contracts even without source code.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="font-semibold text-white mb-3 flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-green-400" />
                How does payment work?
              </h3>
              <p className="text-gray-300 text-sm">
                Pay $500 per comprehensive audit using ETH or USDT through MetaMask. 
                No subscriptions or hidden fees. Free basic analysis is always available.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="font-semibold text-white mb-3 flex items-center">
                <Download className="h-5 w-5 mr-2 text-purple-400" />
                Can I export my audit reports?
              </h3>
              <p className="text-gray-300 text-sm">
                Yes! Pro plan users can export detailed PDF reports and receive Gold ESR certificates 
                for contracts that pass our comprehensive security standards.
              </p>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Need Help?
          </h2>
          <p className="text-gray-300 mb-6">
            Our team is here to help you secure your smart contracts
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center space-x-2">
              <ExternalLink className="h-4 w-4" />
              <span>Contact Support</span>
            </button>
            <button className="bg-white/10 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/20 transition-all duration-200 flex items-center justify-center space-x-2 border border-white/20">
              <FileText className="h-4 w-4" />
              <span>View Examples</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};