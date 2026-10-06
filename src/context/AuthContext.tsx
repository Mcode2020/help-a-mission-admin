import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AdminUser } from '../types';
import { adminApi } from '../services/api';

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
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkAuth = async () => {
    try {
      const data = await adminApi.getMe();
      setAdmin(data.admin);
    } catch {
      setAdmin(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const data = await adminApi.login(credentials);
    setAdmin(data.admin);
  };

  const logout = async () => {
    try {
      await adminApi.logout();
    } finally {
      setAdmin(null);
    }
  };

  const refreshSession = async () => {
    try {
      const data = await adminApi.refresh();
      setAdmin(data.admin);
    } catch {
      setAdmin(null);
    }
  };

  const hasPermission = (permissionKey: string): boolean => {
    if (!admin) return false;
    if (admin.role === 'SUPER_ADMIN' || admin.role === 'Super Administrator') return true;
    const perms = admin.permissions || [];
    return perms.includes('access:all') || perms.includes('admin:all') || perms.includes(permissionKey);
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        isLoading,
        login,
        logout,
        refreshSession,
        hasPermission,
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
