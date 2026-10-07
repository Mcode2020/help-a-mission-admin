import React, { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Save, CheckCircle2, Loader2 } from 'lucide-react';
import { adminApi } from '../services/api';
import { CmsPageSelector, type CmsPageSlug } from '../components/cms/CmsPageSelector';
import { CmsSectionTabs } from '../components/cms/CmsSectionTabs';
import { CmsHeroEditor } from '../components/cms/CmsHeroEditor';
import { CmsAboutEditor } from '../components/cms/CmsAboutEditor';
import { CmsInitiativesEditor } from '../components/cms/CmsInitiativesEditor';
import { CmsGalleryEditor } from '../components/cms/CmsGalleryEditor';
import { CmsDonationEditor } from '../components/cms/CmsDonationEditor';
import { CmsMissionCTAEditor } from '../components/cms/CmsMissionCTAEditor';
import { MediaPickerModal } from '../components/cms/MediaPickerModal';
import type {
  CmsSectionKey,
  CmsHeroSectionContent,
  CmsAboutSectionContent,
  CmsInitiativesSectionContent,
  CmsGallerySectionContent,
  CmsDonationSectionContent,
  CmsMissionCTASectionContent,
  CmsSEOSectionContent,
} from '../types';

export const CmsPage: React.FC = () => {
  const [activePage, setActivePage] = useState<CmsPageSlug>('home');
  const [activeTab, setActiveTab] = useState<CmsSectionKey>('hero');
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [activeMediaTarget, setActiveMediaTarget] = useState<
    | 'hero'
    | 'about'
    | 'donation'
    | 'seo'
    | 'mission_cta'
    | { type: 'about_card'; index: number }
    | { type: 'initiatives_card'; index: number }
    | { type: 'gallery_image'; index: number }
    | null
  >(null);

  // Section States (Loaded dynamically from API)
  const [hero, setHero] = useState<CmsHeroSectionContent>({
    eyebrow: '',
    heading: '',
    body: '',
    primaryCTA: { label: '', url: '' },
    secondaryCTA: { label: '', url: '' },
  });

  const [about, setAbout] = useState<CmsAboutSectionContent>({
    eyebrow: '',
    heading: '',
    description: '',
    experienceBadge: '',
    impactCards: [],
    cta: { label: '', url: '' },
  });

  const [initiatives, setInitiatives] = useState<CmsInitiativesSectionContent>({
    eyebrow: '',
    heading: '',
    description: '',
    featuredCount: 3,
  });

  const [gallery, setGallery] = useState<CmsGallerySectionContent>({
    eyebrow: '',
    heading: '',
    description: '',
    selectedAssetIds: [],
    images: [],
    viewAllLabel: '',
  });

  const [donation, setDonation] = useState<CmsDonationSectionContent>({
    eyebrow: '',
    heading: '',
    body: '',
    badges: [],
    cardTitle: '',
    cardSubtitle: '',
    suggestedAmountsINR: [500, 1000, 2000, 5000],
    defaultAmountINR: 1000,
    customAmountEnabled: true,
    donateButtonLabel: '',
    customFields: [
      { id: 'f1', label: 'Full Name', type: 'text', placeholder: 'Enter your name', required: true },
      { id: 'f2', label: 'Email Address', type: 'email', placeholder: 'Enter your email', required: true },
      { id: 'f3', label: 'Phone Number', type: 'tel', placeholder: 'Enter your phone number', required: true },
      { id: 'f4', label: 'Message', type: 'textarea', placeholder: 'Anything you would like us to know?', required: false },
    ],
  });

  const [missionCta, setMissionCta] = useState<CmsMissionCTASectionContent>({
    eyebrow: '',
    heading: '',
    subheading: '',
    ctaLabel: '',
    ctaUrl: '',
  });

  const [seo, setSeo] = useState<CmsSEOSectionContent>({
    metaTitle: '',
    metaDescription: '',
    keywords: '',
  });

  useEffect(() => {
    loadCmsPageData(activePage);
  }, [activePage]);

  const loadCmsPageData = async (slug: CmsPageSlug) => {
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const data = await adminApi.getCmsPage(slug);
      if (data && data.sections) {
        data.sections.forEach((sec: any) => {
          const content = typeof sec.content_json === 'string' ? JSON.parse(sec.content_json) : sec.content_json;
          if (!content) return;

          switch (sec.section_key) {
            case 'hero':
              setHero((prev) => ({ ...prev, ...content }));
              break;
            case 'about':
              setAbout((prev) => ({ ...prev, ...content }));
              break;
            case 'initiatives':
              setInitiatives((prev) => ({ ...prev, ...content }));
              break;
            case 'gallery':
              setGallery((prev) => ({ ...prev, ...content }));
              break;
            case 'donation_settings':
              setDonation((prev) => ({ ...prev, ...content }));
              break;
            case 'mission_cta':
              setMissionCta((prev) => ({ ...prev, ...content }));
              break;
            case 'seo':
              setSeo((prev) => ({ ...prev, ...content }));
              break;
          }
        });
      }
    } catch (err: any) {
      console.warn(`CMS page data for '${slug}' error:`, err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (slug: CmsPageSlug) => {
    setActivePage(slug);
    setActiveTab('hero');
  };

  const handleOpenMediaPicker = (
    target:
      | 'hero'
      | 'about'
      | 'donation'
      | 'seo'
      | 'mission_cta'
      | { type: 'about_card'; index: number }
      | { type: 'initiatives_card'; index: number }
      | { type: 'gallery_image'; index: number }
  ) => {
    setActiveMediaTarget(target);
    setMediaPickerOpen(true);
  };

  const handleMediaSelect = (asset: { id: string; url: string; aspectRatio?: string }) => {
    if (activeMediaTarget === 'hero') {
      setHero((prev: any) => ({ ...prev, heroMediaAssetId: asset.id, heroMediaUrl: asset.url, heroMediaAspectRatio: asset.aspectRatio }));
    } else if (activeMediaTarget === 'about') {
      setAbout((prev: any) => ({ ...prev, mediaAssetId: asset.id, mediaUrl: asset.url, mediaAspectRatio: asset.aspectRatio }));
    } else if (typeof activeMediaTarget === 'object' && activeMediaTarget?.type === 'about_card') {
      const cardIdx = activeMediaTarget.index;
      setAbout((prev) => {
        const updatedCards = [...(prev.impactCards || [])];
        if (updatedCards[cardIdx]) {
          updatedCards[cardIdx] = {
            ...updatedCards[cardIdx],
            mediaAssetId: asset.id,
            mediaUrl: asset.url,
          };
        }
        return { ...prev, impactCards: updatedCards };
      });
    } else if (typeof activeMediaTarget === 'object' && activeMediaTarget?.type === 'initiatives_card') {
      const cardIdx = activeMediaTarget.index;
      setInitiatives((prev) => {
        const updatedCards = [...(prev.initiatives || [])];
        if (updatedCards[cardIdx]) {
          updatedCards[cardIdx] = {
            ...updatedCards[cardIdx],
            mediaAssetId: asset.id,
            mediaUrl: asset.url,
          };
        }
        return { ...prev, initiatives: updatedCards };
      });
    } else if (typeof activeMediaTarget === 'object' && activeMediaTarget?.type === 'gallery_image') {
      const imgIdx = activeMediaTarget.index;
      setGallery((prev) => {
        const updatedImages = [...(prev.images || [])];
        if (updatedImages[imgIdx]) {
          updatedImages[imgIdx] = {
            ...updatedImages[imgIdx],
            mediaAssetId: asset.id,
            url: asset.url,
          };
        }
        return { ...prev, images: updatedImages };
      });
    } else if (activeMediaTarget === 'donation') {
      setDonation((prev: any) => ({ ...prev, featureMediaAssetId: asset.id, featureMediaUrl: asset.url, featureMediaAspectRatio: asset.aspectRatio }));
    } else if (activeMediaTarget === 'seo') {
      setSeo((prev: any) => ({ ...prev, ogMediaAssetId: asset.id, ogMediaUrl: asset.url, ogMediaAspectRatio: asset.aspectRatio }));
    } else if (activeMediaTarget === 'mission_cta') {
      setMissionCta((prev: any) => ({ ...prev, bannerMediaAssetId: asset.id, bannerMediaUrl: asset.url, bannerMediaAspectRatio: asset.aspectRatio }));
    }
    setActiveMediaTarget(null);
  };

  const handleMediaRemove = () => {
    if (activeMediaTarget === 'hero') {
      setHero((prev) => ({ ...prev, heroMediaAssetId: '', heroMediaUrl: '' }));
    } else if (activeMediaTarget === 'about') {
      setAbout((prev) => ({ ...prev, mediaAssetId: '', mediaUrl: '' }));
    } else if (typeof activeMediaTarget === 'object' && activeMediaTarget?.type === 'about_card') {
      const cardIdx = activeMediaTarget.index;
      setAbout((prev) => {
        const updatedCards = [...(prev.impactCards || [])];
        if (updatedCards[cardIdx]) {
          updatedCards[cardIdx] = {
            ...updatedCards[cardIdx],
            mediaAssetId: '',
            mediaUrl: '',
          };
        }
        return { ...prev, impactCards: updatedCards };
      });
    } else if (typeof activeMediaTarget === 'object' && activeMediaTarget?.type === 'initiatives_card') {
      const cardIdx = activeMediaTarget.index;
      setInitiatives((prev) => {
        const updatedCards = [...(prev.initiatives || [])];
        if (updatedCards[cardIdx]) {
          updatedCards[cardIdx] = {
            ...updatedCards[cardIdx],
            mediaAssetId: '',
            mediaUrl: '',
          };
        }
        return { ...prev, initiatives: updatedCards };
      });
    } else if (typeof activeMediaTarget === 'object' && activeMediaTarget?.type === 'gallery_image') {
      const imgIdx = activeMediaTarget.index;
      setGallery((prev) => {
        const updatedImages = [...(prev.images || [])];
        if (updatedImages[imgIdx]) {
          updatedImages[imgIdx] = {
            ...updatedImages[imgIdx],
            mediaAssetId: '',
            url: '',
          };
        }
        return { ...prev, images: updatedImages };
      });
    } else if (activeMediaTarget === 'donation') {
      setDonation((prev) => ({ ...prev, featureMediaAssetId: '', featureMediaUrl: '' }));
    } else if (activeMediaTarget === 'seo') {
      setSeo((prev) => ({ ...prev, ogMediaAssetId: '', ogMediaUrl: '' }));
    } else if (activeMediaTarget === 'mission_cta') {
      setMissionCta((prev) => ({ ...prev, bannerMediaAssetId: '', bannerMediaUrl: '' }));
    }
    setActiveMediaTarget(null);
  };

  const handleSaveAllSections = async () => {
    setIsSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const payloadSections = [
        { sectionKey: 'hero', sectionType: 'hero', sortOrder: 1, contentJson: hero },
        { sectionKey: 'about', sectionType: 'about', sortOrder: 2, contentJson: about },
        { sectionKey: 'initiatives', sectionType: 'initiatives', sortOrder: 3, contentJson: initiatives },
        { sectionKey: 'gallery', sectionType: 'gallery', sortOrder: 4, contentJson: gallery },
        { sectionKey: 'donation_settings', sectionType: 'donation_settings', sortOrder: 5, contentJson: donation },
        { sectionKey: 'mission_cta', sectionType: 'mission_cta', sortOrder: 6, contentJson: missionCta },
        { sectionKey: 'seo', sectionType: 'seo', sortOrder: 7, contentJson: seo },
      ];

      await adminApi.updateCmsSections(activePage, payloadSections);
      setSuccessMsg(`All CMS sections for ${activePage.toUpperCase()} saved & published successfully!`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to publish CMS sections');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-slate-400 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
        <span className="text-xs font-semibold">Loading CMS Page data...</span>
      </div>
    );
  }

  const getActiveMediaInfo = () => {
    if (typeof activeMediaTarget === 'object' && activeMediaTarget?.type === 'about_card') {
      const card = about.impactCards?.[activeMediaTarget.index];
      return {
        assetId: card?.mediaAssetId,
        mediaUrl: card?.mediaUrl,
        title: `Select Image for Impact Card #${activeMediaTarget.index + 1} (${card?.title || 'Card'})`,
        targetSection: 'about' as const,
      };
    }
    if (typeof activeMediaTarget === 'object' && activeMediaTarget?.type === 'initiatives_card') {
      const card = initiatives.initiatives?.[activeMediaTarget.index];
      return {
        assetId: card?.mediaAssetId,
        mediaUrl: card?.mediaUrl,
        title: `Select Cover Photo for Initiative Card #${activeMediaTarget.index + 1} (${card?.title || 'Card'})`,
        targetSection: 'about' as const,
      };
    }
    if (typeof activeMediaTarget === 'object' && activeMediaTarget?.type === 'gallery_image') {
      const img = gallery.images?.[activeMediaTarget.index];
      return {
        assetId: img?.mediaAssetId,
        mediaUrl: img?.url,
        title: `Select Image for Gallery Photo #${activeMediaTarget.index + 1} (${img?.title || 'Photo'})`,
        targetSection: 'gallery' as const,
      };
    }
    switch (activeMediaTarget) {
      case 'hero':
        return {
          assetId: hero.heroMediaAssetId,
          mediaUrl: hero.heroMediaUrl,
          title: 'Select Hero Banner Media Asset',
          targetSection: 'hero' as const,
        };
      case 'about':
        return {
          assetId: about.mediaAssetId,
          mediaUrl: about.mediaUrl,
          title: 'Select About Us Media Asset',
          targetSection: 'about' as const,
        };
      case 'donation':
        return {
          assetId: donation.featureMediaAssetId,
          mediaUrl: donation.featureMediaUrl,
          title: 'Select Donation Feature Media Asset',
          targetSection: 'donation' as const,
        };
      case 'seo':
        return {
          assetId: seo.ogMediaAssetId,
          mediaUrl: seo.ogMediaUrl,
          title: 'Select SEO Metadata Media Asset',
          targetSection: 'seo' as const,
        };
      case 'mission_cta':
        return {
          assetId: missionCta.bannerMediaAssetId,
          mediaUrl: missionCta.bannerMediaUrl,
          title: 'Select Mission Banner Background Photo',
          targetSection: 'hero' as const,
        };
      default:
        return { assetId: undefined, mediaUrl: undefined, title: undefined, targetSection: 'about' as const };
    }
  };

  return (
    <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
      <Header
        title="Admin Panel CMS Manager"
        subtitle="Manage website body sections, text copy, donation presets & SEO dynamically for all pages"
      />

      {/* Two-Tier Control Action Header */}
      <div className="bg-slate-900/80 border-b border-slate-800/80 shadow-sm shrink-0">
        {/* Tier 1: Page Selection & Global Actions */}
        <div className="px-6 py-2.5 flex items-center justify-between gap-4 min-w-0">
          <div className="min-w-0 flex-1">
            <CmsPageSelector activePage={activePage} onSelectPage={handlePageChange} />
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleSaveAllSections}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2 shrink-0"
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>{isSaving ? 'Publishing...' : 'Save & Publish All Sections'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Toast Feedback Banners */}
      {(successMsg || errorMsg) && (
        <div className="px-6 pt-4">
          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2.5">
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      )}

      {/* Main Workspace (Sidebar + Form Editor) */}
      {activePage !== 'home' ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
          <div className="max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto text-xl font-bold">
              !
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-100 capitalize">
                {activePage.replace('-', ' ')} Page Data Pending
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Currently, only the <strong className="text-emerald-400">Home Page</strong> dataset and sections are available in the CMS. The sections for <strong>{activePage.replace('-', ' ')}</strong> will be displayed here once their backend API data is published.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handlePageChange('home')}
              className="px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/25 transition-all"
            >
              Back to Home Page CMS
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 min-h-0 p-6 flex flex-col md:flex-row gap-6 overflow-hidden">
          {/* Left Vertical Section Navigation Sidebar */}
          <div className="w-full md:w-72 lg:w-80 shrink-0 overflow-y-auto pr-0.5">
            <CmsSectionTabs
              pageSlug={activePage}
              activeTab={activeTab}
              onSelectTab={setActiveTab}
              orientation="vertical"
            />
          </div>

          {/* Right Active Section Editor Workspace */}
          <div className="flex-1 min-w-0 overflow-y-auto pr-1 space-y-6">
            {activeTab === 'hero' && (
              <CmsHeroEditor
                content={hero}
                onChange={setHero}
                onOpenMediaPicker={() => handleOpenMediaPicker('hero')}
              />
            )}

            {activeTab === 'about' && (
              <CmsAboutEditor
                content={about}
                onChange={setAbout}
                onOpenMediaPicker={(target) => handleOpenMediaPicker(target || 'about')}
              />
            )}

            {activeTab === 'initiatives' && (
              <CmsInitiativesEditor
                content={initiatives}
                onChange={setInitiatives}
                onOpenMediaPicker={handleOpenMediaPicker}
              />
            )}

            {activeTab === 'gallery' && (
              <CmsGalleryEditor
                content={gallery}
                onChange={setGallery}
                onOpenMediaPicker={handleOpenMediaPicker}
              />
            )}

            {activeTab === 'donation_settings' && (
              <CmsDonationEditor
                content={donation}
                onChange={setDonation}
                onOpenMediaPicker={() => handleOpenMediaPicker('donation')}
              />
            )}

            {activeTab === 'mission_cta' && (
              <CmsMissionCTAEditor
                content={missionCta}
                onChange={setMissionCta}
                onOpenMediaPicker={() => handleOpenMediaPicker('mission_cta')}
              />
            )}
          </div>
        </div>
      )}

      {/* Media Selector Overlay Modal */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={handleMediaSelect}
        onRemove={handleMediaRemove}
        targetSection={getActiveMediaInfo().targetSection}
        activeAssetId={getActiveMediaInfo().assetId}
        activeMediaUrl={getActiveMediaInfo().mediaUrl}
        title={getActiveMediaInfo().title}
      />
    </div>
  );
};
