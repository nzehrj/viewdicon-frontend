import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { storage } from '@utils/storage';
import type { ApiResponse, ApiError } from '@/types/api.types';
import type { DPoPProof } from '@/types/device.types';

class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string = 'http://localhost:3001') {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      async (config) => {
        // Add auth token if available
        const token = await storage.getAuthToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiError>) => {
        // Handle 401 Unauthorized - Token expired
        if (error.response?.status === 401) {
          const refreshToken = await storage.getRefreshToken();
          
          if (refreshToken) {
            try {
              // Attempt to refresh token
              const response = await this.post<{ access_token: string; refresh_token: string }>(
                '/auth/refresh',
                { refresh_token: refreshToken }
              );

              // Save new tokens
              await storage.setAuthToken(response.access_token);
              await storage.setRefreshToken(response.refresh_token);

              // Retry original request
              if (error.config) {
                error.config.headers.Authorization = `Bearer ${response.access_token}`;
                return this.client.request(error.config);
              }
            } catch (refreshError) {
              // Refresh failed, clear tokens and redirect to login
              await storage.removeAuthToken();
              await storage.removeRefreshToken();
              window.location.href = '/';
            }
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Generic request method
  async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.request<ApiResponse<T>>(config);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error as AxiosError<ApiError>);
    }
  }

  // GET request
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  // POST request
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  // PUT request
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  // PATCH request
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH', url, data });
  }

  // DELETE request
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }

  // DPoP-protected request
  async dpopRequest<T = any>(
    url: string,
    method: string,
    dpopProof: DPoPProof,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const headers = {
      ...config?.headers,
      Authorization: `DPoP ${dpopProof.auth}`,
      DPoP: dpopProof.proof,
    };

    return this.request<T>({
      ...config,
      method: method as any,
      url,
      data,
      headers,
    });
  }

  // Error handler
  private handleError(error: AxiosError<ApiError>): Error {
    if (error.response) {
      // Server responded with error
      const apiError = error.response.data;
      return new Error(apiError?.error?.message || 'An error occurred');
    } else if (error.request) {
      // No response received
      return new Error('Network error. Please check your connection.');
    } else {
      // Request setup error
      return new Error(error.message || 'An unexpected error occurred');
    }
  }

  // Set base URL
  setBaseURL(url: string) {
    this.baseURL = url;
    this.client.defaults.baseURL = url;
  }

  // Get base URL
  getBaseURL(): string {
    return this.baseURL;
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Export class for creating additional instances
export default ApiClient;