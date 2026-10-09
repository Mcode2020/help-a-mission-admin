import React, { createContext, useContext } from 'react';
import type { AdminUser } from '../types';
import { useAppSelector } from '../app/hooks';
import {
  selectCurrentAdmin,
  selectIsAuthenticated,
  selectAuthLoading,
  selectHasPermission,
} from '../features/auth/authSlice';
import {
  useGetMeQuery,
  useLoginMutation,
  useLogoutMutation,
  useRefreshSessionMutation,
} from '../features/auth/authApi';

interface AuthContextType {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  hasPermission: (permissionKey: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const admin = useAppSelector(selectCurrentAdmin);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectAuthLoading);

  // Trigger getMe query on mount to check existing session
  const { isLoading: isFetchingMe } = useGetMeQuery(undefined, {
    skip: false,
  });

  const [loginMutation] = useLoginMutation();
  const [logoutMutation] = useLogoutMutation();
  const [refreshMutation] = useRefreshSessionMutation();

  const login = async (credentials: { email: string; password: string }) => {
    await loginMutation(credentials).unwrap();
  };

  const logout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch {
      // Ignored - cleanup done in slice action
    }
  };

  const refreshSession = async () => {
    await refreshMutation().unwrap();
  };

  const checkPermission = (permissionKey: string): boolean => {
    return selectHasPermission({ auth: { admin, token: null, isAuthenticated, isLoading } } as any, permissionKey);
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        isAuthenticated,
        isLoading: isLoading || isFetchingMe,
        login,
        logout,
        refreshSession,
        hasPermission: checkPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
