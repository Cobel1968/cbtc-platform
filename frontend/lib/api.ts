import { config } from './config';

/**
 * CBTC API Client
 * Centralized API communication using configuration
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${config.api.baseUrl}${path}`;
  
  const res = await fetch(url, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new ApiError(
      text || `API error ${res.status}`,
      res.status,
      text
    );
  }

  return res.json() as Promise<T>;
}

// Convenience methods for common HTTP operations
export const apiClient = {
  get: <T>(path: string, options?: RequestInit) => 
    api<T>(path, { ...options, method: 'GET' }),
    
  post: <T>(path: string, data?: any, options?: RequestInit) => 
    api<T>(path, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),
    
  put: <T>(path: string, data?: any, options?: RequestInit) => 
    api<T>(path, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),
    
  delete: <T>(path: string, options?: RequestInit) => 
    api<T>(path, { ...options, method: 'DELETE' }),
};

// Export config for backward compatibility
export { config } from './config';
