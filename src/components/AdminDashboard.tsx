import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Award, 
  Eye, 
  ExternalLink,
  Shield,
  AlertTriangle,
  Download
} from 'lucide-react';
import { Project } from '../types';
import { apiService } from '../services/api';

export const AdminDashboard: React.FC = () => {
  const [pendingProjects, setPendingProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string>('');

  useEffect(() => {
    loadPendingProjects();
  }, []);

  const loadPendingProjects = async () => {
    try {
      const data = await apiService.getPendingProjects();
      setPendingProjects(data);
    } catch (error) {
      console.error('Failed to load pending projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (projectId: string, certificate: 'Gold ESR' | 'Verified') => {
    setProcessingId(projectId);
    try {
      await apiService.approveProject(projectId, certificate);
      setPendingProjects(prev => prev.filter(p => p.id !== projectId));
    } catch (error) {
      console.error('Failed to approve project:', error);
    } finally {
      setProcessingId('');
    }
  };

  const handleReject = async (projectId: string) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    setProcessingId(projectId);
    try {
      await apiService.rejectProject(projectId, reason);
      setPendingProjects(prev => prev.filter(p => p.id !== projectId));
    } catch (error) {
      console.error('Failed to reject project:', error);
    } finally {
      setProcessingId('');
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
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

  const generateCertificate = (project: Project) => {
    // Mock certificate generation
    console.log('Generating certificate for:', project.name);
    // In production, this would generate a PDF certificate
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Review and approve project submissions</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-orange-600">{pendingProjects.length}</div>
            <div className="text-sm text-gray-500">Pending Reviews</div>
          </div>
        </div>
      </div>

      {/* Pending Projects */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-orange-500" />
            Pending Project Reviews
          </h2>
        </div>

        {pendingProjects.length === 0 ? (
          <div className="p-8 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-gray-600">No pending projects to review</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {pendingProjects.map((project) => (
              <div key={project.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={project.logo}
                      alt={project.name}
                      className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                      <p className="text-gray-600 mt-1">{project.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>Type: {project.type}</span>
                        <span>Chain: {project.chain}</span>
                        <span>Submitted: {formatDate(project.submittedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contract Address
                      </label>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-sm text-gray-900">
                          {formatAddress(project.contractAddress)}
                        </span>
                        <button
                          onClick={() => window.open(`https://etherscan.io/address/${project.contractAddress}`, '_blank')}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quick Actions
                      </label>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => window.location.href = project.auditUrl}
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View Audit</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Approve as:</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleApprove(project.id, 'Verified')}
                      disabled={processingId === project.id}
                      className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Approve as Verified</span>
                    </button>
                    
                    <button
                      onClick={() => handleApprove(project.id, 'Gold ESR')}
                      disabled={processingId === project.id}
                      className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-2 rounded-lg font-medium hover:from-yellow-600 hover:to-yellow-700 transition-colors disabled:opacity-50"
                    >
                      <Award className="h-4 w-4" />
                      <span>Gold ESR Certify</span>
                    </button>
                    
                    <button
                      onClick={() => handleReject(project.id)}
                      disabled={processingId === project.id}
                      className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Certificate Generation Tool */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Award className="h-5 w-5 mr-2 text-yellow-500" />
            Certificate Management
          </h2>
        </div>
        
        <div className="p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-800">Gold ESR Certificate</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  When you approve a project with Gold ESR certification, a downloadable certificate 
                  will be automatically generated and made available to the project team.
                </p>
                <div className="mt-3">
                  <button
                    onClick={() => console.log('Generate sample certificate')}
                    className="flex items-center space-x-2 text-yellow-800 hover:text-yellow-900 text-sm font-medium"
                  >
                    <Download className="h-4 w-4" />
                    <span>Preview Certificate Template</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};