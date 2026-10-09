import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AdminLayout } from './components/layout/AdminLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { DonorsPage } from './pages/DonorsPage';
import { DonationsPage } from './pages/DonationsPage';
import { ReportsPage } from './pages/ReportsPage';
import { CmsPage } from './pages/CmsPage';
import { InitiativesPage } from './pages/InitiativesPage';
import { GalleryPage } from './pages/GalleryPage';
import { MediaPage } from './pages/MediaPage';
import { RbacPage } from './pages/RbacPage';
import { AuditLogPage } from './pages/AuditLogPage';


const ProtectedRoute: React.FC<{ children: React.ReactNode; permission?: string }> = ({
  children,
  permission,
}) => {
  const { isAuthenticated, isLoading, hasPermission } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
        Verifying admin session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (permission && !hasPermission(permission)) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs">
        Access Denied. You lack required permission ({permission}).
      </div>
    );
  }

  return <>{children}</>;
};

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route
              path="donors"
              element={
                <ProtectedRoute permission="donors:read">
                  <DonorsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="donations"
              element={
                <ProtectedRoute permission="donations:read">
                  <DonationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="reports"
              element={
                <ProtectedRoute permission="reports:read">
                  <ReportsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="cms"
              element={
                <ProtectedRoute permission="cms:read">
                  <CmsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="initiatives"
              element={
                <ProtectedRoute permission="initiatives:write">
                  <InitiativesPage />
                </ProtectedRoute>
              }
            />
            <Route path="members" element={<Navigate to="/cms" replace />} />
            <Route
              path="gallery"
              element={
                <ProtectedRoute permission="gallery:write">
                  <GalleryPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="media"
              element={
                <ProtectedRoute permission="media:write">
                  <MediaPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="rbac"
              element={
                <ProtectedRoute permission="rbac:read">
                  <RbacPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="audit"
              element={
                <ProtectedRoute permission="security:read">
                  <AuditLogPage />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
