import React, { useState } from 'react';
import { HeartHandshake, Plus, Trash2, Image as ImageIcon, Check, FormInput } from 'lucide-react';
import type { CmsDonationSectionContent, CmsDonationBadge, CmsFormField } from '../../types';

interface CmsDonationEditorProps {
  content: CmsDonationSectionContent;
  onChange: (updated: CmsDonationSectionContent) => void;
  onOpenMediaPicker: () => void;
}

export const CmsDonationEditor: React.FC<CmsDonationEditorProps> = ({
  content,
  onChange,
  onOpenMediaPicker,
}) => {
  const [newPresetVal, setNewPresetVal] = useState<string>('');

  const updateField = (field: keyof CmsDonationSectionContent, value: any) => {
    onChange({ ...content, [field]: value });
  };

  const handleUpdateBadge = (index: number, field: keyof CmsDonationBadge, value: any) => {
    const updatedBadges = [...(content.badges || [])];
    updatedBadges[index] = { ...updatedBadges[index], [field]: value };
    onChange({ ...content, badges: updatedBadges });
  };

  const handleAddBadge = () => {
    const newBadge: CmsDonationBadge = {
      id: `badge_${Date.now()}`,
      icon: 'Heart',
      label: 'New Highlight',
    };
    onChange({ ...content, badges: [...(content.badges || []), newBadge] });
  };

  const handleRemoveBadge = (index: number) => {
    const updatedBadges = (content.badges || []).filter((_, i) => i !== index);
    onChange({ ...content, badges: updatedBadges });
  };

  const handleAddPresetAmount = () => {
    const num = parseInt(newPresetVal, 10);
    if (isNaN(num) || num <= 0) return;
    const current = content.suggestedAmountsINR || [500, 1000, 2000, 5000];
    if (!current.includes(num)) {
      const updated = [...current, num].sort((a, b) => a - b);
      onChange({ ...content, suggestedAmountsINR: updated });
    }
    setNewPresetVal('');
  };

  const handleRemovePresetAmount = (amount: number) => {
    const updated = (content.suggestedAmountsINR || []).filter((a) => a !== amount);
    onChange({ ...content, suggestedAmountsINR: updated });
  };

  const defaultFields: CmsFormField[] = [
    { id: 'f1', label: 'Full Name', type: 'text', placeholder: 'Enter your name', required: true },
    { id: 'f2', label: 'Email Address', type: 'email', placeholder: 'Enter your email', required: true },
    { id: 'f3', label: 'Phone Number', type: 'tel', placeholder: 'Enter your phone number', required: true },
    { id: 'f4', label: 'Message', type: 'textarea', placeholder: 'Anything you would like us to know?', required: false },
  ];

  const activeCustomFields = content.customFields ?? defaultFields;

  const handleAddCustomField = () => {
    const newField: CmsFormField = {
      id: `field_${Date.now()}`,
      label: 'New Field Label',
      type: 'text',
      placeholder: 'Enter details',
      required: false,
    };
    onChange({ ...content, customFields: [...activeCustomFields, newField] });
  };

  const handleUpdateCustomField = (index: number, key: keyof CmsFormField, value: any) => {
    const updated = [...activeCustomFields];
    updated[index] = { ...updated[index], [key]: value };
    onChange({ ...content, customFields: updated });
  };

  const handleRemoveCustomField = (index: number) => {
    const updated = activeCustomFields.filter((_, i) => i !== index);
    onChange({ ...content, customFields: updated });
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Make a Difference / Donation Fund Config</h3>
            <p className="text-xs text-slate-400">Configure left brand copy, badges, photo & right donation card preset amounts</p>
          </div>
        </div>
      </div>

      {/* Left Informational Side Form */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">1. Left Informational Side Content</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Eyebrow Tagline</label>
            <input
              type="text"
              value={content.eyebrow || ''}
              onChange={(e) => updateField('eyebrow', e.target.value)}
              placeholder="SUPPORT OUR MISSION"
              className="w-full bg-slate-950/80 text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-slate-800 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Main Heading</label>
            <input
              type="text"
              value={content.heading || ''}
              onChange={(e) => updateField('heading', e.target.value)}
              placeholder="Make a Difference Today"
              className="w-full bg-slate-950/80 text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-slate-800 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-2">Body Copy</label>
            <textarea
              rows={3}
              value={content.body || ''}
              onChange={(e) => updateField('body', e.target.value)}
              placeholder="Your contribution helps us organize health camps, support needy individuals and create awareness in communities."
              className="w-full bg-slate-950/80 text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-slate-800 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
        </div>

        {/* Highlight Badges */}
        <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-semibold text-slate-300">Highlight Badges (3 Badges with Icons)</h5>
            <button
              type="button"
              onClick={handleAddBadge}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Badge</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(content.badges || []).map((b, idx) => (
              <div key={b.id || idx} className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2 relative">
                <button
                  type="button"
                  onClick={() => handleRemoveBadge(idx)}
                  className="absolute top-2 right-2 text-slate-500 hover:text-red-400 p-0.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Badge Icon</label>
                  <select
                    value={b.icon}
                    onChange={(e) => handleUpdateBadge(idx, 'icon', e.target.value)}
                    className="w-full bg-slate-950 text-slate-200 text-xs rounded-md px-2 py-1 border border-slate-800"
                  >
                    <option value="Heart">Heart (Red)</option>
                    <option value="Users">Users (Blue)</option>
                    <option value="GraduationCap">GraduationCap (Orange)</option>
                    <option value="Sparkles">Sparkles</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Label Text</label>
                  <input
                    type="text"
                    value={b.label}
                    onChange={(e) => handleUpdateBadge(idx, 'label', e.target.value)}
                    className="w-full bg-slate-950 text-slate-200 text-xs rounded-md px-2 py-1 border border-slate-800"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Image Asset Box */}
        <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {content.featureMediaUrl ? (
              <img src={content.featureMediaUrl} alt="Donation Feature" className="w-14 h-10 object-cover rounded-lg border border-slate-700" />
            ) : (
              <div className="w-14 h-10 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-slate-500">
                <ImageIcon className="w-5 h-5" />
              </div>
            )}
            <div>
              <p className="text-xs font-semibold text-slate-200">Donation Section Feature Photo (Hands holding Globe)</p>
              <p className="text-[11px] text-slate-400">
                {content.featureMediaAssetId ? `Asset ID: ${content.featureMediaAssetId.slice(0, 12)}...` : 'Default image active'}
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

      {/* Right Interactive Donation Card Form */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider">2. Right Interactive Donation Card Config</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Card Title</label>
            <input
              type="text"
              value={content.cardTitle || ''}
              onChange={(e) => updateField('cardTitle', e.target.value)}
              placeholder="Donation Fund"
              className="w-full bg-slate-950/80 text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-slate-800 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Donate Button Label</label>
            <input
              type="text"
              value={content.donateButtonLabel || ''}
              onChange={(e) => updateField('donateButtonLabel', e.target.value)}
              placeholder="Donate"
              className="w-full bg-slate-950/80 text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-slate-800 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-2">Card Subtitle</label>
            <input
              type="text"
              value={content.cardSubtitle || ''}
              onChange={(e) => updateField('cardSubtitle', e.target.value)}
              placeholder="Every contribution counts. Choose an amount or enter your own."
              className="w-full bg-slate-950/80 text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-slate-800 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
        </div>

        {/* Preset Amounts Manager & Custom Amount Toggle */}
        <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div>
              <p className="text-xs font-semibold text-slate-200">Custom Amount Option</p>
              <p className="text-[11px] text-slate-400">Show &quot;Custom&quot; button on frontend so donors can enter any amount</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={content.customAmountEnabled !== false}
                onChange={(e) => updateField('customAmountEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          {content.customAmountEnabled !== false && (
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-teal-300 mb-1">
                  Custom Button Text / Label
                </label>
                <input
                  type="text"
                  value={content.customAmountButtonLabel || ''}
                  onChange={(e) => updateField('customAmountButtonLabel', e.target.value)}
                  placeholder="e.g. Custom or अपनी राशि"
                  className="w-full bg-slate-950 text-slate-100 text-xs rounded-lg px-3 py-2 border border-slate-800 focus:outline-none focus:border-teal-500/50"
                />
                <p className="text-[10px] text-slate-400 mt-1">Button text shown on donation card preset options (Default: Custom)</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-800/80 pt-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Field Label</label>
                  <input
                    type="text"
                    value={content.customAmountInputLabel || ''}
                    onChange={(e) => updateField('customAmountInputLabel', e.target.value)}
                    placeholder="e.g. Enter Custom Amount (₹) or अपनी राशि दर्ज करें"
                    className="w-full bg-slate-950 text-slate-100 text-xs rounded-lg px-3 py-2 border border-slate-800 focus:outline-none focus:border-teal-500/50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Input Type</label>
                  <select
                    disabled
                    value="number"
                    className="w-full bg-slate-950/60 text-slate-400 text-xs rounded-lg px-3 py-2 border border-slate-800/80 cursor-not-allowed"
                  >
                    <option value="number">number (Numeric Input)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Placeholder Text</label>
                  <input
                    type="text"
                    value={content.customAmountPlaceholder || ''}
                    onChange={(e) => updateField('customAmountPlaceholder', e.target.value)}
                    placeholder="e.g. Enter amount in ₹ or ₹ दर्ज करें"
                    className="w-full bg-slate-950 text-slate-100 text-xs rounded-lg px-3 py-2 border border-slate-800 focus:outline-none focus:border-teal-500/50"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-slate-800/60">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={content.customAmountRequired !== false}
                    onChange={(e) => updateField('customAmountRequired', e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500/20 bg-slate-950 cursor-pointer"
                  />
                  <span>Mark as Required Field (<span className="text-red-400">*</span>)</span>
                </label>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Suggested Preset Amounts (INR ₹)</label>
            <div className="flex flex-wrap gap-2 items-center">
              {(content.suggestedAmountsINR || [500, 1000, 2000, 5000]).map((amt) => {
                const isDefault = content.defaultAmountINR === amt;
                return (
                  <div
                    key={amt}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                      isDefault
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                        : 'bg-slate-900 text-slate-200 border-slate-800'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => updateField('defaultAmountINR', amt)}
                      className="flex items-center gap-1.5 text-left"
                      title="Click to set as default selected amount"
                    >
                      {isDefault && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      <span>₹{amt.toLocaleString('en-IN')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemovePresetAmount(amt)}
                      className="text-slate-500 hover:text-red-400"
                    >
                      &times;
                    </button>
                  </div>
                );
              })}

              {content.customAmountEnabled !== false && (
                <div className="px-3 py-1.5 rounded-xl border border-teal-500/30 bg-teal-500/10 text-teal-300 text-xs font-bold flex items-center gap-1.5" title="Custom Amount button is active">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                  <span>{content.customAmountButtonLabel || 'Custom Amount'}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-3">
              <input
                type="number"
                placeholder="Add preset amount (e.g. 10000)"
                value={newPresetVal}
                onChange={(e) => setNewPresetVal(e.target.value)}
                className="w-48 bg-slate-900 text-slate-100 text-xs rounded-lg px-3 py-2 border border-slate-800 focus:outline-none focus:border-emerald-500/50"
              />
              <button
                type="button"
                onClick={handleAddPresetAmount}
                className="px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg transition-all"
              >
                Add Preset
              </button>
            </div>
            <p className="text-[11px] text-slate-400 pt-1">Click an amount chip to set it as the default selected amount on page load.</p>
          </div>
        </div>

        {/* Dynamic Form Fields Builder */}
        <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FormInput className="w-4 h-4 text-teal-400" />
              <h5 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Form Fields Configuration (Dynamic Builder)
              </h5>
            </div>
            <button
              type="button"
              onClick={handleAddCustomField}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Field</span>
            </button>
          </div>
          <p className="text-xs text-slate-400">
            Configure, edit, re-order or add donation card input fields (e.g. Full Name, Email, Phone, PAN Card, City) dynamically.
          </p>

          {activeCustomFields.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-900/60 border border-dashed border-slate-800 text-center text-xs text-slate-500">
              No input fields configured. Click &quot;+ Add Field&quot; above to create one.
            </div>
          ) : (
            <div className="space-y-3">
              {activeCustomFields.map((field, idx) => (
                <div key={field.id || idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-3 relative">
                  <button
                    type="button"
                    onClick={() => handleRemoveCustomField(idx)}
                    className="absolute top-3 right-3 text-slate-500 hover:text-red-400 transition-colors p-1"
                    title="Remove field"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-8">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Field Label</label>
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => handleUpdateCustomField(idx, 'label', e.target.value)}
                        placeholder="e.g. Full Name"
                        className="w-full bg-slate-950 text-slate-100 text-xs rounded-lg px-3 py-2 border border-slate-800 focus:outline-none focus:border-teal-500/50"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Input Type</label>
                      <select
                        value={field.type}
                        onChange={(e) => handleUpdateCustomField(idx, 'type', e.target.value as any)}
                        className="w-full bg-slate-950 text-slate-100 text-xs rounded-lg px-3 py-2 border border-slate-800 focus:outline-none focus:border-teal-500/50"
                      >
                        <option value="text">text (Text Single Line)</option>
                        <option value="email">email (Email Address)</option>
                        <option value="tel">tel (Phone / Mobile)</option>
                        <option value="number">number (Numeric Input)</option>
                        <option value="textarea">textarea (Multi-line Text)</option>
                        <option value="date">date (Date Picker)</option>
                        <option value="time">time (Time Picker)</option>
                        <option value="datetime-local">datetime-local (Date &amp; Time)</option>
                        <option value="month">month (Month Picker)</option>
                        <option value="week">week (Week Picker)</option>
                        <option value="url">url (Web Link / URL)</option>
                        <option value="password">password (Password Masked)</option>
                        <option value="checkbox">checkbox (Check Box)</option>
                        <option value="radio">radio (Radio Option)</option>
                        <option value="color">color (Color Picker)</option>
                        <option value="range">range (Range Slider)</option>
                        <option value="file">file (File Upload)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Placeholder Text</label>
                      <input
                        type="text"
                        value={field.placeholder || ''}
                        onChange={(e) => handleUpdateCustomField(idx, 'placeholder', e.target.value)}
                        placeholder="e.g. Enter details"
                        className="w-full bg-slate-950 text-slate-100 text-xs rounded-lg px-3 py-2 border border-slate-800 focus:outline-none focus:border-teal-500/50"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-slate-800/60">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                      <input
                        type="checkbox"
                        checked={!!field.required}
                        onChange={(e) => handleUpdateCustomField(idx, 'required', e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500/20 bg-slate-950 cursor-pointer"
                      />
                      <span>Mark as Required Field (<span className="text-red-400">*</span>)</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
