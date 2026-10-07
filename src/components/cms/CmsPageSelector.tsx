import React from 'react';
import { Home, Info, Sparkles, HeartHandshake, Mail, Layers } from 'lucide-react';

export type CmsPageSlug = 'home' | 'about' | 'our-work' | 'campaigns' | 'contact';

interface CmsPageSelectorProps {
  activePage: CmsPageSlug;
  onSelectPage: (slug: CmsPageSlug) => void;
}

export const CmsPageSelector: React.FC<CmsPageSelectorProps> = ({ activePage, onSelectPage }) => {
  const pages: Array<{ slug: CmsPageSlug; label: string; icon: React.ReactNode; isReady?: boolean }> = [
    { slug: 'home', label: 'Home Page', icon: <Home className="w-3.5 h-3.5" />, isReady: true },
    { slug: 'about', label: 'About Us', icon: <Info className="w-3.5 h-3.5" />, isReady: false },
    { slug: 'our-work', label: 'Our Work', icon: <Sparkles className="w-3.5 h-3.5" />, isReady: false },
    { slug: 'campaigns', label: 'Campaigns', icon: <HeartHandshake className="w-3.5 h-3.5" />, isReady: false },
    { slug: 'contact', label: 'Contact', icon: <Mail className="w-3.5 h-3.5" />, isReady: false },
  ];

  return (
    <div className="flex items-center gap-2 p-1 bg-slate-950/90 border border-slate-800/90 rounded-xl max-w-full overflow-hidden">
      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 shrink-0">
        <Layers className="w-3.5 h-3.5 text-emerald-400" />
        <span>Page:</span>
      </div>
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
        {pages.map((page) => {
          const isActive = activePage === page.slug;
          return (
            <button
              key={page.slug}
              type="button"
              onClick={() => onSelectPage(page.slug)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${isActive
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
            >
              {page.icon}
              <span>{page.label}</span>
              {/* {!page.isReady && (
                <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-slate-900/90 text-slate-500 border border-slate-800">
                  Pending
                </span>
              )} */}
            </button>
          );
        })}
      </div>
    </div>
  );
};


