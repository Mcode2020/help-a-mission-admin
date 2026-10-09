import React from 'react';
import { Header } from '../components/layout/Header';
import { Loader2 } from 'lucide-react';
import { useGetAuditLogsQuery } from '../features/users/usersApi';

export const AuditLogPage: React.FC = () => {
  const { data: auditData, isLoading } = useGetAuditLogsQuery({ page: 1, limit: 50 });
  const logs = auditData?.data || [];

  return (
    <div className="flex-1 min-w-0">
      <Header title="Security & Operations Audit Trail" subtitle="Append-only log of all administrative actions, session events and data exports" />

      <div className="p-8 space-y-6">
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-6 py-4">Request ID</th>
                  <th className="px-6 py-4">Actor</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Entity</th>
                  <th className="px-6 py-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                        <span>Loading audit trail...</span>
                      </div>
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No audit log records found.</td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4 font-mono text-[11px] text-emerald-400">{log.request_id}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                          {log.actor_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-100">{log.action}</td>
                      <td className="px-6 py-4 text-slate-400 font-mono text-[11px]">{log.entity_type}</td>
                      <td className="px-6 py-4 text-slate-400 font-mono text-[11px]">
                        {log.created_at ? new Date(log.created_at).toLocaleString() : ''}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
