import React, { useState } from 'react';
import { Search, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface AuditFormProps {
  onSubmit: (address: string) => void;
  isLoading: boolean;
}

export const AuditForm: React.FC<AuditFormProps> = ({ onSubmit, isLoading }) => {
  const [contractAddress, setContractAddress] = useState('');
  const [error, setError] = useState('');

  const validateAddress = (address: string): boolean => {
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    return ethAddressRegex.test(address);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!contractAddress.trim()) {
      setError('Please enter a contract address');
      return;
    }

    if (!validateAddress(contractAddress)) {
      setError('Please enter a valid Ethereum contract address');
      return;
    }

    onSubmit(contractAddress);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setContractAddress(value);
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="flex">
            <input
              type="text"
              value={contractAddress}
              onChange={handleAddressChange}
              placeholder="Enter contract address (0x...)"
              className={`flex-1 px-4 py-3 pl-12 text-lg border-2 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                error 
                  ? 'border-red-400 bg-red-500/10 text-white placeholder-red-300' 
                  : 'border-white/20 bg-white/10 text-white placeholder-gray-400 hover:border-white/30'
              }`}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !contractAddress.trim()}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-r-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Clock className="h-5 w-5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  <span>Analyze</span>
                </>
              )}
            </button>
          </div>
          
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-red-400 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span className="text-gray-300">Free basic analysis</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span className="text-gray-300">Works with verified & unverified contracts</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span className="text-gray-300">AI-powered vulnerability detection</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span className="text-gray-300">Instant security score</span>
          </div>
        </div>
      </form>

      <div className="mt-8 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
        <h3 className="font-medium text-blue-300 mb-2">Try these example contracts:</h3>
        <div className="space-y-2">
          <button
            onClick={() => setContractAddress('0xA0b86a33E6441d1E3c7B6C47A1B5Ad4b2e86A24e')}
            className="block w-full text-left text-sm text-blue-400 hover:text-blue-300 font-mono bg-white/5 px-3 py-2 rounded border border-white/10 hover:border-blue-400/30 transition-colors"
          >
            0xA0b86a33E6441d1E3c7B6C47A1B5Ad4b2e86A24e
          </button>
          <button
            onClick={() => setContractAddress('0x6B175474E89094C44Da98b954EedeAC495271d0F')}
            className="block w-full text-left text-sm text-blue-400 hover:text-blue-300 font-mono bg-white/5 px-3 py-2 rounded border border-white/10 hover:border-blue-400/30 transition-colors"
          >
            0x6B175474E89094C44Da98b954EedeAC495271d0F
          </button>
        </div>
      </div>
    </div>
  );
};