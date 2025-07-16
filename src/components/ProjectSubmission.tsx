import React, { useState } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Loader, Plus } from 'lucide-react';
import { ProjectSubmission as ProjectSubmissionType } from '../types';
import { apiService } from '../services/api';

export const ProjectSubmission: React.FC = () => {
  const [formData, setFormData] = useState<ProjectSubmissionType>({
    name: '',
    description: '',
    logo: null,
    contractAddress: '',
    chain: 'Ethereum',
    type: 'Token',
    website: '',
    twitter: '',
    telegram: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [logoPreview, setLogoPreview] = useState<string>('');

  const chains = ['Ethereum', 'BSC', 'Polygon', 'Arbitrum', 'Optimism'];
  const types = ['Token', 'NFT', 'DeFi', 'Staking', 'Launchpad', 'DAO', 'Other'];

  const handleInputChange = (field: keyof ProjectSubmissionType, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, logo: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setFormData(prev => ({ ...prev, logo: null }));
    setLogoPreview('');
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setSubmitStatus({ type: 'error', message: 'Project name is required' });
      return false;
    }
    if (!formData.description.trim()) {
      setSubmitStatus({ type: 'error', message: 'Description is required' });
      return false;
    }
    if (formData.description.length > 300) {
      setSubmitStatus({ type: 'error', message: 'Description must be 300 characters or less' });
      return false;
    }
    if (!formData.contractAddress.trim()) {
      setSubmitStatus({ type: 'error', message: 'Contract address is required' });
      return false;
    }
    if (!/^0x[a-fA-F0-9]{40}$/.test(formData.contractAddress)) {
      setSubmitStatus({ type: 'error', message: 'Invalid contract address format' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const result = await apiService.submitProject(formData);
      
      if (result.success) {
        setSubmitStatus({ type: 'success', message: result.message });
        // Reset form
        setFormData({
          name: '',
          description: '',
          logo: null,
          contractAddress: '',
          chain: 'Ethereum',
          type: 'Token',
          website: '',
          twitter: '',
          telegram: ''
        });
        setLogoPreview('');
      } else {
        setSubmitStatus({ type: 'error', message: result.message });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Submission failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Submit Your Project
          </h1>
          <p className="text-gray-600">
            Submit your smart contract project for review and potential inclusion in our verified library.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter project name"
              required
            />
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Logo
            </label>
            {logoPreview ? (
              <div className="relative inline-block">
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="w-20 h-20 rounded-lg object-cover border border-gray-300"
                />
                <button
                  type="button"
                  onClick={removeLogo}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <label htmlFor="logo-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload logo</p>
                  <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                </label>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description * (max 300 characters)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              maxLength={300}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe your project..."
              required
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {formData.description.length}/300
            </div>
          </div>

          {/* Contract Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contract Address *
            </label>
            <input
              type="text"
              value={formData.contractAddress}
              onChange={(e) => handleInputChange('contractAddress', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
              placeholder="0x..."
              required
            />
          </div>

          {/* Chain and Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blockchain *
              </label>
              <select
                value={formData.chain}
                onChange={(e) => handleInputChange('chain', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {chains.map(chain => (
                  <option key={chain} value={chain}>{chain}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Optional Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Optional Links</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://yourproject.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Twitter
              </label>
              <input
                type="url"
                value={formData.twitter}
                onChange={(e) => handleInputChange('twitter', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://twitter.com/yourproject"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Telegram
              </label>
              <input
                type="url"
                value={formData.telegram}
                onChange={(e) => handleInputChange('telegram', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://t.me/yourproject"
              />
            </div>
          </div>

          {/* Status Message */}
          {submitStatus.type && (
            <div className={`flex items-center space-x-2 p-4 rounded-lg ${
              submitStatus.type === 'success' 
                ? 'bg-green-50 text-green-700' 
                : 'bg-red-50 text-red-700'
            }`}>
              {submitStatus.type === 'success' ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <span>{submitStatus.message}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                <span>Submit Project</span>
              </>
            )}
          </button>

          <div className="text-center text-sm text-gray-500">
            <p>
              Your submission will be reviewed by our team. You'll be notified once it's approved 
              and added to the verified projects library.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};