import { AdminUser, CreateAdminUserRequest, UpdateAdminUserRequest, AuditLog } from '../../types/admin';

export class AdminApiError extends Error {
  constructor(message: string, public status: number, public code?: string) {
    super(message);
    this.name = 'AdminApiError';
  }
}

class AdminApiClient {
  private baseUrl = '/api/admin';

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      let errorCode = response.status.toString();
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        errorCode = errorData.code || errorCode;
      } catch {
        // If we can't parse the error response, use the status text
        errorMessage = response.statusText || errorMessage;
      }
      
      throw new AdminApiError(errorMessage, response.status, errorCode);
    }

    try {
      return await response.json();
    } catch {
      // For responses that don't have JSON bodies
      return {} as T;
    }
  }

  // Authentication endpoints
  async signIn(email: string, password: string): Promise<{ success: boolean; message?: string }> {
    return this.request('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signOut(): Promise<{ success: boolean }> {
    return this.request('/auth/signout', {
      method: 'POST',
    });
  }

  async validateSession(): Promise<{ valid: boolean; user?: AdminUser }> {
    return this.request('/auth/validate');
  }

  // User management endpoints
  async getAdminUsers(): Promise<AdminUser[]> {
    return this.request('/users');
  }

  async getAdminUser(uid: string): Promise<AdminUser> {
    return this.request(`/users/${uid}`);
  }

  async createAdminUser(userData: CreateAdminUserRequest): Promise<AdminUser> {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateAdminUser(uid: string, userData: UpdateAdminUserRequest): Promise<AdminUser> {
    return this.request(`/users/${uid}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteAdminUser(uid: string): Promise<{ success: boolean }> {
    return this.request(`/users/${uid}`, {
      method: 'DELETE',
    });
  }

  async deactivateAdminUser(uid: string): Promise<AdminUser> {
    return this.request(`/users/${uid}/deactivate`, {
      method: 'POST',
    });
  }

  async activateAdminUser(uid: string): Promise<AdminUser> {
    return this.request(`/users/${uid}/activate`, {
      method: 'POST',
    });
  }

  // Audit log endpoints
  async getAuditLogs(params?: {
    adminUserId?: string;
    resourceType?: string;
    action?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ logs: AuditLog[]; total: number }> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const query = searchParams.toString();
    const endpoint = query ? `/audit?${query}` : '/audit';
    
    return this.request(endpoint);
  }

  async createAuditLog(logData: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog> {
    return this.request('/audit', {
      method: 'POST',
      body: JSON.stringify(logData),
    });
  }

  // Dashboard endpoints
  async getDashboardStats(): Promise<{
    totalUsers: number;
    totalContent: number;
    totalSponsors: number;
    totalMembers: number;
    recentActivity: AuditLog[];
  }> {
    return this.request('/dashboard/stats');
  }
}

export const adminApi = new AdminApiClient();