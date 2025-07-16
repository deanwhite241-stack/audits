import React, { useState, useEffect } from 'react';
import { Shield, Wallet, User, Menu, X } from 'lucide-react';
import { web3Service } from '../services/web3';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState<string>('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (web3Service.isConnected()) {
      try {
        const address = await web3Service.getAddress();
        setUserAddress(address);
        setIsConnected(true);
      } catch (error) {
        console.error('Failed to get address:', error);
      }
    }
  };

  const connectWallet = async () => {
    try {
      const address = await web3Service.connect();
      setUserAddress(address);
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
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
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Audit
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === 'dashboard'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Dashboard
            </button>
            <button className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Pricing
            </button>
            <button className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Docs
            </button>
          </nav>

          {/* Connect Wallet Button */}
          <div className="flex items-center space-x-4">
            {isConnected ? (
              <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg">
                <Wallet className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">
                  {formatAddress(userAddress)}
                </span>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
              >
                <Wallet className="h-4 w-4" />
                <span>Connect Wallet</span>
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              <button
                onClick={() => { onNavigate('home'); setIsMenuOpen(false); }}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 w-full text-left"
              >
                Audit
              </button>
              <button
                onClick={() => { onNavigate('dashboard'); setIsMenuOpen(false); }}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 w-full text-left"
              >
                Dashboard
              </button>
              <button className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 w-full text-left">
                Pricing
              </button>
              <button className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 w-full text-left">
                Docs
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};