const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface RequestOptions {
  method?: string;
  body?: string;
  headers?: Record<string, string>;
}

export async function api(endpoint: string, options: RequestOptions = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const config: RequestInit = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}/api${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Erreur réseau' }));
    throw new Error(error.error || 'Erreur API');
  }
  
  return response.json();
}
