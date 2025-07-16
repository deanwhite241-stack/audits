import React from 'react';
import { 
  Check, 
  X, 
  Shield, 
  Zap, 
  Star, 
  AlertTriangle, 
  Eye, 
  Lock, 
  Download,
  FileText,
  Bug,
  Search,
  Award,
  Clock
} from 'lucide-react';

export const Pricing: React.FC = () => {
  const plans = [
    {
      name: 'Free Plan',
      price: '$0',
      period: 'per audit',
      description: 'Basic security analysis for getting started',
      color: 'from-blue-600 to-blue-700',
      popular: false,
      features: [
        { name: 'Basic vulnerability scan', included: true, icon: Bug },
        { name: 'Contract verification status', included: true, icon: Shield },
        { name: 'Risk score (0-100)', included: true, icon: AlertTriangle },
        { name: 'Basic security summary', included: true, icon: FileText },
        { name: 'Contract ownership info', included: true, icon: Eye },
        { name: 'Instant results', included: true, icon: Zap },
        { name: 'Public audit history', included: true, icon: Clock },
        { name: 'Advanced spyware detection', included: false, icon: Search },
        { name: 'Backdoor analysis', included: false, icon: Lock },
        { name: 'Honeypot identification', included: false, icon: AlertTriangle },
        { name: 'Detailed recommendations', included: false, icon: Star },
        { name: 'PDF export', included: false, icon: Download },
        { name: 'Priority support', included: false, icon: Award }
      ]
    },
    {
      name: 'Pro Plan',
      price: '$500',
      period: 'per audit',
      description: 'Comprehensive AI-powered security analysis',
      color: 'from-purple-600 to-purple-700',
      popular: true,
      features: [
        { name: 'Everything in Free Plan', included: true, icon: Check },
        { name: 'Advanced spyware detection', included: true, icon: Search },
        { name: 'Backdoor vulnerability analysis', included: true, icon: Lock },
        { name: 'Honeypot risk assessment', included: true, icon: AlertTriangle },
        { name: 'Hidden malicious code detection', included: true, icon: Bug },
        { name: 'Privacy risk analysis', included: true, icon: Eye },
        { name: 'Detailed security recommendations', included: true, icon: Star },
        { name: 'Technical analysis report', included: true, icon: FileText },
        { name: 'Exportable PDF certificate', included: true, icon: Download },
        { name: 'Gold ESR certification eligible', included: true, icon: Award },
        { name: 'Priority email support', included: true, icon: Shield },
        { name: '30-day report access', included: true, icon: Clock },
        { name: 'API access (coming soon)', included: true, icon: Zap }
      ]
    }
  ];

  const comparisonFeatures = [
    {
      category: 'Basic Analysis',
      features: [
        { name: 'Contract verification check', free: true, pro: true },
        { name: 'Basic vulnerability scan', free: true, pro: true },
        { name: 'Risk score calculation', free: true, pro: true },
        { name: 'Ownership analysis', free: true, pro: true },
        { name: 'Token standard compliance', free: true, pro: true }
      ]
    },
    {
      category: 'Advanced Security',
      features: [
        { name: 'Spyware detection', free: false, pro: true },
        { name: 'Backdoor identification', free: false, pro: true },
        { name: 'Honeypot analysis', free: false, pro: true },
        { name: 'Hidden function detection', free: false, pro: true },
        { name: 'Privacy risk assessment', free: false, pro: true }
      ]
    },
    {
      category: 'Reporting & Export',
      features: [
        { name: 'Basic security summary', free: true, pro: true },
        { name: 'Detailed technical report', free: false, pro: true },
        { name: 'Security recommendations', free: false, pro: true },
        { name: 'PDF export', free: false, pro: true },
        { name: 'Gold ESR certification', free: false, pro: true }
      ]
    },
    {
      category: 'Support & Access',
      features: [
        { name: 'Community support', free: true, pro: true },
        { name: 'Priority email support', free: false, pro: true },
        { name: '7-day report access', free: true, pro: false },
        { name: '30-day report access', free: false, pro: true },
        { name: 'API access (beta)', free: false, pro: true }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Choose Your <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Security Plan</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From basic vulnerability scanning to comprehensive AI-powered analysis. 
            Choose the plan that fits your security needs.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border ${
                plan.popular 
                  ? 'border-purple-400/50 ring-2 ring-purple-400/20' 
                  : 'border-white/10'
              } hover:bg-white/10 transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center space-x-2">
                    <Star className="h-4 w-4" />
                    <span>MOST POPULAR</span>
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center mb-4">
                  <span className="text-5xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400 ml-2">{plan.period}</span>
                </div>
                <p className="text-gray-300">{plan.description}</p>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center space-x-3">
                    {feature.included ? (
                      <div className="flex-shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    ) : (
                      <div className="flex-shrink-0 w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center">
                        <X className="h-3 w-3 text-gray-400" />
                      </div>
                    )}
                    <span className={`text-sm ${feature.included ? 'text-white' : 'text-gray-500'}`}>
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg shadow-purple-500/25'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                }`}
              >
                {index === 0 ? 'Start Free Analysis' : 'Get Pro Analysis'}
              </button>
            </div>
          ))}
        </div>

        {/* Detailed Comparison Table */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-8 border-b border-white/10">
            <h2 className="text-2xl font-bold text-white text-center mb-2">
              Detailed Feature Comparison
            </h2>
            <p className="text-gray-300 text-center">
              See exactly what's included in each plan
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-6 text-white font-semibold">Features</th>
                  <th className="text-center p-6 text-white font-semibold">Free Plan</th>
                  <th className="text-center p-6 text-white font-semibold">Pro Plan</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((category, categoryIndex) => (
                  <React.Fragment key={category.category}>
                    <tr className="bg-white/5">
                      <td colSpan={3} className="p-4 text-blue-400 font-semibold text-sm uppercase tracking-wide">
                        {category.category}
                      </td>
                    </tr>
                    {category.features.map((feature, featureIndex) => (
                      <tr key={featureIndex} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-4 text-gray-300">{feature.name}</td>
                        <td className="p-4 text-center">
                          {feature.free ? (
                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-gray-500 mx-auto" />
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {feature.pro ? (
                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-gray-500 mx-auto" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-300">
              Everything you need to know about our pricing plans
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-3">
                What's included in the free plan?
              </h3>
              <p className="text-gray-300 text-sm">
                The free plan includes basic vulnerability scanning, risk scoring, contract verification status, 
                and a security summary. Perfect for initial contract assessment.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-3">
                Why choose the Pro plan?
              </h3>
              <p className="text-gray-300 text-sm">
                Pro plan offers advanced AI analysis including spyware detection, backdoor identification, 
                honeypot analysis, and comprehensive reporting with PDF export.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-3">
                How does payment work?
              </h3>
              <p className="text-gray-300 text-sm">
                Pay per audit using ETH or USDT through MetaMask. No subscriptions or hidden fees. 
                You only pay when you need comprehensive analysis.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-3">
                What is Gold ESR certification?
              </h3>
              <p className="text-gray-300 text-sm">
                Gold ESR certification is awarded to contracts that pass our most rigorous security standards. 
                Only available with Pro plan audits and featured in our verified projects library.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-12 border border-white/10">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Secure Your Smart Contract?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Start with our free analysis or get comprehensive protection with our Pro plan. 
              Your contract security is our priority.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200">
                Start Free Analysis
              </button>
              <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg shadow-purple-500/25">
                Get Pro Analysis - $500
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};