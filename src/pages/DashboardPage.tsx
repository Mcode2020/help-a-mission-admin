import React from 'react';
import { Header } from '../components/layout/Header';
import {
  IndianRupee,
  Users,
  HeartHandshake,
  TrendingUp,
  Download,
  ShieldCheck,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { useGetDashboardQuery, useExportReportMutation } from '../features/donations/donationsApi';
import { useGetAuditLogsQuery } from '../features/users/usersApi';
import type { FinancialSummary } from '../types';

export const DashboardPage: React.FC = () => {
  const { data: dashboardData, isLoading: isDashboardLoading } = useGetDashboardQuery();
  const { data: auditData } = useGetAuditLogsQuery({ page: 1, limit: 5 });
  const [exportReport, { isLoading: isExporting }] = useExportReportMutation();

  const summary: FinancialSummary | undefined = (dashboardData as any)?.summary || dashboardData;
  const auditLogs = auditData?.data || [];

  const formatRupees = (paise?: number) => {
    if (typeof paise !== 'number') return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(paise / 100);
  };

  const handleExport = async () => {
    try {
      const result = await exportReport({ format: 'csv' }).unwrap();
      alert(`Report export generated! ${result.filename ? `File: ${result.filename}` : ''}`);
    } catch (err: any) {
      alert(`Export failed: ${err.message || 'Report generation error'}`);
    }
  };

  return (
    <div className="flex-1 min-w-0">
      <Header title="Dashboard & Financial Overview" subtitle="Real-time NGO fundraising, donation metrics and system activity" />

      <div className="p-8 space-y-8">
        {/* Quick Action Header Bar */}
        <div className="flex items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-semibold text-slate-300">Live RTK Cached Financial Pipeline</span>
          </div>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>{isExporting ? 'Exporting...' : 'Export CSV Financial Report'}</span>
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Gross Amount Card */}
          <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-800/80 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-400">Gross Donations</span>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <IndianRupee className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-100 tracking-tight">
              {isDashboardLoading ? <Loader2 className="w-6 h-6 animate-spin text-emerald-400" /> : formatRupees(summary?.grossAmountMinor)}
            </h3>
            <p className="text-xs text-emerald-400 font-medium mt-2 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Gross captured funds</span>
            </p>
          </div>

          {/* Net Amount Card */}
          <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-800/80 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl group-hover:bg-teal-500/20 transition-all" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-400">Net Donations</span>
              <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <HeartHandshake className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-100 tracking-tight">
              {isDashboardLoading ? <Loader2 className="w-6 h-6 animate-spin text-teal-400" /> : formatRupees(summary?.netAmountMinor)}
            </h3>
            <p className="text-xs text-teal-400 font-medium mt-2">After refunds deduction</p>
          </div>

          {/* Donors Count Card */}
          <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-800/80 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/10 rounded-full blur-2xl group-hover:bg-sky-500/20 transition-all" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-400">Unique Donors</span>
              <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-100 tracking-tight">
              {isDashboardLoading ? <Loader2 className="w-6 h-6 animate-spin text-sky-400" /> : (summary?.uniqueDonorsCount ?? 0)}
            </h3>
            <p className="text-xs text-sky-400 font-medium mt-2">Verified donor accounts</p>
          </div>

          {/* Average Donation Card */}
          <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-800/80 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-400">Average Donation</span>
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <IndianRupee className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-100 tracking-tight">
              {isDashboardLoading ? <Loader2 className="w-6 h-6 animate-spin text-amber-400" /> : formatRupees(summary?.averageDonationMinor)}
            </h3>
            <p className="text-xs text-amber-400 font-medium mt-2">Per successful contribution</p>
          </div>
        </div>

        {/* Audit Stream Section */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-semibold text-slate-100">Recent Security Audit Stream</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono font-medium">Request-ID Correlated</span>
          </div>

          <div className="space-y-3">
            {auditLogs.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No recent audit log events recorded.</p>
            ) : (
              auditLogs.map((log: any) => (
                <div key={log.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-200">{log.action}</span>
                      <span className="text-slate-500 ml-2">({log.entity_type})</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
                    <span>req: {log.request_id ? `${log.request_id.slice(0, 12)}...` : 'N/A'}</span>
                    <span>{log.created_at ? new Date(log.created_at).toLocaleTimeString() : ''}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
