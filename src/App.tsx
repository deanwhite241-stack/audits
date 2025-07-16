import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { SupportedChains } from './components/SupportedChains';
import { AuditForm } from './components/AuditForm';
import { AuditResults } from './components/AuditResults';
import { Dashboard } from './components/Dashboard';
import { ProjectsLibrary } from './components/ProjectsLibrary';
import { ProjectSubmission } from './components/ProjectSubmission';
import { AdminDashboard } from './components/AdminDashboard';
import { AuditResult } from './types';
import { apiService } from './services/api';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'dashboard' | 'projects' | 'submit' | 'admin'>('home');
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAuditSubmit = async (contractAddress: string) => {
    setIsLoading(true);
    try {
      const result = await apiService.analyzeContract(contractAddress);
      setAuditResult(result);
    } catch (error) {
      console.error('Audit failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    if (auditResult) {
      setAuditResult({ ...auditResult, isPaid: true });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      <Header onNavigate={setCurrentPage} currentPage={currentPage} />
      
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {currentPage === 'home' ? (
            <div className="space-y-12">
              <Hero />
              
              <div className="text-center space-y-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="max-w-2xl mx-auto">
                  <h2 className="text-3xl font-bold text-white mb-4">
                    Analyze Smart Contract Security
                  </h2>
                  <p className="text-lg text-gray-300">
                    Enter any Ethereum contract address to get instant AI-powered security analysis
                  </p>
                </div>
                
                <AuditForm onSubmit={handleAuditSubmit} isLoading={isLoading} />
              </div>
              
              {auditResult && (
                <div className="mt-12">
                  <AuditResults 
                    result={auditResult} 
                    onPaymentSuccess={handlePaymentSuccess}
                  />
                </div>
              )}
              
              <SupportedChains />
            </div>
          ) : currentPage === 'projects' ? (
            <ProjectsLibrary />
          ) : currentPage === 'submit' ? (
            <ProjectSubmission />
          ) : currentPage === 'admin' ? (
            <AdminDashboard />
          ) : (
            <Dashboard />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;