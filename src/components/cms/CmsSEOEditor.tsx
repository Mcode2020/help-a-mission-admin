import React from 'react';
import { Search, Image as ImageIcon } from 'lucide-react';
import type { CmsSEOSectionContent } from '../../types';

interface CmsSEOEditorProps {
  content: CmsSEOSectionContent;
  onChange: (updated: CmsSEOSectionContent) => void;
  onOpenMediaPicker: () => void;
}

export const CmsSEOEditor: React.FC<CmsSEOEditorProps> = ({
  content,
  onChange,
  onOpenMediaPicker,
}) => {
  const updateField = (field: keyof CmsSEOSectionContent, value: any) => {
    onChange({ ...content, [field]: value });
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">SEO & OpenGraph Metadata Configuration</h3>
            <p className="text-xs text-slate-400">Manage search engine meta tags, social share preview card & keywords</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-300 mb-2">Meta Title</label>
          <input
            type="text"
            value={content.metaTitle || ''}
            onChange={(e) => updateField('metaTitle', e.target.value)}
            placeholder="Help-A Mission Welfare Society | Empowering Society"
            className="w-full bg-slate-950/80 text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-slate-800 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-300 mb-2">Meta Description</label>
          <textarea
            rows={3}
            value={content.metaDescription || ''}
            onChange={(e) => updateField('metaDescription', e.target.value)}
            placeholder="Help-A Mission Welfare Society is a non-profit organisation dedicated to healthcare awareness, blood donation camps, and social welfare across India."
            className="w-full bg-slate-950/80 text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-slate-800 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">Canonical URL</label>
          <input
            type="text"
            value={content.canonicalUrl || ''}
            onChange={(e) => updateField('canonicalUrl', e.target.value)}
            placeholder="https://helpamission.org"
            className="w-full bg-slate-950/80 text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-slate-800 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">Keywords (Comma separated)</label>
          <input
            type="text"
            value={content.keywords || ''}
            onChange={(e) => updateField('keywords', e.target.value)}
            placeholder="NGO, Welfare, Blood Donation, Health Camp, India"
            className="w-full bg-slate-950/80 text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-slate-800 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        {/* OG Share Image Asset Picker */}
        <div className="md:col-span-2 p-4 rounded-xl bg-slate-950/40 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {content.ogMediaUrl ? (
              <img src={content.ogMediaUrl} alt="OG Media" className="w-14 h-10 object-cover rounded-lg border border-slate-700" />
            ) : (
              <div className="w-14 h-10 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-slate-500">
                <ImageIcon className="w-5 h-5" />
              </div>
            )}
            <div>
              <p className="text-xs font-semibold text-slate-200">OpenGraph Social Share Image</p>
              <p className="text-[11px] text-slate-400">
                {content.ogMediaAssetId ? `Asset ID: ${content.ogMediaAssetId.slice(0, 12)}...` : 'Default logo social card active'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenMediaPicker}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
          >
            Select Image
          </button>
        </div>
      </div>
    </div>
  );
};
