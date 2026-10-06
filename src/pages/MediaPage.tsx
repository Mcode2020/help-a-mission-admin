import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Upload, Lock, Globe, CheckCircle2 } from 'lucide-react';
import { adminApi } from '../services/api';

export const MediaPage: React.FC = () => {
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadSuccess(null);
    try {
      const res = await adminApi.uploadMedia(file, visibility);
      setUploadSuccess(`File '${file.name}' uploaded successfully as ${visibility} asset! ID: ${res.id}`);
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex-1 min-w-0">
      <Header title="Media & Asset Storage Manager" subtitle="Manage public CDN files and authenticated private documents" />

      <div className="p-8 space-y-6">
        {uploadSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{uploadSuccess}</span>
          </div>
        )}

        <div className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-2xl border border-slate-800 space-y-6 max-w-2xl">
          <h3 className="text-base font-bold text-slate-100">Upload New Media Asset</h3>

          <div className="flex items-center gap-4">
            <label className="block text-xs font-semibold text-slate-300">Visibility Target:</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setVisibility('public')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  visibility === 'public'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>Public (CDN Subdomain)</span>
              </button>

              <button
                type="button"
                onClick={() => setVisibility('private')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  visibility === 'private'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>Private (Outside Web Root)</span>
              </button>
            </div>
          </div>

          <div className="border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-2xl p-8 text-center transition-colors">
            <Upload className="w-8 h-8 text-slate-500 mx-auto mb-3" />
            <p className="text-xs text-slate-300 font-semibold">Click to browse or drop file here</p>
            <p className="text-[11px] text-slate-500 mt-1">Supported: JPG, PNG, WEBP, PDF, CSV (max 10 MB)</p>
            <input
              type="file"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="mt-4 text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-400 file:text-slate-950 hover:file:bg-emerald-300 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
