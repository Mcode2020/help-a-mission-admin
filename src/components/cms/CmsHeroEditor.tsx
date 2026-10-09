import React from 'react';
import { Layout, Image as ImageIcon } from 'lucide-react';
import type { CmsHeroSectionContent } from '../../types';

interface CmsHeroEditorProps {
  content: CmsHeroSectionContent;
  onChange: (updated: CmsHeroSectionContent) => void;
  onOpenMediaPicker: () => void;
}

export const CmsHeroEditor: React.FC<CmsHeroEditorProps> = ({
  content,
  onChange,
  onOpenMediaPicker,
}) => {
  const updateField = (field: keyof CmsHeroSectionContent, value: any) => {
    onChange({ ...content, [field]: value });
  };

  const updatePrimaryCTA = (field: string, value: any) => {
    onChange({
      ...content,
      primaryCTA: { ...content.primaryCTA, [field]: value },
    });
  };

  const updateSecondaryCTA = (field: string, value: any) => {
    onChange({
      ...content,
      secondaryCTA: { ...content.secondaryCTA, [field]: value },
    });
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Layout className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Hero Banner Configuration</h3>
            <p className="text-xs text-slate-400">Manage hero main title, eyebrow badge, CTAs & background banner photo</p>
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
            placeholder="FOR DEDICATED WORK"
            className="w-full bg-slate-950/80 text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-slate-800 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">Main Headline</label>
          <input
            type="text"
            value={content.heading || ''}
            onChange={(e) => updateField('heading', e.target.value)}
            placeholder="Help-A Mission Welfare Society"
            className="w-full bg-slate-950/80 text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-slate-800 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-300 mb-2">Body Description</label>
          <textarea
            rows={3}
            value={content.body || ''}
            onChange={(e) => updateField('body', e.target.value)}
            placeholder="Empowering society through education, healthcare, and social support."
            className="w-full bg-slate-950/80 text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-slate-800 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        {/* Primary CTA */}
        <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-3">
          <h4 className="text-xs font-bold text-emerald-400">Primary CTA Button</h4>
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Button Label</label>
            <input
              type="text"
              value={content.primaryCTA?.label || ''}
              onChange={(e) => updatePrimaryCTA('label', e.target.value)}
              placeholder="Contact Us"
              className="w-full bg-slate-900 text-slate-100 text-xs rounded-lg px-3 py-2 border border-slate-800 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Target Link URL</label>
            <input
              type="text"
              value={content.primaryCTA?.url || ''}
              onChange={(e) => updatePrimaryCTA('url', e.target.value)}
              placeholder="#contact"
              className="w-full bg-slate-900 text-slate-100 text-xs rounded-lg px-3 py-2 border border-slate-800 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
        </div>

        {/* Secondary CTA */}
        <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-3">
          <h4 className="text-xs font-bold text-teal-400">Secondary CTA Button</h4>
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Button Label</label>
            <input
              type="text"
              value={content.secondaryCTA?.label || ''}
              onChange={(e) => updateSecondaryCTA('label', e.target.value)}
              placeholder="About Us"
              className="w-full bg-slate-900 text-slate-100 text-xs rounded-lg px-3 py-2 border border-slate-800 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Target Link URL</label>
            <input
              type="text"
              value={content.secondaryCTA?.url || ''}
              onChange={(e) => updateSecondaryCTA('url', e.target.value)}
              placeholder="#about"
              className="w-full bg-slate-900 text-slate-100 text-xs rounded-lg px-3 py-2 border border-slate-800 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
        </div>

        {/* Media Asset Picker Box */}
        <div className="md:col-span-2 p-4 rounded-xl bg-slate-950/40 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {content.heroMediaUrl ? (
              <img src={content.heroMediaUrl} alt="Hero Media" className="w-14 h-10 object-cover rounded-lg border border-slate-700" />
            ) : (
              <div className="w-14 h-10 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-slate-500">
                <ImageIcon className="w-5 h-5" />
              </div>
            )}
            <div>
              <p className="text-xs font-semibold text-slate-200">Hero Banner Photo</p>
              <p className="text-[11px] text-slate-400">
                {content.heroMediaAssetId ? `Asset ID: ${content.heroMediaAssetId.slice(0, 12)}...` : 'No custom image selected (using default banner)'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {content.heroMediaUrl && (
              <button
                type="button"
                onClick={() => onChange({ ...content, heroMediaAssetId: '', heroMediaUrl: '' })}
                className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold rounded-xl border border-red-500/20 transition-colors cursor-pointer"
              >
                Remove Photo
              </button>
            )}
            <button
              type="button"
              onClick={onOpenMediaPicker}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-md shadow-emerald-500/20"
            >
              {content.heroMediaUrl ? 'Change Photo' : 'Select Media Asset'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
