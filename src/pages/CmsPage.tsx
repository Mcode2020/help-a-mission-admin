import React, { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Save, CheckCircle2, Loader2, Globe } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  selectActiveCmsPage,
  selectActiveCmsTab,
  selectCmsLanguage,
  selectCmsMediaPickerOpen,
  selectCmsActiveMediaTarget,
  selectCmsDrafts,
  setActivePage,
  setActiveTab,
  setLanguage,
  setActiveMediaTarget,
  setMediaPickerOpen,
  setHeroDraft,
  setAboutDraft,
  setInitiativesDraft,
  setGalleryDraft,
  setDonationDraft,
  setMissionCtaDraft,
  setSeoDraft,
  setAllDraftsForLanguage,
  initialDrafts,
  type CmsLanguage,
  type MediaTarget,
} from '../features/cms/cmsSlice';
import { useGetCmsPageQuery, useUpdateCmsSectionsMutation } from '../features/cms/cmsApi';
import { CmsPageSelector, type CmsPageSlug } from '../components/cms/CmsPageSelector';
import { CmsSectionTabs } from '../components/cms/CmsSectionTabs';
import { CmsHeroEditor } from '../components/cms/CmsHeroEditor';
import { CmsAboutEditor } from '../components/cms/CmsAboutEditor';
import { CmsInitiativesEditor } from '../components/cms/CmsInitiativesEditor';
import { CmsGalleryEditor } from '../components/cms/CmsGalleryEditor';
import { CmsDonationEditor } from '../components/cms/CmsDonationEditor';
import { CmsMissionCTAEditor } from '../components/cms/CmsMissionCTAEditor';
import { CmsSEOEditor } from '../components/cms/CmsSEOEditor';
import { MediaPickerModal } from '../components/cms/MediaPickerModal';
import { MembersPage } from './MembersPage';
import type { CmsSection } from '../types';


