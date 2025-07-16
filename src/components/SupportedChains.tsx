import React from 'react';
import { Link, Shield, Zap } from 'lucide-react';

export const SupportedChains: React.FC = () => {
  const chains = [
    {
      name: 'Ethereum',
      networks: ['Mainnet', 'Goerli', 'Sepolia'],
      color: 'from-blue-400 to-blue-600',
      icon: '⟠'
    },
    {
      name: 'BNB Smart Chain',
      networks: ['Mainnet', 'Testnet'],
      color: 'from-yellow-400 to-yellow-600',
      icon: '⬢'
    },
    {
      name: 'Polygon',
      networks: ['Mainnet', 'Mumbai Testnet'],
      color: 'from-purple-400 to-purple-600',
      icon: '⬟'
    },
    {
      name: 'Arbitrum',
      networks: ['One', 'Sepolia'],
      color: 'from-cyan-400 to-cyan-600',
      icon: '◆'
    },
    {
      name: 'Avalanche C-Chain',
      networks: ['Mainnet', 'Fuji'],
      color: 'from-red-400 to-red-600',
      icon: '▲'
    },
    {
      name: 'Fantom',
      networks: ['Mainnet', 'Testnet'],
      color: 'from-blue-400 to-indigo-600',
      icon: '👻'
    },
    {
      name: 'Cronos',
      networks: ['Mainnet'],
      color: 'from-indigo-400 to-indigo-600',
      icon: '⚡'
    },
    {
      name: 'Base',
      networks: ['Mainnet'],
      color: 'from-blue-400 to-blue-600',
      icon: '🔵'
    },
    {
      name: 'ZetaChain',
      networks: ['Mainnet'],
      color: 'from-green-400 to-green-600',
      icon: 'Ζ'
    },
    {
      name: 'PulseChain',
      networks: ['Mainnet'],
      color: 'from-pink-400 to-pink-600',
      icon: '💗'
    },
    {
      name: 'Core DAO',
      networks: ['Mainnet'],
      color: 'from-orange-400 to-orange-600',
      icon: '🔶'
    },
    {
      name: 'DogeChain',
      networks: ['Mainnet'],
      color: 'from-yellow-400 to-yellow-600',
      icon: '🐕'
    },
    {
      name: 'AlveyChain',
      networks: ['Mainnet'],
      color: 'from-teal-400 to-teal-600',
      icon: '🔗'
    },
    {
      name: 'Unichain',
      networks: ['Mainnet'],
      color: 'from-pink-400 to-purple-600',
      icon: '🦄'
    },
    {
      name: 'Bitrock',
      networks: ['Mainnet'],
      color: 'from-gray-400 to-gray-600',
      icon: '⛏️'
    },
    {
      name: 'OpenGPU',
      networks: ['Mainnet'],
      color: 'from-emerald-400 to-emerald-600',
      icon: '🖥️'
    },
    {
      name: 'ESR',
      networks: ['Mainnet', 'Testnet'],
      color: 'from-violet-400 to-violet-600',
      icon: '⚡',
      featured: true
    }
  ];

  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 py-20">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Supported Blockchain Networks
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive smart contract analysis across 17+ blockchain networks. 
            From Ethereum to emerging chains, we've got you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chains.map((chain, index) => (
            <div
              key={chain.name}
              className={`relative group ${
                chain.featured 
                  ? 'bg-gradient-to-br from-violet-500/20 to-purple-600/20 border-2 border-violet-400/30' 
                  : 'bg-white/5 border border-white/10'
              } backdrop-blur-sm rounded-xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
            >
              {chain.featured && (
                <div className="absolute -top-3 -right-3">
                  <div className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                    <Shield className="h-3 w-3" />
                    <span>FEATURED</span>
                  </div>
                </div>
              )}
              
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`text-2xl p-2 rounded-lg bg-gradient-to-r ${chain.color} text-white flex items-center justify-center w-12 h-12`}>
                    {chain.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                      {chain.name}
                    </h3>
                    <div className="flex items-center space-x-1 text-sm text-gray-400">
                      <Link className="h-3 w-3" />
                      <span>{chain.networks.length} network{chain.networks.length > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
                
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Zap className="h-5 w-5 text-yellow-400" />
                </div>
              </div>

              <div className="space-y-2">
                {chain.networks.map((network, networkIndex) => (
                  <div
                    key={network}
                    className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2 border border-white/5"
                  >
                    <span className="text-sm text-gray-300">{network}</span>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Smart Contract Analysis</span>
                  <span className="text-green-400 font-medium">✓ Active</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-4">
              Multi-Chain Security Analysis
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Our AI-powered auditing system seamlessly analyzes smart contracts across all supported networks, 
              providing consistent security insights regardless of the blockchain.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">17+</div>
                <div className="text-gray-300">Supported Chains</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">50+</div>
                <div className="text-gray-300">Network Variants</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">99.9%</div>
                <div className="text-gray-300">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};