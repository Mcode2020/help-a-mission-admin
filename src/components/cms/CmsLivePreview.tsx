import React, { useState } from 'react';
import {
  Monitor,
  Heart,
  Users,
  GraduationCap,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import gallery1 from '../../assets/gallery-1.png';
import gallery2 from '../../assets/gallery-2.png';
import campaignFinancial from '../../assets/campaign_financial.png';
import type {
  CmsHeroSectionContent,
  CmsAboutSectionContent,
  CmsInitiativesSectionContent,
  CmsGallerySectionContent,
  CmsDonationSectionContent,
  CmsMissionCTASectionContent,
} from '../../types';

import type { CmsPageSlug } from './CmsPageSelector';

interface CmsLivePreviewProps {
  activePage?: CmsPageSlug;
  hero: CmsHeroSectionContent;
  about: CmsAboutSectionContent;
  initiatives: CmsInitiativesSectionContent;
  gallery: CmsGallerySectionContent;
  donation: CmsDonationSectionContent;
  missionCta: CmsMissionCTASectionContent;
}

export const CmsLivePreview: React.FC<CmsLivePreviewProps> = ({
  activePage = 'home',
  hero,
  about,
  initiatives,
  gallery,
  donation,
  missionCta,
}) => {
  const [selectedDonationPreset, setSelectedDonationPreset] = useState<number>(
    donation.defaultAmountINR || 1000
  );

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Heart':
        return <Heart className="w-4 h-4 text-red-500" />;
      case 'Users':
        return <Users className="w-4 h-4 text-blue-500" />;
      case 'GraduationCap':
        return <GraduationCap className="w-4 h-4 text-amber-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-teal-500" />;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-full overflow-hidden shadow-2xl">
      {/* Canvas Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-bold text-slate-200">Interactive Figma Live Preview (Desktop View)</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
          <Monitor className="w-3.5 h-3.5 text-emerald-400" />
          <span>Desktop View</span>
        </div>
      </div>

      {/* Canvas Frame Wrapper */}
      <div className="flex-1 bg-slate-950 overflow-y-auto p-4 flex justify-center">
        <div className="bg-white text-slate-800 font-sans transition-all duration-300 rounded-xl overflow-hidden shadow-xl w-full max-w-5xl">
          {/* STATIC HEADER (Excluded from CMS as requested) */}
          <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                H
              </div>
              <span className="font-bold text-sm text-slate-900 tracking-tight">Help-A Mission</span>
            </div>
            <nav className="hidden sm:flex items-center gap-6 text-xs font-medium text-slate-600">
              <span className={`cursor-pointer ${activePage === 'home' ? 'text-emerald-600 font-semibold border-b-2 border-emerald-600 pb-0.5' : 'hover:text-emerald-600'}`}>Home</span>
              <span className={`cursor-pointer ${activePage === 'about' ? 'text-emerald-600 font-semibold border-b-2 border-emerald-600 pb-0.5' : 'hover:text-emerald-600'}`}>About Us</span>
              <span className={`cursor-pointer ${activePage === 'our-work' ? 'text-emerald-600 font-semibold border-b-2 border-emerald-600 pb-0.5' : 'hover:text-emerald-600'}`}>Our Work</span>
              <span className={`cursor-pointer ${activePage === 'campaigns' ? 'text-emerald-600 font-semibold border-b-2 border-emerald-600 pb-0.5' : 'hover:text-emerald-600'}`}>Campaigns</span>
              <span className={`cursor-pointer ${activePage === 'contact' ? 'text-emerald-600 font-semibold border-b-2 border-emerald-600 pb-0.5' : 'hover:text-emerald-600'}`}>Contact</span>
            </nav>
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-full text-xs font-bold shadow-md shadow-emerald-600/20">
              Donate Now
            </button>
          </header>

          {/* 1. HERO BANNER SECTION */}
          <section className="relative bg-slate-900 text-white py-16 px-6 overflow-hidden">
            {hero.heroMediaUrl && (
              <img
                src={hero.heroMediaUrl}
                alt={hero.heroImageAlt || 'Hero Banner'}
                className="absolute inset-0 w-full h-full object-cover opacity-30"
              />
            )}
            <div className="relative z-10 max-w-2xl mx-auto text-center space-y-4">
              {hero.eyebrow && (
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold tracking-wider uppercase border border-emerald-500/30">
                  {hero.eyebrow}
                </span>
              )}
              {hero.heading && (
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                  {hero.heading}
                </h1>
              )}
              {hero.body && (
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-lg mx-auto">
                  {hero.body}
                </p>
              )}
              <div className="flex items-center justify-center gap-3 pt-2">
                {hero.primaryCTA?.label && (
                  <button className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-full shadow-lg shadow-emerald-500/30 transition-all">
                    {hero.primaryCTA.label}
                  </button>
                )}
                {hero.secondaryCTA?.label && (
                  <button className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold rounded-full transition-all">
                    {hero.secondaryCTA.label}
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* 2. ABOUT US & IMPACT CARDS SECTION */}
          <section className="py-16 px-6 bg-slate-50">
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="relative">
                  {about.mediaUrl && (
                    <img
                      src={about.mediaUrl}
                      alt={about.mediaAlt || 'About Us'}
                      className="w-full h-64 object-cover rounded-2xl shadow-lg"
                    />
                  )}
                  {about.experienceBadge && (
                    <div className="absolute bottom-4 left-4 bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md">
                      {about.experienceBadge}
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  {about.eyebrow && (
                    <span className="text-xs font-bold text-emerald-600 tracking-wider uppercase">
                      {about.eyebrow}
                    </span>
                  )}
                  {about.heading && (
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                      {about.heading}
                    </h2>
                  )}
                  {about.description && (
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {about.description}
                    </p>
                  )}
                  {about.cta?.label && (
                    <button className="px-4 py-2 bg-emerald-600 text-white rounded-full text-xs font-semibold shadow-md">
                      {about.cta.label} &rarr;
                    </button>
                  )}
                </div>
              </div>

              {/* Feature Cards */}
              {about.impactCards && about.impactCards.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {about.impactCards.map((card, idx) => (
                    <div key={card.id || idx} className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm text-center space-y-2">
                      {card.mediaUrl && (
                        <div className="w-10 h-10 mx-auto rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden">
                          <img src={card.mediaUrl} alt={card.title} className="w-full h-full object-cover rounded-xl" />
                        </div>
                      )}
                      <h4 className="text-xs font-bold text-slate-900">{card.title}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2">{card.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* 3. OUR WORK / INITIATIVES SECTION */}
          <section className="py-16 px-6 bg-emerald-50/20">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-[2px] bg-emerald-600 rounded-full"></span>
                  <span className="text-xs font-bold text-emerald-600 tracking-wider uppercase">
                    {initiatives.eyebrow || 'OUR WORK'}
                  </span>
                </div>
                {initiatives.heading && (
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 max-w-xl">
                    {initiatives.heading}
                  </h2>
                )}
                {initiatives.description && (
                  <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
                    {initiatives.description}
                  </p>
                )}
              </div>

              {initiatives.initiatives && initiatives.initiatives.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {initiatives.initiatives.map((item, idx) => (
                    <div key={item.id || idx} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex flex-col justify-between">
                      {item.mediaUrl && (
                        <div className="relative h-44 bg-slate-100 overflow-hidden">
                          <img src={item.mediaUrl} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-slate-900 leading-snug">{item.title}</h4>
                          {item.description && (
                            <p className="text-[11px] text-slate-500 line-clamp-2">{item.description}</p>
                          )}
                        </div>
                        <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 pt-1">
                          <span>Learn More</span>
                          <span>&rarr;</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* 4. MOMENTS THAT MATTER / GALLERY SECTION */}
          <section className="py-16 px-6 bg-white border-t border-slate-100">
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Header with Top-Right Button */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-1 max-w-xl">
                  {/* Category Pill with Horizontal Line */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-[2.5px] bg-[#08A49C] rounded-full"></span>
                    <span className="text-[#08A49C] text-xs font-bold uppercase tracking-wider">
                      {gallery.eyebrow || 'OUR GALLERY'}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    {gallery.heading || 'Moments That Matter'}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                    {gallery.description || 'A glimpse of our recent activities, health camps and social initiatives.'}
                  </p>
                </div>

                <div className="shrink-0">
                  <button className="px-5 py-2.5 bg-[#08A49C] hover:bg-[#06857e] text-white rounded-full font-bold text-xs shadow-md shadow-teal-600/20 transition-all flex items-center gap-1.5">
                    <span>{gallery.viewAllLabel || 'View All Photos'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 3x3 Photo Grid matching Figma Layout */}
              {(() => {
                const defaultPhotos = [
                  { id: '1', title: 'Welfare Cheque Distribution', url: gallery1 },
                  { id: '2', title: 'School Support Contribution', url: gallery2 },
                  { id: '3', title: 'Community Aid Felicitation', url: campaignFinancial },
                  { id: '4', title: 'Welfare Cheque Distribution', url: gallery1 },
                  { id: '5', title: 'School Support Contribution', url: gallery2 },
                  { id: '6', title: 'Community Aid Felicitation', url: campaignFinancial },
                  { id: '7', title: 'Welfare Cheque Distribution', url: gallery1 },
                  { id: '8', title: 'School Support Contribution', url: gallery2 },
                  { id: '9', title: 'Community Aid Felicitation', url: campaignFinancial },
                ];

                const photosToRender = (gallery.images && gallery.images.length > 0)
                  ? gallery.images
                  : defaultPhotos;

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {photosToRender.map((photo, idx) => (
                      <div
                        key={photo.id || idx}
                        className="relative h-44 sm:h-52 rounded-[20px] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group border border-slate-100 bg-slate-100 cursor-pointer"
                      >
                        <img
                          src={photo.url || gallery1}
                          alt={photo.title || 'Gallery Photo'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                          <p className="text-white text-xs font-medium tracking-wide">
                            {photo.title || 'Help-A-Mission Welfare Activity'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </section>

          {/* 5. MAKE A DIFFERENCE TODAY / DONATION FUND SECTION (Figma Deep-Dive) */}
          <section className="py-16 px-6 bg-emerald-50/40">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Left Informational Side */}
              <div className="space-y-4">
                <span className="text-xs font-bold text-emerald-600 tracking-wider uppercase">
                  {donation.eyebrow || 'SUPPORT OUR MISSION'}
                </span>
                <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900">
                  {donation.heading || 'Make a Difference Today'}
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {donation.body || 'Your contribution helps us organize health camps, support needy individuals and create awareness in communities.'}
                </p>

                {/* 3 Highlight Badges */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {(donation.badges && donation.badges.length > 0
                    ? donation.badges
                    : [
                      { id: 'b1', icon: 'Heart', label: 'Better Healthcare' },
                      { id: 'b2', icon: 'Users', label: 'Stronger Communities' },
                      { id: 'b3', icon: 'GraduationCap', label: 'Brighter Futures' },
                    ]
                  ).map((b) => (
                    <div key={b.id} className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-slate-200 text-xs font-semibold text-slate-800 shadow-sm">
                      {getBadgeIcon(b.icon)}
                      <span>{b.label}</span>
                    </div>
                  ))}
                </div>

                {/* Left Feature Photo */}
                {donation.featureMediaUrl && (
                  <div className="pt-2">
                    <img
                      src={donation.featureMediaUrl}
                      alt="Donation Feature"
                      className="w-full h-44 object-cover rounded-2xl shadow-md border border-slate-100"
                    />
                  </div>
                )}
              </div>

              {/* Right Interactive Donation Card */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {donation.cardTitle || 'Donation Fund'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {donation.cardSubtitle || 'Every contribution counts. Choose an amount or enter your own.'}
                  </p>
                </div>

                {/* Suggested Amount Chips */}
                <div className="flex flex-wrap gap-2">
                  {(donation.suggestedAmountsINR || [500, 1000, 2000, 5000]).map((amt) => {
                    const isSelected = selectedDonationPreset === amt;
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setSelectedDonationPreset(amt)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${isSelected
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                      >
                        ₹{amt.toLocaleString('en-IN')}
                      </button>
                    );
                  })}
                  {donation.customAmountEnabled !== false && (
                    <button type="button" className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-600">
                      Custom
                    </button>
                  )}
                </div>

                {/* Form Field Mockups (Driven dynamically by CMS fields) */}
                <div className="space-y-3 pt-2">
                  {(donation.customFields && donation.customFields.length > 0
                    ? donation.customFields
                    : [
                        { id: 'f1', label: 'Full Name', type: 'text', placeholder: 'Enter your name', required: true },
                        { id: 'f2', label: 'Email Address', type: 'email', placeholder: 'Enter your email', required: true },
                        { id: 'f3', label: 'Phone Number', type: 'tel', placeholder: 'Enter your phone number', required: true },
                        { id: 'f4', label: 'Message', type: 'textarea', placeholder: 'Anything you would like us to know?', required: false },
                      ]
                  ).map((field) => (
                    <div key={field.id}>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        {field.label} {field.required ? <span className="text-red-500">*</span> : <span className="text-slate-400 font-normal">(Optional)</span>}
                      </label>
                      {field.type === 'tel' ? (
                        <div className="flex gap-1.5">
                          <select
                            disabled
                            className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 pointer-events-none"
                          >
                            <option>+91</option>
                          </select>
                          <input
                            type="tel"
                            disabled
                            placeholder={field.placeholder || 'Enter your phone number'}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-500"
                          />
                        </div>
                      ) : field.type === 'textarea' ? (
                        <textarea
                          disabled
                          placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                          rows={2}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-500"
                        />
                      ) : field.type === 'checkbox' ? (
                        <div className="flex items-center gap-2 pt-0.5">
                          <input type="checkbox" disabled className="w-4 h-4 rounded border-slate-300 text-teal-600" />
                          <span className="text-xs text-slate-600">{field.placeholder || field.label}</span>
                        </div>
                      ) : field.type === 'color' ? (
                        <input
                          type="color"
                          disabled
                          className="w-12 h-8 bg-slate-50 border border-slate-200 rounded-lg p-0.5"
                        />
                      ) : (
                        <input
                          type={field.type || 'text'}
                          disabled
                          placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-500"
                        />
                      )}
                    </div>
                  ))}
                </div>

                <button type="button" className="w-full py-3 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20">
                  {donation.donateButtonLabel || 'Donate'} (₹{selectedDonationPreset.toLocaleString('en-IN')})
                </button>
              </div>
            </div>
          </section>

          {/* 6. BE PART OF OUR MISSION BANNER SECTION */}
          <section
            className="relative py-12 px-6 bg-emerald-600 text-white overflow-hidden bg-cover bg-center"
            style={missionCta.bannerMediaUrl ? { backgroundImage: `url(${missionCta.bannerMediaUrl})` } : undefined}
          >
            {missionCta.bannerMediaUrl && <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px]" />}
            <div className="relative z-10 max-w-3xl mx-auto text-center space-y-3">
              <span className="text-[11px] font-bold tracking-widest uppercase text-emerald-200">
                {missionCta.eyebrow || 'BE A PART OF OUR MISSION'}
              </span>
              <h2 className="text-2xl font-extrabold">{missionCta.heading || 'Be a Part of Our Mission'}</h2>
              <p className="text-xs text-emerald-100">{missionCta.subheading || 'Join hands with us to create a better and brighter future.'}</p>
              <div className="pt-2">
                <button className="px-6 py-2.5 bg-white text-emerald-700 font-bold text-xs rounded-full shadow-md">
                  {missionCta.ctaLabel || 'Donate Now'}
                </button>
              </div>
            </div>
          </section>

          {/* STATIC FOOTER (Excluded from CMS as requested) */}
          <footer className="bg-slate-900 text-slate-400 py-12 px-6 border-t border-slate-800 text-xs">
            <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="space-y-2">
                <h4 className="text-slate-100 font-bold text-sm">Help-A Mission</h4>
                <p className="text-[11px]">Dedicated to social welfare and community upliftment across India.</p>
              </div>
              <div className="space-y-1">
                <h5 className="text-slate-200 font-semibold mb-2">Quick Links</h5>
                <p className="hover:text-white cursor-pointer">About Us</p>
                <p className="hover:text-white cursor-pointer">Our Work</p>
                <p className="hover:text-white cursor-pointer">Contact Us</p>
              </div>
              <div className="space-y-1">
                <h5 className="text-slate-200 font-semibold mb-2">Contact</h5>
                <p>info@helpamission.org</p>
                <p>+91 98765 43210</p>
              </div>
            </div>
            <div className="max-w-4xl mx-auto pt-8 border-t border-slate-800 text-center text-[11px] text-slate-500">
              © 2026 Help-A Mission Welfare Society. All rights reserved.
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};
