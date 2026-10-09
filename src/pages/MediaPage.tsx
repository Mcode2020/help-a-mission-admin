import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Upload, Lock, Globe, CheckCircle2, Loader2, HardDrive } from 'lucide-react';
import { useGetMediaAssetsQuery, useUploadMediaMutation } from '../features/users/usersApi';

export const MediaPage: React.FC = () => {
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const { data: mediaData, isLoading: isLoadingMedia } = useGetMediaAssetsQuery({ page: 1, limit: 30 });
  const [uploadMedia, { isLoading: isUploading }] = useUploadMediaMutation();

  const mediaAssets = mediaData?.data || [];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadSuccess(null);
    try {
      const res = await uploadMedia({ file, visibility }).unwrap();
      setUploadSuccess(`File '${file.name}' uploaded successfully as ${visibility} asset! ID: ${res.id}`);
    } catch (err: any) {
      alert(`Upload failed: ${err.data?.message || err.message}`);
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Form Panel */}
          <div className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-2xl border border-slate-800 space-y-6">
            <h3 className="text-base font-bold text-slate-100">Upload New Media Asset</h3>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Visibility Target:</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setVisibility('public')}
                  className={`flex-1 px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    visibility === 'public'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Public</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVisibility('private')}
                  className={`flex-1 px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    visibility === 'private'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Private</span>
                </button>
              </div>
            </div>

            <div className="border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 text-center transition-colors">
              <Upload className="w-8 h-8 text-slate-500 mx-auto mb-3" />
              <p className="text-xs text-slate-300 font-semibold">Click to browse file</p>
              <p className="text-[11px] text-slate-500 mt-1">Supported: JPG, PNG, WEBP, PDF, CSV</p>
              <input
                type="file"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="mt-4 text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-400 file:text-slate-950 hover:file:bg-emerald-300 cursor-pointer"
              />
              {isUploading && (
                <div className="mt-3 text-xs text-emerald-400 flex items-center justify-center gap-1 font-semibold">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Uploading asset...</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Assets Gallery Stream */}
          <div className="lg:col-span-2 bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-100">Media Library Assets ({mediaAssets.length})</h3>
              </div>
            </div>

            {isLoadingMedia ? (
              <div className="p-8 text-center text-slate-500 text-xs flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                <span>Loading media library...</span>
              </div>
            ) : mediaAssets.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs border border-slate-800/80 rounded-xl">
                No media assets found in database. Upload your first asset using the form.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-1">
                {mediaAssets.map((asset) => (
                  <div key={asset.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 group">
                    {asset.public_url ? (
                      <img src={asset.public_url} alt="Asset" className="w-full h-28 object-cover rounded-lg" />
                    ) : (
                      <div className="w-full h-28 bg-slate-900 rounded-lg flex items-center justify-center text-slate-600 text-xs font-mono">
                        {asset.mime_type || 'FILE'}
                      </div>
                    )}
                    <div className="text-[10px] font-mono text-slate-400 truncate">{asset.relative_path || asset.id}</div>
                    <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-800 text-emerald-400">
                      {asset.visibility}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