export const CmsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const activePage = useAppSelector(selectActiveCmsPage);
  const activeTab = useAppSelector(selectActiveCmsTab);
  const language = useAppSelector(selectCmsLanguage);
  const mediaPickerOpen = useAppSelector(selectCmsMediaPickerOpen);
  const activeMediaTarget = useAppSelector(selectCmsActiveMediaTarget);
  const drafts = useAppSelector(selectCmsDrafts);

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch CMS page data using RTK Query with automatic caching and language support
  const { data: cmsPageData, isLoading: loading } = useGetCmsPageQuery(
    { slug: activePage, language },
    { refetchOnMountOrArgChange: true }
  );

  const [updateCmsSections, { isLoading: isSaving }] = useUpdateCmsSectionsMutation();

  // Populate Redux drafts whenever fetched CMS page data changes for the active language
  useEffect(() => {
    if (cmsPageData) {
      const newDrafts: typeof initialDrafts = JSON.parse(JSON.stringify(initialDrafts));

      if (cmsPageData.sections && Array.isArray(cmsPageData.sections)) {
        cmsPageData.sections.forEach((sec: CmsSection & { content_json?: unknown; section_key?: string }) => {
          const rawContent = sec.content_json || sec.contentJson;
          const content = typeof rawContent === 'string' ? JSON.parse(rawContent) : rawContent;
          if (!content) return;

          const sectionKey = sec.section_key || sec.sectionKey;
          switch (sectionKey) {
            case 'hero':
              newDrafts.hero = { ...newDrafts.hero, ...content };
              break;
            case 'about':
              newDrafts.about = { ...newDrafts.about, ...content };
              break;
            case 'initiatives':
              newDrafts.initiatives = { ...newDrafts.initiatives, ...content };
              break;
            case 'gallery':
              newDrafts.gallery = { ...newDrafts.gallery, ...content };
              break;
            case 'donation_settings':
              newDrafts.donation = { ...newDrafts.donation, ...content };
              break;
            case 'mission_cta':
              newDrafts.missionCta = { ...newDrafts.missionCta, ...content };
              break;
            case 'seo':
              newDrafts.seo = { ...newDrafts.seo, ...content };
              break;
          }
        });
      }

      dispatch(setAllDraftsForLanguage({ language, drafts: newDrafts }));
    }
  }, [cmsPageData, language, dispatch]);

  const handlePageChange = (slug: CmsPageSlug) => {
    dispatch(setActivePage(slug));
    setSuccessMsg('');
    setErrorMsg('');
  };

  const handleLanguageChange = (lang: CmsLanguage) => {
    dispatch(setLanguage(lang));
    setSuccessMsg('');
    setErrorMsg('');
  };

  const handleOpenMediaPicker = (target: MediaTarget) => {
    dispatch(setActiveMediaTarget(target));
  };

  const handleMediaSelect = (asset: { id: string; url: string; aspectRatio?: string }) => {
    if (activeMediaTarget === 'hero') {
      dispatch(setHeroDraft({ heroMediaAssetId: asset.id, heroMediaUrl: asset.url }));
    } else if (activeMediaTarget === 'about') {
      dispatch(setAboutDraft({ mediaAssetId: asset.id, mediaUrl: asset.url }));
    } else if (typeof activeMediaTarget === 'object' && activeMediaTarget?.type === 'about_card') {
      const cardIdx = activeMediaTarget.index;
      const updatedCards = [...(drafts.about.impactCards || [])];
      if (updatedCards[cardIdx]) {
        updatedCards[cardIdx] = {
          ...updatedCards[cardIdx],
          mediaAssetId: asset.id,
          mediaUrl: asset.url,
        };
      }
      dispatch(setAboutDraft({ impactCards: updatedCards }));
    } else if (typeof activeMediaTarget === 'object' && activeMediaTarget?.type === 'initiatives_card') {
      const cardIdx = activeMediaTarget.index;
      const updatedCards = [...(drafts.initiatives.initiatives || [])];
      if (updatedCards[cardIdx]) {
        updatedCards[cardIdx] = {
          ...updatedCards[cardIdx],
          mediaAssetId: asset.id,
          mediaUrl: asset.url,
        };
      }
      dispatch(setInitiativesDraft({ initiatives: updatedCards }));
    } else if (typeof activeMediaTarget === 'object' && activeMediaTarget?.type === 'gallery_image') {
      const imgIdx = activeMediaTarget.index;
      const updatedImages = [...(drafts.gallery.images || [])];
      if (updatedImages[imgIdx]) {
        updatedImages[imgIdx] = {
          ...updatedImages[imgIdx],
          mediaAssetId: asset.id,
          url: asset.url,
        };
      }
      dispatch(setGalleryDraft({ images: updatedImages }));
    } else if (activeMediaTarget === 'donation') {
      dispatch(setDonationDraft({ featureMediaAssetId: asset.id, featureMediaUrl: asset.url }));
    } else if (activeMediaTarget === 'seo') {
      dispatch(setSeoDraft({ ogMediaAssetId: asset.id, ogMediaUrl: asset.url }));
    } else if (activeMediaTarget === 'mission_cta') {
      dispatch(setMissionCtaDraft({ bannerMediaAssetId: asset.id, bannerMediaUrl: asset.url }));
    }
    dispatch(setActiveMediaTarget(null));
  };

  const handleMediaRemove = () => {
    if (activeMediaTarget === 'hero') {
      dispatch(setHeroDraft({ heroMediaAssetId: '', heroMediaUrl: '' }));
    } else if (activeMediaTarget === 'about') {
      dispatch(setAboutDraft({ mediaAssetId: '', mediaUrl: '' }));
    } else if (typeof activeMediaTarget === 'object' && activeMediaTarget?.type === 'about_card') {
      const cardIdx = activeMediaTarget.index;
      const updatedCards = [...(drafts.about.impactCards || [])];
      if (updatedCards[cardIdx]) {
        updatedCards[cardIdx] = {
          ...updatedCards[cardIdx],
          mediaAssetId: '',
          mediaUrl: '',
        };
      }
      dispatch(setAboutDraft({ impactCards: updatedCards }));
    } else if (typeof activeMediaTarget === 'object' && activeMediaTarget?.type === 'initiatives_card') {
      const cardIdx = activeMediaTarget.index;
      const updatedCards = [...(drafts.initiatives.initiatives || [])];
      if (updatedCards[cardIdx]) {
        updatedCards[cardIdx] = {
          ...updatedCards[cardIdx],
          mediaAssetId: '',
          mediaUrl: '',
        };
      }
      dispatch(setInitiativesDraft({ initiatives: updatedCards }));
    } else if (typeof activeMediaTarget === 'object' && activeMediaTarget?.type === 'gallery_image') {
      const imgIdx = activeMediaTarget.index;
      const updatedImages = [...(drafts.gallery.images || [])];
      if (updatedImages[imgIdx]) {
        updatedImages[imgIdx] = {
          ...updatedImages[imgIdx],
          mediaAssetId: '',
          url: '',
        };
      }
      dispatch(setGalleryDraft({ images: updatedImages }));
    } else if (activeMediaTarget === 'donation') {
      dispatch(setDonationDraft({ featureMediaAssetId: '', featureMediaUrl: '' }));
    } else if (activeMediaTarget === 'seo') {
      dispatch(setSeoDraft({ ogMediaAssetId: '', ogMediaUrl: '' }));
    } else if (activeMediaTarget === 'mission_cta') {
      dispatch(setMissionCtaDraft({ bannerMediaAssetId: '', bannerMediaUrl: '' }));
    }
    dispatch(setActiveMediaTarget(null));
  };

  const handleSaveAllSections = async () => {
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const payloadSections = [
        { sectionKey: 'hero', sectionType: 'hero', sortOrder: 1, contentJson: drafts.hero },
        { sectionKey: 'about', sectionType: 'about', sortOrder: 2, contentJson: drafts.about },
        { sectionKey: 'initiatives', sectionType: 'initiatives', sortOrder: 3, contentJson: drafts.initiatives },
        { sectionKey: 'gallery', sectionType: 'gallery', sortOrder: 4, contentJson: drafts.gallery },
        { sectionKey: 'donation_settings', sectionType: 'donation_settings', sortOrder: 5, contentJson: drafts.donation },
        { sectionKey: 'mission_cta', sectionType: 'mission_cta', sortOrder: 6, contentJson: drafts.missionCta },
      ];

      await updateCmsSections({
        slug: activePage,
        sections: payloadSections,
        language,
      }).unwrap();

      setSuccessMsg(
        `All CMS sections for ${activePage.toUpperCase()} (${language.toUpperCase()}) saved & published successfully!`
      );
    } catch (err: unknown) {
      const errorObj = err as { data?: { message?: string }; message?: string };
      setErrorMsg(errorObj.data?.message || errorObj.message || 'Failed to publish CMS sections');
    }
  };

  const getActiveMediaInfo = (): { assetId?: string; mediaUrl?: string; title?: string; targetSection: 'hero' | 'about' | 'gallery' | 'donation' | 'seo' } => {
    if (typeof activeMediaTarget === 'object' && activeMediaTarget?.type === 'about_card') {
      const card = drafts.about.impactCards?.[activeMediaTarget.index];
      return {
        assetId: card?.mediaAssetId,
        mediaUrl: card?.mediaUrl,
        title: `Select Image for Impact Card #${activeMediaTarget.index + 1} (${card?.title || 'Card'})`,
        targetSection: 'about',
      };
    }
    if (typeof activeMediaTarget === 'object' && activeMediaTarget?.type === 'initiatives_card') {
      const card = drafts.initiatives.initiatives?.[activeMediaTarget.index];
      return {
        assetId: card?.mediaAssetId,
        mediaUrl: card?.mediaUrl,
        title: `Select Cover Photo for Initiative Card #${activeMediaTarget.index + 1} (${card?.title || 'Card'})`,
        targetSection: 'about',
      };
    }
    if (typeof activeMediaTarget === 'object' && activeMediaTarget?.type === 'gallery_image') {
      const img = drafts.gallery.images?.[activeMediaTarget.index];
      return {
        assetId: img?.mediaAssetId,
        mediaUrl: img?.url,
        title: `Select Image for Gallery Photo #${activeMediaTarget.index + 1} (${img?.title || 'Photo'})`,
        targetSection: 'gallery',
      };
    }
    switch (activeMediaTarget) {
      case 'hero':
        return {
          assetId: drafts.hero.heroMediaAssetId,
          mediaUrl: drafts.hero.heroMediaUrl,
          title: 'Select Hero Banner Media Asset',
          targetSection: 'hero',
        };
      case 'about':
        return {
          assetId: drafts.about.mediaAssetId,
          mediaUrl: drafts.about.mediaUrl,
          title: 'Select About Us Media Asset',
          targetSection: 'about',
        };
      case 'donation':
        return {
          assetId: drafts.donation.featureMediaAssetId,
          mediaUrl: drafts.donation.featureMediaUrl,
          title: 'Select Donation Feature Media Asset',
          targetSection: 'donation',
        };
      case 'seo':
        return {
          assetId: drafts.seo.ogMediaAssetId,
          mediaUrl: drafts.seo.ogMediaUrl,
          title: 'Select SEO Metadata Media Asset',
          targetSection: 'seo',
        };
      case 'mission_cta':
        return {
          assetId: drafts.missionCta.bannerMediaAssetId,
          mediaUrl: drafts.missionCta.bannerMediaUrl,
          title: 'Select Mission Banner Background Photo',
          targetSection: 'hero',
        };
      default:
        return { assetId: undefined, mediaUrl: undefined, title: undefined, targetSection: 'about' };
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

  return (
    <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
      <Header
        title="Admin Panel CMS Manager"
        subtitle="Manage website body sections, text copy, donation presets & SEO dynamically for all pages"
      />

      {/* Two-Tier Control Action Header */}
      <div className="bg-slate-900/80 border-b border-slate-800/80 shadow-sm shrink-0">
        <div className="px-6 py-2.5 flex items-center justify-between gap-4 min-w-0 flex-wrap">
          <div className="min-w-0 flex-1 flex items-center gap-3">
            <CmsPageSelector activePage={activePage} onSelectPage={handlePageChange} />

            {/* Language Switcher Badge (English / Hindi) */}
            <div className="flex items-center gap-1 bg-slate-950/80 p-1 border border-slate-800 rounded-xl shrink-0">
              <Globe className="w-3.5 h-3.5 text-emerald-400 ml-1.5" />
              <button
                type="button"
                onClick={() => handleLanguageChange('en')}
                className={`px-2.5 py-1 cursor-pointer rounded-lg text-[11px] font-bold transition-all ${language === 'en'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
                  }`}
              >
                English (EN)
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('hi')}
                className={`px-2.5 py-1 cursor-pointer rounded-lg text-[11px] font-bold transition-all ${language === 'hi'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
                  }`}
              >
                Hindi (HI)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleSaveAllSections}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2 shrink-0 disabled:opacity-50"
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

      {/* Main Workspace (Sidebar + Form Editor or Members Management) */}
      {activePage !== 'home' && activePage !== 'members' ? (
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
                Currently, section data is available for <strong className="text-emerald-400">Home Page</strong> and <strong className="text-emerald-400">Members Page</strong>. The sections for <strong>{activePage.replace('-', ' ')}</strong> will be displayed here once their backend API data is published.
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
              onSelectTab={(tab) => dispatch(setActiveTab(tab))}
              orientation="vertical"
              translationStatus={cmsPageData?.translationStatus}
              currentLanguage={language}
            />
          </div>

          {/* Right Active Section Editor Workspace */}
          <div className="flex-1 min-w-0 overflow-y-auto pr-1 space-y-6">
            {activeTab === 'hero' && (
              <CmsHeroEditor
                content={drafts.hero}
                onChange={(val) => dispatch(setHeroDraft(val))}
                onOpenMediaPicker={() => handleOpenMediaPicker('hero')}
                isMembersPage={activePage === 'members'}
              />
            )}

            {activeTab === 'about' && (
              activePage === 'members' ? (
                <MembersPage hideHeader={true} currentLanguage={language} />
              ) : (
                <CmsAboutEditor
                  content={drafts.about}
                  onChange={(val) => dispatch(setAboutDraft(val))}
                  onOpenMediaPicker={(target) => handleOpenMediaPicker(target || 'about')}
                />
              )
            )}

            {activeTab === 'initiatives' && (
              <CmsInitiativesEditor
                content={drafts.initiatives}
                onChange={(val) => dispatch(setInitiativesDraft(val))}
                onOpenMediaPicker={handleOpenMediaPicker}
              />
            )}

            {activeTab === 'gallery' && (
              <CmsGalleryEditor
                content={drafts.gallery}
                onChange={(val) => dispatch(setGalleryDraft(val))}
                onOpenMediaPicker={handleOpenMediaPicker}
              />
            )}

            {activeTab === 'donation_settings' && (
              <CmsDonationEditor
                content={drafts.donation}
                onChange={(val) => dispatch(setDonationDraft(val))}
                onOpenMediaPicker={() => handleOpenMediaPicker('donation')}
              />
            )}

            {activeTab === 'mission_cta' && (
              <CmsMissionCTAEditor
                content={drafts.missionCta}
                onChange={(val) => dispatch(setMissionCtaDraft(val))}
                onOpenMediaPicker={() => handleOpenMediaPicker('mission_cta')}
                isMembersPage={activePage === 'members'}
              />
            )}

            {activeTab === 'seo' && (
              <CmsSEOEditor
                content={drafts.seo}
                onChange={(val) => dispatch(setSeoDraft(val))}
                onOpenMediaPicker={() => handleOpenMediaPicker('seo')}
              />
            )}
          </div>
        </div>
      )}

      {/* Media Selector Overlay Modal */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => dispatch(setMediaPickerOpen(false))}
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
