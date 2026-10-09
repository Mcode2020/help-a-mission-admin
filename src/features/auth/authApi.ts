import { baseApi } from '../../services/baseApi';
import type { AdminUser } from '../../types';
import { setCredentials, logout as logoutAction } from './authSlice';

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface ApiDataWrapper<T> {
  success?: boolean;
  data?: T;
}

export interface LoginData {
  admin: AdminUser;
  token: string;
}

export interface RefreshData {
  admin: AdminUser;
  token: string;
  expiresAt: string;
}

export interface MeData {
  admin: AdminUser;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginData, LoginRequest>({
      query: (credentials) => ({
        url: '/admin/auth/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: ApiDataWrapper<LoginData> | LoginData) => {
        return 'data' in response && response.data ? response.data : (response as LoginData);
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.admin && data?.token) {
            dispatch(setCredentials({ admin: data.admin, token: data.token }));
          }
        } catch {
          // Error handled in component
        }
      },
      invalidatesTags: ['Auth'],
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/admin/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(logoutAction());
          dispatch(baseApi.util.resetApiState());
        }
      },
      invalidatesTags: ['Auth'],
    }),

    refreshSession: builder.mutation<RefreshData, void>({
      query: () => ({
        url: '/admin/auth/refresh',
        method: 'POST',
      }),
      transformResponse: (response: ApiDataWrapper<RefreshData> | RefreshData) => {
        return 'data' in response && response.data ? response.data : (response as RefreshData);
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.admin && data?.token) {
            dispatch(setCredentials({ admin: data.admin, token: data.token }));
          }
        } catch {
          dispatch(logoutAction());
        }
      },
    }),

    getMe: builder.query<MeData, void>({
      query: () => '/admin/auth/me',
      transformResponse: (response: ApiDataWrapper<MeData> | MeData) => {
        return 'data' in response && response.data ? response.data : (response as MeData);
      },
      providesTags: ['Auth'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.admin) {
            dispatch(setCredentials({ admin: data.admin }));
          }
        } catch {
          dispatch(logoutAction());
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRefreshSessionMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
} = authApi;
