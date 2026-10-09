import { createSlice, createSelector } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AdminUser } from '../../types';
import { getStoredToken, setStoredToken, clearStoredToken } from '../../services/api';

interface AuthState {
  admin: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialToken = getStoredToken();

const initialState: AuthState = {
  admin: null,
  token: initialToken,
  isAuthenticated: false,
  isLoading: true,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ admin: AdminUser; token?: string }>
    ) => {
      const { admin, token } = action.payload;
      state.admin = admin;
      state.isAuthenticated = !!admin;
      state.isLoading = false;
      if (token) {
        state.token = token;
        setStoredToken(token);
      }
    },
    setAdmin: (state, action: PayloadAction<AdminUser | null>) => {
      state.admin = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isLoading = false;
    },
    logout: (state) => {
      state.admin = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      clearStoredToken();
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setCredentials, setAdmin, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;

interface RootStateLike {
  auth: AuthState;
}

// Selectors
export const selectAuthState = (state: RootStateLike) => state.auth;
export const selectCurrentAdmin = createSelector(selectAuthState, (auth) => auth.admin);
export const selectIsAuthenticated = createSelector(selectAuthState, (auth) => auth.isAuthenticated);
export const selectAuthLoading = createSelector(selectAuthState, (auth) => auth.isLoading);
export const selectAdminPermissions = createSelector(
  selectCurrentAdmin,
  (admin) => admin?.permissions || []
);

export const selectHasPermission = createSelector(
  [selectCurrentAdmin, (_state: RootStateLike, permissionKey: string) => permissionKey],
  (admin, permissionKey) => {
    if (!admin) return false;
    if (admin.role === 'SUPER_ADMIN' || admin.role === 'Super Administrator') return true;
    const perms = admin.permissions || [];
    return perms.includes('access:all') || perms.includes('admin:all') || perms.includes(permissionKey);
  }
);
