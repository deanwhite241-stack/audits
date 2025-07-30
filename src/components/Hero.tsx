import React from 'react';
import { Shield, Zap, Search, Lock } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 py-16 sm:py-20">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            <span className="block">AI-Powered</span>
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Smart Contract Security Platform
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Professional smart contract security analysis with 35 specialized modules. 
            Detect vulnerabilities, economic risks, and behavioral anomalies with advanced AI.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Shield className="h-5 w-5 text-blue-400" />
              <span className="text-sm font-medium text-white">35 Security Modules</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Zap className="h-5 w-5 text-purple-400" />
              <span className="text-sm font-medium text-white">Professional Analysis</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Search className="h-5 w-5 text-green-400" />
              <span className="text-sm font-medium text-white">DeFi & Economic Security</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Lock className="h-5 w-5 text-red-400" />
              <span className="text-sm font-medium text-white">Behavioral Analysis</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="text-3xl font-bold text-blue-400 mb-2">35</div>
              <div className="text-gray-300">Security Modules</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="text-3xl font-bold text-purple-400 mb-2">20+</div>
              <div className="text-gray-300">Analysis Categories</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="text-3xl font-bold text-green-400 mb-2">&lt; 30s</div>
              <div className="text-gray-300">Professional Report</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};