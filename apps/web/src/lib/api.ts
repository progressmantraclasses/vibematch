const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
};

export class ApiError extends Error {
  statusCode: number;
  code?: string;
  data?: any;

  constructor(message: string, statusCode: number, code?: string, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.data = data;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const baseUrl = getBaseUrl().replace(/\/$/, '');
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${cleanEndpoint}`;

  const res = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    let errBody: any = {};
    try {
      errBody = await res.json();
    } catch {
      errBody = { message: res.statusText };
    }

    const message =
      errBody.message ||
      errBody.error ||
      `Request failed with status ${res.status}`;
    const code = errBody.code || errBody.error;

    throw new ApiError(message, res.status, code, errBody);
  }

  if (res.status === 204) {
    return undefined as unknown as T;
  }

  const json = await res.json();
  // If backend wraps in { success: true, data: ... }, unpack if needed or return json
  return json;
}

export const api = {
  get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return request<T>(endpoint, { method: 'GET', ...options });
  },

  post<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  },

  patch<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  },

  delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return request<T>(endpoint, { method: 'DELETE', ...options });
  },
};
