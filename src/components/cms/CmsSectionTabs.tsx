import React from 'react';
import { Layout, Users, Sparkles, Image, HeartHandshake, Flag, SlidersHorizontal, ChevronRight, Check, AlertTriangle, X } from 'lucide-react';
import type { CmsSectionKey, SectionTranslationInfo } from '../../types';
import type { CmsPageSlug } from './CmsPageSelector';

interface CmsSectionTabsProps {
  pageSlug: CmsPageSlug;
  activeTab: CmsSectionKey;
  onSelectTab: (key: CmsSectionKey) => void;
  orientation?: 'horizontal' | 'vertical';
  translationStatus?: Record<string, SectionTranslationInfo>;
  currentLanguage?: 'en' | 'hi';
}

const renderStatusBadge = (status?: 'complete' | 'incomplete' | 'missing', label?: string) => {
  if (status === 'complete') {
    return (
      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
        <Check className="w-2.5 h-2.5" />
        {label ? `${label}` : ''}
      </span>
    );
  }
  if (status === 'incomplete') {
    return (
      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/30">
        <AlertTriangle className="w-2.5 h-2.5" />
        {label ? `${label}` : ''}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-red-500/20 text-red-400 border border-red-500/30">
      <X className="w-2.5 h-2.5" />
      {label ? `${label}` : ''}
    </span>
  );
};

export const CmsSectionTabs: React.FC<CmsSectionTabsProps> = ({
  pageSlug,
  activeTab,
  onSelectTab,
  orientation = 'vertical',
  translationStatus,
  currentLanguage = 'en',
}) => {
  const pageTabConfigs: Record<
    CmsPageSlug,
    Array<{ key: CmsSectionKey; label: string; description: string; icon: React.ReactNode; badge?: string }>
  > = {
    home: [
      { key: 'hero', label: 'Hero Banner', description: 'Main title, eyebrow & CTAs', icon: <Layout className="w-4 h-4" /> },
      { key: 'about', label: 'About & Cards', description: 'Story & impact stats', icon: <Users className="w-4 h-4" /> },
      { key: 'initiatives', label: 'Our Work', description: 'Featured initiatives', icon: <Sparkles className="w-4 h-4" /> },
      { key: 'gallery', label: 'Gallery', description: 'Photo showcase grid', icon: <Image className="w-4 h-4" /> },
      { key: 'donation_settings', label: 'Donation Fund', description: 'Amounts & preset fields', icon: <HeartHandshake className="w-4 h-4" /> },
      { key: 'mission_cta', label: 'Mission Banner', description: 'CTA banner section', icon: <Flag className="w-4 h-4" /> },
    ],
    about: [
      { key: 'hero', label: 'About Banner', description: 'Introduction headline', icon: <Layout className="w-4 h-4" /> },
      { key: 'about', label: 'Story & Mission', description: 'Core values & team', icon: <Users className="w-4 h-4" /> },
      { key: 'initiatives', label: 'Pillars & Impact', description: 'Highlights & stats', icon: <Sparkles className="w-4 h-4" /> },
    ],
    'our-work': [
      { key: 'hero', label: 'Work Hero', description: 'Work intro banner', icon: <Layout className="w-4 h-4" /> },
      { key: 'initiatives', label: 'Focus Projects', description: 'Key project list', icon: <Sparkles className="w-4 h-4" /> },
      { key: 'gallery', label: 'Work Portfolio', description: 'Photo gallery', icon: <Image className="w-4 h-4" /> },
    ],
    campaigns: [
      { key: 'hero', label: 'Campaigns Hero', description: 'Campaigns header', icon: <Layout className="w-4 h-4" /> },
      { key: 'initiatives', label: 'Active Campaigns', description: 'Fundraising drives', icon: <Sparkles className="w-4 h-4" /> },
      { key: 'donation_settings', label: 'Donations Config', description: 'Payment settings', icon: <HeartHandshake className="w-4 h-4" /> },
    ],
    contact: [
      { key: 'hero', label: 'Contact Hero', description: 'Contact intro', icon: <Layout className="w-4 h-4" /> },
      { key: 'about', label: 'Contact Details', description: 'Address & info', icon: <Users className="w-4 h-4" /> },
      { key: 'mission_cta', label: 'Connect CTA', description: 'Inquiry banner', icon: <Flag className="w-4 h-4" /> },
    ],
    members: [
      { key: 'hero', label: 'Members Banner', description: 'Hero headline, badge & stats', icon: <Layout className="w-4 h-4" /> },
      { key: 'about', label: 'Members Directory', description: 'Add, edit & delete members', icon: <Users className="w-4 h-4" /> },
      { key: 'mission_cta', label: 'Join CTA Banner', description: 'Call to action banner & buttons', icon: <Flag className="w-4 h-4" /> },
    ],
  };

  const tabs = pageTabConfigs[pageSlug] || pageTabConfigs.home;

  if (orientation === 'horizontal') {
    return (
      <div className="flex items-center gap-3 w-full">
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 px-1">
          <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
          <span>Sections:</span>
        </div>
        <div className="flex-1 flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800/80 rounded-xl overflow-x-auto scrollbar-none">
          {tabs.map((tab, idx) => {
            const isActive = activeTab === tab.key;
            const statusInfo = translationStatus?.[tab.key];
            const currentStatus = currentLanguage === 'hi' ? statusInfo?.hi : statusInfo?.en;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onSelectTab(tab.key)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${isActive ? 'bg-slate-950/25 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                  0{idx + 1}
                </span>
                {tab.icon}
                <span>{tab.label}</span>
                {renderStatusBadge(currentStatus, currentLanguage.toUpperCase())}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-3 shadow-xl backdrop-blur-md flex flex-col gap-2">
      <div className="px-3 py-2 flex items-center justify-between border-b border-slate-800/60 mb-1">
        <div className="flex items-center gap-2 text-xs font-extrabold text-slate-200 uppercase tracking-wider">
          <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
          <span>Page Sections</span>
        </div>
        <span className="text-[10px] font-extrabold px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
          {tabs.length} Configs
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        {tabs.map((tab, idx) => {
          const isActive = activeTab === tab.key;
          const statusInfo = translationStatus?.[tab.key];
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onSelectTab(tab.key)}
              className={`group relative flex items-center justify-between p-3 rounded-xl transition-all duration-200 text-left ${
                isActive
                  ? 'bg-slate-800/90 border border-emerald-500/50 shadow-md shadow-emerald-500/10 text-slate-100'
                  : 'bg-slate-950/40 hover:bg-slate-800/50 border border-slate-800/40 text-slate-400 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-emerald-400 rounded-r-full shadow-sm shadow-emerald-400/50" />
              )}

              <div className="flex items-center gap-3 min-w-0 pl-1">
                <span
                  className={`text-[10px] font-extrabold px-2 py-1 rounded-md shrink-0 transition-colors ${
                    isActive
                      ? 'bg-emerald-400 text-slate-950'
                      : 'bg-slate-800/80 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-300'
                  }`}
                >
                  0{idx + 1}
                </span>

                <div className="min-w-0 flex flex-col">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-300'}>
                      {tab.icon}
                    </span>
                    <span className="text-xs font-bold truncate">{tab.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 truncate mt-0.5 font-normal">
                    {tab.description}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                {statusInfo && (
                  <div className="flex items-center gap-1">
                    {renderStatusBadge(statusInfo.en, 'EN')}
                    {renderStatusBadge(statusInfo.hi, 'HI')}
                  </div>
                )}
                <ChevronRight
                  className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                    isActive
                      ? 'text-emerald-400 translate-x-0.5'
                      : 'text-slate-600 opacity-0 group-hover:opacity-100 group-hover:text-slate-400'
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
