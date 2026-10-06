import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const AdminLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col min-h-screen bg-slate-950/50">
        <Outlet />
      </main>
    </div>
  );
};
