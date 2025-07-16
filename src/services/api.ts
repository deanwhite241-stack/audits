import { AuditResult } from '../types';
import { Project, ProjectSubmission } from '../types';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-api.com/api' 
  : 'http://localhost:3001/api';

export class ApiService {
  async analyzeContract(contractAddress: string): Promise<AuditResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/audit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contractAddress }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async getUserAudits(userAddress: string) {
    // This would connect to your database to fetch user's audit history
    // For now, returning empty array - implement based on your database
    try {
      const response = await fetch(`${API_BASE_URL}/user/${userAddress}/audits`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user audits');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch user audits:', error);
      return []; // Return empty array as fallback
    }
  }

  async getProjects(filters?: {
    search?: string;
    chain?: string;
    type?: string;
    certificateOnly?: boolean;
  }): Promise<Project[]> {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.search) queryParams.append('search', filters.search);
      if (filters?.chain) queryParams.append('chain', filters.chain);
      if (filters?.type) queryParams.append('type', filters.type);
      if (filters?.certificateOnly) queryParams.append('certificateOnly', 'true');

      const response = await fetch(`${API_BASE_URL}/projects?${queryParams}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      // Return mock data as fallback
      return this.getMockProjects(filters);
    }
  }

  async submitProject(submission: ProjectSubmission): Promise<{ success: boolean; message: string }> {
    try {
      const formData = new FormData();
      formData.append('name', submission.name);
      formData.append('description', submission.description);
      formData.append('contractAddress', submission.contractAddress);
      formData.append('chain', submission.chain);
      formData.append('type', submission.type);
      if (submission.website) formData.append('website', submission.website);
      if (submission.twitter) formData.append('twitter', submission.twitter);
      if (submission.telegram) formData.append('telegram', submission.telegram);
      if (submission.logo) formData.append('logo', submission.logo);

      const response = await fetch(`${API_BASE_URL}/projects/submit`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Submission failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Project submission error:', error);
      throw error;
    }
  }

  async getPendingProjects(): Promise<Project[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/projects/pending`, {
        headers: {
          'Content-Type': 'application/json',
          // Add authentication headers here
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pending projects');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch pending projects:', error);
      return []; // Return empty array as fallback
    }
  }

  async approveProject(projectId: string, certificate: 'Gold ESR' | 'Verified'): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/projects/${projectId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authentication headers here
        },
        body: JSON.stringify({ certificate }),
      });

      if (!response.ok) {
        throw new Error('Failed to approve project');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to approve project:', error);
      throw error;
    }
  }

  async rejectProject(projectId: string, reason: string): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/projects/${projectId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authentication headers here
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        throw new Error('Failed to reject project');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to reject project:', error);
      throw error;
    }
  }

  // Fallback mock data method
  private async getMockProjects(filters?: any): Promise<Project[]> {
    // Mock data as fallback when API is not available
    let mockProjects: Project[] = [
      {
        id: '1',
        name: 'RocketVault',
        description: 'Advanced DeFi auto-yield protocol with innovative staking mechanisms and cross-chain compatibility.',
        logo: 'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        contractAddress: '0x1234567890123456789012345678901234567890',
        chain: 'Ethereum',
        type: 'DeFi',
        website: 'https://rocketvault.finance',
        twitter: 'https://twitter.com/rocketvault',
        auditUrl: '/audit/0x1234567890123456789012345678901234567890',
        certificate: 'Gold ESR',
        status: 'approved',
        submittedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
        approvedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        approvedBy: 'admin@contractguard.com'
      }
    ];

    // Apply filters
    if (filters) {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        mockProjects = mockProjects.filter(p => 
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.contractAddress.toLowerCase().includes(searchLower)
        );
      }
      if (filters.chain) {
        mockProjects = mockProjects.filter(p => p.chain === filters.chain);
      }
      if (filters.type) {
        mockProjects = mockProjects.filter(p => p.type === filters.type);
      }
      if (filters.certificateOnly) {
        mockProjects = mockProjects.filter(p => p.certificate === 'Gold ESR');
      }
    }

    await new Promise(resolve => setTimeout(resolve, 800));
    return mockProjects;
  }
}

export const apiService = new ApiService();
