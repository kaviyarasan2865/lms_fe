// Custom JWT authentication utilities
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  college_id?: string;
  college_name?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

// Token management
export const tokenManager = {
  setTokens: (tokens: AuthTokens) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', tokens.access);
      localStorage.setItem('refresh_token', tokens.refresh);
      
      // Also set cookies for middleware access
      document.cookie = `access_token=${tokens.access}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`; // 7 days
      document.cookie = `refresh_token=${tokens.refresh}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`; // 30 days
    }
  },

  getAccessToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  },

  getRefreshToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refresh_token');
    }
    return null;
  },

  clearTokens: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      
      // Clear cookies
      document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  },

  isAuthenticated: (): boolean => {
    return !!tokenManager.getAccessToken();
  }
};

// API client with authentication
export class AuthApiClient {
  private baseURL: string;

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api') {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ data?: T; error?: string }> {
    const url = `${this.baseURL}${endpoint}`;
    const token = tokenManager.getAccessToken();
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // If token is expired, try to refresh
        if (response.status === 401 && token) {
          const refreshed = await this.refreshToken();
          if (refreshed) {
            // Retry the original request with new token
            const newToken = tokenManager.getAccessToken();
            const retryConfig = {
              ...config,
              headers: {
                ...config.headers,
                Authorization: `Bearer ${newToken}`,
              },
            };
            const retryResponse = await fetch(url, retryConfig);
            const retryData = await retryResponse.json();
            
            if (retryResponse.ok) {
              return { data: retryData };
            }
          }
        }
        
        return {
          error: data.error || data.details || 'An error occurred',
        };
      }

      return { data };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  async login(username: string, password: string): Promise<{ data?: LoginResponse; error?: string }> {
    const result = await this.request<LoginResponse>('/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    if (result.data) {
      tokenManager.setTokens(result.data.tokens);
    }

    return result;
  }

  async logout(): Promise<{ error?: string }> {
    const refreshToken = tokenManager.getRefreshToken();
    const result = await this.request('/logout/', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    tokenManager.clearTokens();
    return result;
  }

  async getProfile(): Promise<{ data?: any; error?: string }> {
    return this.request('/profile/');
  }

  private async refreshToken(): Promise<boolean> {
    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${this.baseURL}/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        tokenManager.setTokens({ access: data.access, refresh: data.refresh });
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }

    tokenManager.clearTokens();
    return false;
  }
}

export const authApi = new AuthApiClient();
