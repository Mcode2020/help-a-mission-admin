import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Receipt, Download, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import { adminApi } from '../services/api';

export const ReportsPage: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  const handleExport = async (format: string) => {
    setIsExporting(true);
    setExportSuccess(null);
    try {
      const res = await adminApi.exportReport(format);
      setExportSuccess(`Report generated successfully! Saved to private storage: ${res.relativePath}`);
    } catch (err: any) {
      alert(`Export error: ${err.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex-1 min-w-0">
      <Header title="Reports & Financial Export Engine" subtitle="Generate private CSV/PDF financial summaries with full audit logging" />

      <div className="p-8 space-y-6">
        {exportSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{exportSuccess}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CSV Export Card */}
          <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
            <div className="p-3 w-fit rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">CSV Financial Transaction Export</h3>
              <p className="text-xs text-slate-400 mt-1">Export complete captured gross, refund, and net donation records into structured CSV format.</p>
            </div>
            <button
              disabled={isExporting}
              onClick={() => handleExport('csv')}
              className="w-full py-3 rounded-xl text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Generating...' : 'Generate Private CSV Export'}</span>
            </button>
          </div>

          {/* PDF Summary Export Card */}
          <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
            <div className="p-3 w-fit rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">PDF Monthly NGO Summary Report</h3>
              <p className="text-xs text-slate-400 mt-1">Generate signed PDF financial audit summary for NGO executive reporting.</p>
            </div>
            <button
              disabled={isExporting}
              onClick={() => handleExport('pdf')}
              className="w-full py-3 rounded-xl text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Generating...' : 'Generate Private PDF Export'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
