import React from 'react';
import { Sparkles, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import type { CmsInitiativesSectionContent, CmsInitiativeCard } from '../../types';

export type InitiativesMediaTarget = { type: 'initiatives_card'; index: number };

interface CmsInitiativesEditorProps {
  content: CmsInitiativesSectionContent;
  onChange: (updated: CmsInitiativesSectionContent) => void;
  onOpenMediaPicker: (target: InitiativesMediaTarget) => void;
}

export const CmsInitiativesEditor: React.FC<CmsInitiativesEditorProps> = ({
  content,
  onChange,
  onOpenMediaPicker,
}) => {
  const updateField = (field: keyof CmsInitiativesSectionContent, value: any) => {
    onChange({ ...content, [field]: value });
  };

  const handleUpdateCard = (index: number, field: keyof CmsInitiativeCard, value: any) => {
    const updatedCards = [...(content.initiatives || [])];
    updatedCards[index] = { ...updatedCards[index], [field]: value };
    onChange({ ...content, initiatives: updatedCards });
  };

  const handleRemoveCardImage = (index: number) => {
    const updatedCards = [...(content.initiatives || [])];
    updatedCards[index] = {
      ...updatedCards[index],
      mediaAssetId: '',
      mediaUrl: '',
    };
    onChange({ ...content, initiatives: updatedCards });
  };

  const handleAddCard = () => {
    const newCard: CmsInitiativeCard = {
      id: `init_${Date.now()}`,
      title: 'New Welfare Initiative',
      description: 'Program description and community welfare impact details.',
      linkUrl: '/campaigns',
      category: 'Welfare',
      sortOrder: (content.initiatives?.length || 0) + 1,
    };
    onChange({ ...content, initiatives: [...(content.initiatives || []), newCard] });
  };

  const handleRemoveCard = (index: number) => {
    const updatedCards = (content.initiatives || []).filter((_, i) => i !== index);
    onChange({ ...content, initiatives: updatedCards });
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Our Work / Initiatives Section Configuration</h3>
            <p className="text-xs text-slate-400">Manage section copy, active initiative cards & card images displayed on homepage</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-300 mb-2">Eyebrow Tagline</label>
          <input
            type="text"
            value={content.eyebrow || ''}
            onChange={(e) => updateField('eyebrow', e.target.value)}
            placeholder="OUR WORK"
            className="w-full bg-slate-950/80 text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-slate-800 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-300 mb-2">Section Heading</label>
          <input
            type="text"
            value={content.heading || ''}
            onChange={(e) => updateField('heading', e.target.value)}
            placeholder="Creating Impact Through Meaningful Initiatives"
            className="w-full bg-slate-950/80 text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-slate-800 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-300 mb-2">Sub-heading Description</label>
          <textarea
            rows={3}
            value={content.description || ''}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="We focus on various welfare activities to support communities and build a healthier society."
            className="w-full bg-slate-950/80 text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-slate-800 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
      </div>

      {/* Initiatives Cards Manager */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-200">Our Work Initiative Cards</h4>
          <button
            type="button"
            onClick={handleAddCard}
            className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-lg border border-emerald-500/30 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Initiative Card</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(content.initiatives || []).map((card, idx) => (
            <div key={card.id || idx} className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-3 relative group">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-purple-400">Card #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveCard(idx)}
                  className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                  title="Remove initiative card"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Card Title</label>
                <input
                  type="text"
                  value={card.title}
                  onChange={(e) => handleUpdateCard(idx, 'title', e.target.value)}
                  placeholder="Initiative Title"
                  className="w-full bg-slate-900 text-slate-100 text-xs rounded-lg px-3 py-2 border border-slate-800 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              {/* Hero-Style Card Cover Photo Picker */}
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {card.mediaUrl ? (
                    <img src={card.mediaUrl} alt={card.title} className="w-14 h-10 object-cover rounded-lg border border-slate-700 shrink-0" />
                  ) : (
                    <div className="w-14 h-10 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-slate-500 shrink-0">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-200 truncate">Card Cover Photo</p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {card.mediaAssetId ? `Asset ID: ${card.mediaAssetId.slice(0, 12)}...` : card.mediaUrl ? 'Custom Image Active' : 'No photo selected'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {card.mediaUrl && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCardImage(idx)}
                      className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold rounded-xl border border-red-500/20 transition-colors cursor-pointer"
                    >
                      Remove Photo
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onOpenMediaPicker({ type: 'initiatives_card', index: idx })}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-md shadow-emerald-500/20"
                  >
                    {card.mediaUrl ? 'Change Photo' : 'Select Media Asset'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={card.description}
                  onChange={(e) => handleUpdateCard(idx, 'description', e.target.value)}
                  placeholder="Initiative description..."
                  className="w-full bg-slate-900 text-slate-100 text-xs rounded-lg px-3 py-2 border border-slate-800 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Category Tag</label>
                  <input
                    type="text"
                    value={card.category || ''}
                    onChange={(e) => handleUpdateCard(idx, 'category', e.target.value)}
                    placeholder="Health, Support, etc."
                    className="w-full bg-slate-900 text-slate-100 text-xs rounded-lg px-3 py-2 border border-slate-800 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Link URL</label>
                  <input
                    type="text"
                    value={card.linkUrl || ''}
                    onChange={(e) => handleUpdateCard(idx, 'linkUrl', e.target.value)}
                    placeholder="/campaigns"
                    className="w-full bg-slate-900 text-slate-100 text-xs rounded-lg px-3 py-2 border border-slate-800 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

