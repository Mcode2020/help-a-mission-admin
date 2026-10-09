import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { getStoredToken, setStoredToken, clearStoredToken } from './api';

const API_BASE_URL = '/api/v1';

interface RootStateSlice {
  cms?: {
    language?: 'en' | 'hi';
  };
}

interface RefreshResponseData {
  success?: boolean;
  data?: {
    token?: string;
  };
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getStoredToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    if (!headers.has('Accept')) {
      headers.set('Accept', 'application/json');
    }
    // Set language header if available in state
    const state = getState() as RootStateSlice;
    const language = state?.cms?.language || 'en';
    headers.set('Accept-Language', language);
    return headers;
  },
});

/**
 * Custom BaseQuery with automatic HTTP 401 re-authentication / session refresh
 */
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const endpointStr = typeof args === 'string' ? args : args.url;
    if (!endpointStr.includes('/admin/auth/login') && !endpointStr.includes('/admin/auth/refresh')) {
      const currentToken = getStoredToken();
      // Attempt silent session refresh
      const refreshResult = await rawBaseQuery(
        {
          url: '/admin/auth/refresh',
          method: 'POST',
          body: { token: currentToken },
        },
        api,
        extraOptions
      );

      const refreshData = refreshResult.data as RefreshResponseData | undefined;
      if (refreshResult.data && refreshData?.success !== false && refreshData?.data?.token) {
        const newToken = refreshData.data.token;
        setStoredToken(newToken);
        // Retry original request with newly issued token
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        // Session expired or invalid
        clearStoredToken();
        api.dispatch({ type: 'auth/logout' });
      }
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'CMS',
    'Home',
    'Campaigns',
    'Gallery',
    'Donations',
    'Donors',
    'Users',
    'Media',
    'RBAC',
    'Audit',
    'Dashboard',
    'Auth',
  ],
  keepUnusedDataFor: 60,
  refetchOnMountOrArgChange: true,
  refetchOnReconnect: true,
  endpoints: () => ({}),
});
