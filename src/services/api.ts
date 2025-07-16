import { AuditResult, UserAudit, Project, ProjectSubmission } from '../types';

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

  async getUserAudits(userAddress: string): Promise<UserAudit[]> {
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
      throw error;
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
      throw error;
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
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pending projects');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch pending projects:', error);
      throw error;
    }
  }

  async approveProject(projectId: string, certificate: 'Gold ESR' | 'Verified'): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/projects/${projectId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
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
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
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

  async verifyPayment(userAddress: string, contractAddress: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/payment/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userAddress, contractAddress }),
      });

      if (!response.ok) {
        throw new Error('Failed to verify payment');
      }

      const result = await response.json();
      return result.hasPaid;
    } catch (error) {
      console.error('Payment verification error:', error);
      return false;
    }
  }

  async getAuditHistory(userAddress: string): Promise<AuditResult[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${userAddress}/history`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch audit history');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch audit history:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
