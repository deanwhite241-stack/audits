import React, { useState, useEffect } from 'react';
import { Shield, Wallet, User, Menu, X } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { address, isConnected } = useAccount();

  return (
    <header className="bg-slate-900/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ContractGuard
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => onNavigate('home')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === 'home'
                  ? 'text-blue-400 bg-blue-500/20'
                  : 'text-gray-300 hover:text-blue-400'
              }`}
            >
              Audit
            </button>
            <button
              onClick={() => onNavigate('projects')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === 'projects'
                  ? 'text-blue-400 bg-blue-500/20'
                  : 'text-gray-300 hover:text-blue-400'
              }`}
            >
              Projects
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === 'dashboard'
                  ? 'text-blue-400 bg-blue-500/20'
                  : 'text-gray-300 hover:text-blue-400'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onNavigate('submit')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === 'submit'
                  ? 'text-blue-400 bg-blue-500/20'
                  : 'text-gray-300 hover:text-blue-400'
              }`}
            >
              Submit Project
            </button>
            <button
              onClick={() => onNavigate('pricing')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === 'pricing'
                  ? 'text-blue-400 bg-blue-500/20'
                  : 'text-gray-300 hover:text-blue-400'
              }`}
            >
              Pricing
            </button>
            <button
              onClick={() => onNavigate('docs')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === 'docs'
                  ? 'text-blue-400 bg-blue-500/20'
                  : 'text-gray-300 hover:text-blue-400'
              }`}
            >
              Docs
            </button>
          </nav>

          {/* Connect Wallet Button */}
          <div className="flex items-center space-x-4">
            <ConnectButton />

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-300 hover:text-blue-400 hover:bg-white/10"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-800/95 border-t border-white/10">
              <button
                onClick={() => { onNavigate('home'); setIsMenuOpen(false); }}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-blue-400 hover:bg-white/10 w-full text-left"
              >
                Audit
              </button>
              <button
                onClick={() => { onNavigate('projects'); setIsMenuOpen(false); }}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-blue-400 hover:bg-white/10 w-full text-left"
              >
                Projects
              </button>
              <button
                onClick={() => { onNavigate('dashboard'); setIsMenuOpen(false); }}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-blue-400 hover:bg-white/10 w-full text-left"
              >
                Dashboard
              </button>
              <button
                onClick={() => { onNavigate('submit'); setIsMenuOpen(false); }}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-blue-400 hover:bg-white/10 w-full text-left"
              >
                Submit Project
              </button>
              <button
                onClick={() => { onNavigate('pricing'); setIsMenuOpen(false); }}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-blue-400 hover:bg-white/10 w-full text-left"
              >
                Pricing
              </button>
              <button
                onClick={() => { onNavigate('docs'); setIsMenuOpen(false); }}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-blue-400 hover:bg-white/10 w-full text-left"
              >
                Docs
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};