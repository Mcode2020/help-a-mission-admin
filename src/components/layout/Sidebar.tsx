import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  HeartHandshake,
  Receipt,
  FileText,
  FolderTree,
  Image as ImageIcon,
  ShieldAlert,
  Users,
  HardDrive,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { admin, logout, hasPermission } = useAuth();

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/', permission: 'reports:read' },
    { label: 'Donors', icon: Users, path: '/donors', permission: 'donors:read' },
    { label: 'Donations', icon: HeartHandshake, path: '/donations', permission: 'donations:read' },
    { label: 'Reports', icon: Receipt, path: '/reports', permission: 'reports:read' },
    { label: 'CMS Manager', icon: FileText, path: '/cms', permission: 'cms:read' },
    { label: 'Initiatives', icon: FolderTree, path: '/initiatives', permission: 'initiatives:write' },
    { label: 'Gallery', icon: ImageIcon, path: '/gallery', permission: 'gallery:write' },
    { label: 'Media Library', icon: HardDrive, path: '/media', permission: 'media:write' },
    { label: 'RBAC Roles', icon: ShieldAlert, path: '/rbac', permission: 'rbac:read' },
    { label: 'Audit Logs', icon: ShieldAlert, path: '/audit', permission: 'security:read' },
  ];

  return (
    <aside className="w-64 bg-slate-900/90 backdrop-blur-xl border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0 z-30">
      <div>
        {/* NGO Brand Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center rounded-lg justify-center shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="font-bold text-slate-100 text-sm tracking-wide leading-tight">Help A Mission</h1>
            <p className="text-xs font-medium text-emerald-400">Admin Control Hub</p>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-160px)]">
          {menuItems.map((item) => {
            if (item.permission && !hasPermission(item.permission)) {
              return null;
            }

            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-300 border border-emerald-500/30 shadow-md shadow-emerald-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Footer Card */}
      <div className="p-4 border-t border-slate-800/80">
        <div className="bg-slate-800/60 rounded-xl p-3 flex items-center justify-between border border-slate-700/50">
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-slate-200 truncate">{admin?.email}</p>
            <p className="text-[10px] text-emerald-400 font-mono font-medium truncate">{admin?.role || 'Super Admin'}</p>
          </div>
          <button
            onClick={logout}
            title="Log out"
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
