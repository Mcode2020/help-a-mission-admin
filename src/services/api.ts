const API_BASE_URL = '/api/v1';

export class ApiClientError extends Error {
  code?: string;
  statusCode?: number;

  constructor(message: string, code?: string, statusCode?: number) {
    super(message);
    this.name = 'ApiClientError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

const TOKEN_KEY = 'admin_session_token';

export const getStoredToken = (): string | null => {
  return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
};

export const setStoredToken = (token: string) => {
  if (token) {
    sessionStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const clearStoredToken = () => {
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_KEY);
};

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

async function request<T>(endpoint: string, options: RequestInit = {}, isRetry = false): Promise<T> {
  const defaultHeaders: Record<string, string> = {
    'Accept': 'application/json',
  };

  const storedToken = getStoredToken();
  if (storedToken) {
    defaultHeaders['Authorization'] = `Bearer ${storedToken}`;
  }

  if (!(options.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: 'include',
  });

  // Interceptor: Handle HTTP 401 Unauthorized by attempting a silent session refresh
  if (
    response.status === 401 &&
    !isRetry &&
    !endpoint.includes('/admin/auth/login') &&
    !endpoint.includes('/admin/auth/refresh')
  ) {
    if (isRefreshing) {
      return new Promise<T>((resolve, reject) => {
        failedQueue.push({
          resolve: () => {
            request<T>(endpoint, options, true).then(resolve).catch(reject);
          },
          reject,
        });
      });
    }

    isRefreshing = true;
    const currentToken = getStoredToken();

    try {
      // Execute silent session refresh with Cookie + Authorization + Body fallback
      const refreshRes = await fetch(`${API_BASE_URL}/admin/auth/refresh`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...(currentToken ? { 'Authorization': `Bearer ${currentToken}` } : {}),
        },
        body: JSON.stringify({ token: currentToken }),
        credentials: 'include',
      });

      let refreshData: any = {};
      try {
        refreshData = await refreshRes.json();
      } catch {
        refreshData = {};
      }

      if (refreshRes.ok && refreshData.success !== false && refreshData.data?.token) {
        setStoredToken(refreshData.data.token);
        processQueue(null);
        isRefreshing = false;
        // Retry original request with newly issued session token
        return await request<T>(endpoint, options, true);
      } else {
        clearStoredToken();
        const error = new ApiClientError(
          refreshData.error?.message || 'Session expired or invalid',
          refreshData.error?.code || 'INVALID_SESSION',
          401
        );
        processQueue(error);
        isRefreshing = false;
        throw error;
      }
    } catch (refreshErr) {
      clearStoredToken();
      processQueue(refreshErr);
      isRefreshing = false;
      throw refreshErr;
    }
  }

  let data: any = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok || data.success === false) {
    const errorMsg = data.error?.message || data.message || 'API request failed';
    const errorCode = data.error?.code || 'UNKNOWN_ERROR';
    throw new ApiClientError(errorMsg, errorCode, response.status);
  }

  return data.data;
}

export const adminApi = {
  // Auth
  login: async (credentials: { email: string; password: string }) => {
    const data = await request<{ admin: any; token: string }>('/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (data.token) {
      setStoredToken(data.token);
    }
    return data;
  },

  logout: async () => {
    try {
      return await request('/admin/auth/logout', { method: 'POST' });
    } finally {
      clearStoredToken();
    }
  },

  refresh: async () => {
    const currentToken = getStoredToken();
    const data = await request<{ admin: any; token: string; expiresAt: string }>('/admin/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ token: currentToken }),
    });
    if (data.token) {
      setStoredToken(data.token);
    }
    return data;
  },

  getMe: () =>
    request<{ admin: any }>('/admin/auth/me'),

  // Dashboard & Analytics
  getDashboard: (params?: { startDate?: string; endDate?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return request<any>(`/admin/dashboard${query ? `?${query}` : ''}`);
  },

  // Donors & Donations
  getDonors: (page = 1, limit = 20) =>
    request<any>(`/admin/donors?page=${page}&limit=${limit}`),

  getDonations: (page = 1, limit = 20) =>
    request<any>(`/admin/donations?page=${page}&limit=${limit}`),

  exportReport: (format = 'csv') =>
    request<any>('/admin/reports/export', {
      method: 'POST',
      body: JSON.stringify({ format }),
    }),

  // CMS
  getCmsPage: (slug: string) =>
    request<any>(`/admin/cms/pages/${slug}`),

  updateCmsSections: (slug: string, sections: any[]) =>
    request<any>(`/admin/cms/pages/${slug}/sections`, {
      method: 'PUT',
      body: JSON.stringify({ sections }),
    }),

  // Initiatives
  getInitiatives: () =>
    request<any[]>('/public/initiatives'),

  createInitiative: (data: any) =>
    request<any>('/admin/initiatives', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateInitiative: (id: string, data: any) =>
    request<any>(`/admin/initiatives/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // Gallery
  getGallery: () =>
    request<any[]>('/public/gallery'),

  createGalleryItem: (data: any) =>
    request<any>('/admin/gallery', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Media
  uploadMedia: (file: File, visibility: 'public' | 'private' = 'public') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('visibility', visibility);

    return request<any>('/admin/media/upload', {
      method: 'POST',
      body: formData,
    });
  },

  // RBAC
  getPermissions: () =>
    request<{ permissions: any[] }>('/admin/rbac/permissions'),

  getRoles: () =>
    request<{ roles: any[] }>('/admin/rbac/roles'),

  createRole: (roleData: any) =>
    request<any>('/admin/rbac/roles', {
      method: 'POST',
      body: JSON.stringify(roleData),
    }),

  updateRole: (id: string, roleData: any) =>
    request<any>(`/admin/rbac/roles/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(roleData),
    }),

  assignAccountRoles: (adminId: string, roleIds: string[]) =>
    request<any>(`/admin/rbac/accounts/${adminId}/roles`, {
      method: 'PUT',
      body: JSON.stringify({ roleIds }),
    }),

  // Audit Logs
  getAuditLogs: (page = 1, limit = 20) =>
    request<any>(`/admin/audit?page=${page}&limit=${limit}`),
};
