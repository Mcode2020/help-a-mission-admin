import React from 'react';
import { Users, Plus, Trash2, Image as ImageIcon, Droplet, Activity, Sprout, Heart, Sparkles } from 'lucide-react';
import type { CmsAboutSectionContent, CmsImpactCard } from '../../types';

export type AboutMediaTarget = 'about' | { type: 'about_card'; index: number };

interface CmsAboutEditorProps {
  content: CmsAboutSectionContent;
  onChange: (updated: CmsAboutSectionContent) => void;
  onOpenMediaPicker: (target?: AboutMediaTarget) => void;
}

export const CmsAboutEditor: React.FC<CmsAboutEditorProps> = ({
  content,
  onChange,
  onOpenMediaPicker,
}) => {
  const updateField = (field: keyof CmsAboutSectionContent, value: any) => {
    onChange({ ...content, [field]: value });
  };

  const handleUpdateCard = (index: number, field: keyof CmsImpactCard, value: any) => {
    const updatedCards = [...(content.impactCards || [])];
    updatedCards[index] = { ...updatedCards[index], [field]: value };
    onChange({ ...content, impactCards: updatedCards });
  };

  const handleAddCard = () => {
    const newCard: CmsImpactCard = {
      id: `card_${Date.now()}`,
      title: 'New Program Initiative',
      description: 'Program details and community impact description.',
      iconName: 'Droplet',
      sortOrder: (content.impactCards?.length || 0) + 1,
    };
    onChange({ ...content, impactCards: [...(content.impactCards || []), newCard] });
  };

  const handleRemoveCard = (index: number) => {
    const updatedCards = (content.impactCards || []).filter((_, i) => i !== index);
    onChange({ ...content, impactCards: updatedCards });
  };

  const updateCTA = (field: string, value: any) => {
    onChange({
      ...content,
      cta: {
        label: content.cta?.label || '',
        url: content.cta?.url || '',
        ...content.cta,
        [field]: value,
      },
    });
  };

  const renderIconPreview = (iconName?: string) => {
    switch (iconName) {
      case 'Droplet':
        return <Droplet className="w-4 h-4 text-teal-400" />;
      case 'HeartPulse':
      case 'Activity':
        return <Activity className="w-4 h-4 text-red-400" />;
      case 'Heart':
        return <Heart className="w-4 h-4 text-pink-400" />;
      case 'Users':
        return <Users className="w-4 h-4 text-blue-400" />;
      case 'Sprout':
        return <Sprout className="w-4 h-4 text-emerald-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">About Us & Impact Cards Configuration</h3>
            <p className="text-xs text-slate-400">Manage About paragraph, 10+ Years badge, image, CTA button & 4 core feature cards</p>
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
            placeholder="ABOUT US"
            className="w-full bg-slate-950/80 text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-slate-800 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">Highlight Experience Badge</label>
          <input
            type="text"
            value={content.experienceBadge || ''}
            onChange={(e) => updateField('experienceBadge', e.target.value)}
            placeholder="Serving society for 10+ years"
            className="w-full bg-slate-950/80 text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-slate-800 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-300 mb-2">Main Heading</label>
          <input
            type="text"
            value={content.heading || ''}
            onChange={(e) => updateField('heading', e.target.value)}
            placeholder="A Non-Profit Organisation Dedicated to Social Welfare"
            className="w-full bg-slate-950/80 text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-slate-800 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-300 mb-2">Body Description</label>
          <textarea
            rows={3}
            value={content.description || ''}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Help-A Mission Welfare Society is dedicated to the welfare and upliftment of society..."
            className="w-full bg-slate-950/80 text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-slate-800 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        {/* CTA Button Configuration */}
        <div className="md:col-span-2 p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-3">
          <h4 className="text-xs font-bold text-teal-400">Call To Action (CTA Button)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Button Label</label>
              <input
                type="text"
                value={content.cta?.label || ''}
                onChange={(e) => updateCTA('label', e.target.value)}
                placeholder="Know more"
                className="w-full bg-slate-900 text-slate-100 text-xs rounded-lg px-3 py-2 border border-slate-800 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Target Link URL</label>
              <input
                type="text"
                value={content.cta?.url || ''}
                onChange={(e) => updateCTA('url', e.target.value)}
                placeholder="/about"
                className="w-full bg-slate-900 text-slate-100 text-xs rounded-lg px-3 py-2 border border-slate-800 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>
        </div>

        {/* Media Asset Picker Box */}
        <div className="md:col-span-2 p-4 rounded-xl bg-slate-950/40 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {content.mediaUrl ? (
              <img src={content.mediaUrl} alt="About Us Asset" className="w-14 h-10 object-cover rounded-lg border border-slate-700" />
            ) : (
              <div className="w-14 h-10 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-slate-500">
                <ImageIcon className="w-5 h-5" />
              </div>
            )}
            <div>
              <p className="text-xs font-semibold text-slate-200">About Us Main Photo</p>
              <p className="text-[11px] text-slate-400">
                {content.mediaAssetId ? `Asset ID: ${content.mediaAssetId.slice(0, 12)}...` : 'Default image active'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenMediaPicker('about')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
          >
            Select Image
          </button>
        </div>
      </div>

      {/* Feature Cards Manager */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-200">Impact Feature Cards</h4>
          <button
            type="button"
            onClick={handleAddCard}
            className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-lg border border-emerald-500/30 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Card</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(content.impactCards || []).map((card, idx) => (
            <div key={card.id || idx} className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-3 relative group">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-teal-400">Card #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveCard(idx)}
                  className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                  title="Remove card"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Card Title</label>
                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) => handleUpdateCard(idx, 'title', e.target.value)}
                    className="w-full bg-slate-900 text-slate-100 text-xs rounded-lg px-3 py-2 border border-slate-800 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Card Icon (iconName)</label>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                      {renderIconPreview(card.iconName)}
                    </div>
                    <select
                      value={card.iconName || 'Droplet'}
                      onChange={(e) => handleUpdateCard(idx, 'iconName', e.target.value)}
                      className="w-full bg-slate-900 text-slate-100 text-xs rounded-lg px-3 py-2 border border-slate-800 focus:outline-none focus:border-emerald-500/50"
                    >
                      <option value="Droplet">Droplet (Blood Donation Camps)</option>
                      <option value="HeartPulse">HeartPulse (Health Awareness)</option>
                      <option value="Users">Users (Support for Needy)</option>
                      <option value="Sprout">Sprout (Community Development)</option>
                      <option value="Heart">Heart (Medical Care)</option>
                      <option value="Sparkles">Sparkles (General Initiative)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Description</label>
                <input
                  type="text"
                  value={card.description}
                  onChange={(e) => handleUpdateCard(idx, 'description', e.target.value)}
                  className="w-full bg-slate-900 text-slate-100 text-xs rounded-lg px-3 py-2 border border-slate-800 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

