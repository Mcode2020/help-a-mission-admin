import React from 'react';
import { Flag, Image as ImageIcon } from 'lucide-react';
import type { CmsMissionCTASectionContent } from '../../types';

interface CmsMissionCTAEditorProps {
  content: CmsMissionCTASectionContent;
  onChange: (updated: CmsMissionCTASectionContent) => void;
  onOpenMediaPicker: () => void;
}

export const CmsMissionCTAEditor: React.FC<CmsMissionCTAEditorProps> = ({
  content,
  onChange,
  onOpenMediaPicker,
}) => {
  const updateField = (field: keyof CmsMissionCTASectionContent, value: any) => {
    onChange({ ...content, [field]: value });
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <Flag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Be Part of Our Mission Banner</h3>
            <p className="text-xs text-slate-400">Manage bottom full-width call-to-action banner text, button link & background photo</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">Eyebrow Tagline</label>
          <input
            type="text"
            value={content.eyebrow || ''}
            onChange={(e) => updateField('eyebrow', e.target.value)}
            placeholder="BE A PART OF OUR MISSION"
            className="w-full bg-slate-950/80 text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-slate-800 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">CTA Button Label</label>
          <input
            type="text"
            value={content.ctaLabel || ''}
            onChange={(e) => updateField('ctaLabel', e.target.value)}
            placeholder="Donate Now"
            className="w-full bg-slate-950/80 text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-slate-800 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-300 mb-2">Banner Main Heading</label>
          <input
            type="text"
            value={content.heading || ''}
            onChange={(e) => updateField('heading', e.target.value)}
            placeholder="Be a Part of Our Mission"
            className="w-full bg-slate-950/80 text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-slate-800 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-300 mb-2">Sub-heading Description</label>
          <input
            type="text"
            value={content.subheading || ''}
            onChange={(e) => updateField('subheading', e.target.value)}
            placeholder="Join hands with us to create a better and brighter future."
            className="w-full bg-slate-950/80 text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-slate-800 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-300 mb-2">CTA Target Link URL</label>
          <input
            type="text"
            value={content.ctaUrl || ''}
            onChange={(e) => updateField('ctaUrl', e.target.value)}
            placeholder="#donate"
            className="w-full bg-slate-950/80 text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-slate-800 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        {/* Media Asset Picker Box */}
        <div className="md:col-span-2 p-4 rounded-xl bg-slate-950/40 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {content.bannerMediaUrl ? (
              <img src={content.bannerMediaUrl} alt="Mission Banner Media" className="w-14 h-10 object-cover rounded-lg border border-slate-700" />
            ) : (
              <div className="w-14 h-10 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-slate-500">
                <ImageIcon className="w-5 h-5" />
              </div>
            )}
            <div>
              <p className="text-xs font-semibold text-slate-200">Mission Banner Photo</p>
              <p className="text-[11px] text-slate-400">
                {content.bannerMediaAssetId ? `Asset ID: ${content.bannerMediaAssetId.slice(0, 12)}...` : 'No custom image selected (using default banner image)'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {content.bannerMediaUrl && (
              <button
                type="button"
                onClick={() => onChange({ ...content, bannerMediaAssetId: '', bannerMediaUrl: '' })}
                className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold rounded-xl border border-red-500/20 transition-colors cursor-pointer"
              >
                Remove Photo
              </button>
            )}
            <button
              type="button"
              onClick={onOpenMediaPicker}
              className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-md shadow-teal-500/20"
            >
              {content.bannerMediaUrl ? 'Change Photo' : 'Select Media Asset'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
