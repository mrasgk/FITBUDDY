// API Configuration and utilities
export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'https://api.fitbuddy.com',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

class ApiService {
  private baseUrl: string;
  private timeout: number;
  private retryAttempts: number;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.retryAttempts = API_CONFIG.RETRY_ATTEMPTS;
  }

  // Generic HTTP request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    attempt: number = 1
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      // Add auth token if available
      const authToken = await this.getAuthToken();
      if (authToken) {
        defaultHeaders['Authorization'] = `Bearer ${authToken}`;
      }

      const config: RequestInit = {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
        signal: controller.signal,
      };

      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error(`API request failed (attempt ${attempt}):`, error);
      
      // Retry logic
      if (attempt < this.retryAttempts && this.shouldRetry(error)) {
        await this.delay(1000 * attempt); // Exponential backoff
        return this.request<T>(endpoint, options, attempt + 1);
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // HTTP method helpers
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Upload file
  async upload<T>(endpoint: string, file: FormData): Promise<ApiResponse<T>> {
    const authToken = await this.getAuthToken();
    const headers: Record<string, string> = {};
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    return this.request<T>(endpoint, {
      method: 'POST',
      body: file,
      headers,
    });
  }

  // Helper methods
  private async getAuthToken(): Promise<string | null> {
    try {
      // In a real app, get token from secure storage
      // return await SecureStore.getItemAsync('auth_token');
      return null; // For now, no auth token
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  private shouldRetry(error: any): boolean {
    // Retry on network errors, timeouts, and 5xx server errors
    if (error.name === 'AbortError') return true;
    if (error.message.includes('Failed to fetch')) return true;
    if (error.message.includes('HTTP 5')) return true;
    return false;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Connection status
  async checkConnection(): Promise<boolean> {
    try {
      const response = await this.get('/health');
      return response.success;
    } catch {
      return false;
    }
  }

  // Set custom headers for all requests
  setGlobalHeaders(headers: Record<string, string>): void {
    // Implementation would update default headers
    console.log('Global headers set:', headers);
  }

  // Clear auth token (logout)
  async clearAuthToken(): Promise<void> {
    try {
      // In a real app, clear token from secure storage
      // await SecureStore.deleteItemAsync('auth_token');
      console.log('Auth token cleared');
    } catch (error) {
      console.error('Error clearing auth token:', error);
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Response type helpers
export const handleApiResponse = <T>(
  response: ApiResponse<T>,
  onSuccess: (data: T) => void,
  onError?: (error: string) => void
): void => {
  if (response.success && response.data) {
    onSuccess(response.data);
  } else if (response.error && onError) {
    onError(response.error);
  }
};

// Error handling utilities
export const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.error) return error.error;
  return 'An unexpected error occurred';
};