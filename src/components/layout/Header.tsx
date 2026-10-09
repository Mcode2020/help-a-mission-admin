import React from 'react';
import { ShieldCheck, Bell, Search, Activity } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectSearchQuery, setSearchQuery } from '../../features/ui/uiSlice';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector(selectSearchQuery);

  return (
    <header className="bg-slate-900/60 backdrop-blur-md border-b border-slate-800/80 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
      <div>
        <h2 className="text-xl font-bold text-slate-100 tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-slate-400 font-medium mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* System Health Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>System Operational</span>
        </div>

        {/* Global Quick Search */}
        <div className="relative hidden lg:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            placeholder="Search transactions, donors, CMS..."
            className="w-64 bg-slate-950/60 text-slate-200 text-xs rounded-xl pl-9 pr-4 py-2 border border-slate-800 focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-slate-500"
          />
        </div>

        {/* Security / MFA Indicator */}
        <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-xl border border-slate-700/50 text-xs font-medium text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline">TOTP Hardened</span>
        </div>

        {/* Notification Bell */}
        <button className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl border border-slate-800 transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-emerald-400 absolute top-1.5 right-1.5 ring-2 ring-slate-900" />
        </button>
      </div>
    </header>
  );
};
