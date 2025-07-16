import React, { useState, useEffect } from 'react';
import { Clock, Shield, TrendingUp, Download, Eye, Lock, AlertTriangle } from 'lucide-react';
import { UserAudit } from '../types';
import { apiService } from '../services/api';
import { web3Service } from '../services/web3';

export const Dashboard: React.FC = () => {
  const [audits, setAudits] = useState<UserAudit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userAddress, setUserAddress] = useState<string>('');

  useEffect(() => {
    loadUserAudits();
  }, []);

  const loadUserAudits = async () => {
    try {
      if (web3Service.isConnected()) {
        const address = await web3Service.getAddress();
        setUserAddress(address);
        const userAudits = await apiService.getUserAudits(address);
        setAudits(userAudits);
      }
    } catch (error) {
      console.error('Failed to load user audits:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-600 bg-red-50';
    if (score >= 60) return 'text-orange-600 bg-orange-50';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  if (!web3Service.isConnected()) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6">
            Please connect your wallet to view your audit history and manage your reports.
          </p>
          <button
            onClick={() => web3Service.connect()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Audit Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Connected: <span className="font-mono text-blue-600">{formatAddress(userAddress)}</span>
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{audits.length}</div>
            <div className="text-sm text-gray-500">Total Audits</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {audits.filter(a => a.status === 'paid').length}
              </div>
              <div className="text-sm text-gray-500">Premium Audits</div>
            </div>
            <Lock className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {audits.filter(a => a.status === 'free').length}
              </div>
              <div className="text-sm text-gray-500">Free Audits</div>
            </div>
            <Eye className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {audits.filter(a => a.riskScore >= 70).length}
              </div>
              <div className="text-sm text-gray-500">High Risk</div>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Audits List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Audits</h2>
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your audits...</p>
          </div>
        ) : audits.length === 0 ? (
          <div className="p-8 text-center">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No audits yet. Start by analyzing your first contract!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {audits.map((audit) => (
              <div key={audit.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="font-mono text-sm font-medium text-gray-900">
                        {formatAddress(audit.contractAddress)}
                      </div>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(audit.riskScore)}`}>
                        Risk: {audit.riskScore}
                      </div>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        audit.status === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {audit.status === 'paid' ? (
                          <>
                            <Lock className="h-3 w-3 mr-1" />
                            Premium
                          </>
                        ) : (
                          <>
                            <Eye className="h-3 w-3 mr-1" />
                            Free
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatDate(audit.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                    {audit.status === 'paid' && (
                      <button className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50 transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};