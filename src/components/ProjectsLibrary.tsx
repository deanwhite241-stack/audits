import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ExternalLink, 
  Award, 
  CheckCircle, 
  Globe, 
  Twitter, 
  MessageCircle,
  Eye,
  Star,
  Zap
} from 'lucide-react';
import { Project } from '../types';
import { apiService } from '../services/api';

export const ProjectsLibrary: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChain, setSelectedChain] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showCertifiedOnly, setShowCertifiedOnly] = useState(false);

  const chains = ['Ethereum', 'BSC', 'Polygon', 'Arbitrum', 'Optimism'];
  const types = ['Token', 'NFT', 'DeFi', 'Staking', 'Launchpad', 'DAO', 'Other'];

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [projects, searchTerm, selectedChain, selectedType, showCertifiedOnly]);

  const loadProjects = async () => {
    try {
      const data = await apiService.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...projects];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.contractAddress.toLowerCase().includes(searchLower)
      );
    }

    if (selectedChain) {
      filtered = filtered.filter(p => p.chain === selectedChain);
    }

    if (selectedType) {
      filtered = filtered.filter(p => p.type === selectedType);
    }

    if (showCertifiedOnly) {
      filtered = filtered.filter(p => p.certificate === 'Gold ESR');
    }

    setFilteredProjects(filtered);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Token': return '🪙';
      case 'NFT': return '🎨';
      case 'DeFi': return '🏦';
      case 'Staking': return '💎';
      case 'Launchpad': return '🚀';
      case 'DAO': return '🏛️';
      default: return '📄';
    }
  };

  const getChainColor = (chain: string) => {
    switch (chain) {
      case 'Ethereum': return 'bg-blue-100 text-blue-800';
      case 'BSC': return 'bg-yellow-100 text-yellow-800';
      case 'Polygon': return 'bg-purple-100 text-purple-800';
      case 'Arbitrum': return 'bg-cyan-100 text-cyan-800';
      case 'Optimism': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading verified projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          Library of Verified Projects
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Discover high-quality, audited smart contracts that have passed our comprehensive security analysis. 
          Each project is verified and trusted by the ContractGuard community.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{projects.length}</div>
          <div className="text-gray-600">Total Projects</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-yellow-600 mb-2">
            {projects.filter(p => p.certificate === 'Gold ESR').length}
          </div>
          <div className="text-gray-600">Gold ESR Certified</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {new Set(projects.map(p => p.chain)).size}
          </div>
          <div className="text-gray-600">Supported Chains</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedChain}
            onChange={(e) => setSelectedChain(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Chains</option>
            {chains.map(chain => (
              <option key={chain} value={chain}>{chain}</option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showCertifiedOnly}
              onChange={(e) => setShowCertifiedOnly(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Gold ESR Only</span>
          </label>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No projects found</h3>
          <p className="text-gray-300">Try adjusting your search criteria or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={project.logo}
                      alt={project.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{project.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-lg">{getTypeIcon(project.type)}</span>
                        <span className="text-sm text-gray-500">{project.type}</span>
                      </div>
                    </div>
                  </div>
                  
                  {project.certificate === 'Gold ESR' && (
                    <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                      <Award className="h-3 w-3" />
                      <span>Gold ESR</span>
                    </div>
                  )}
                  
                  {project.certificate === 'Verified' && (
                    <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      <CheckCircle className="h-3 w-3" />
                      <span>Verified</span>
                    </div>
                  )}
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {project.description}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getChainColor(project.chain)}`}>
                      {project.chain}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">
                      {formatAddress(project.contractAddress)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    {project.website && (
                      <a
                        href={project.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Globe className="h-4 w-4" />
                      </a>
                    )}
                    {project.twitter && (
                      <a
                        href={project.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Twitter className="h-4 w-4" />
                      </a>
                    )}
                    {project.telegram && (
                      <a
                        href={project.telegram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => window.open(`https://etherscan.io/address/${project.contractAddress}`, '_blank')}
                    className="flex items-center space-x-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>View Contract</span>
                  </button>
                  
                  <button
                    onClick={() => window.location.href = project.auditUrl}
                    className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Audit</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};