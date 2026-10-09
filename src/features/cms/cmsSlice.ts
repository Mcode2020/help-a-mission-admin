import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CmsPageSlug } from '../../components/cms/CmsPageSelector';
import type { RootState } from '../../app/store';
import type {
  CmsSectionKey,
  CmsHeroSectionContent,
  CmsAboutSectionContent,
  CmsInitiativesSectionContent,
  CmsGallerySectionContent,
  CmsDonationSectionContent,
  CmsMissionCTASectionContent,
  CmsSEOSectionContent,
} from '../../types';

export type CmsLanguage = 'en' | 'hi';

export type MediaTarget =
  | 'hero'
  | 'about'
  | 'donation'
  | 'seo'
  | 'mission_cta'
  | { type: 'about_card'; index: number }
  | { type: 'initiatives_card'; index: number }
  | { type: 'gallery_image'; index: number }
  | null;

export interface CmsDraftState {
  hero: CmsHeroSectionContent;
  about: CmsAboutSectionContent;
  initiatives: CmsInitiativesSectionContent;
  gallery: CmsGallerySectionContent;
  donation: CmsDonationSectionContent;
  missionCta: CmsMissionCTASectionContent;
  seo: CmsSEOSectionContent;
}

export interface CmsUiState {
  activePage: CmsPageSlug;
  activeTab: CmsSectionKey;
  language: CmsLanguage;
  mediaPickerOpen: boolean;
  activeMediaTarget: MediaTarget;
  isSaving: boolean;
  draftsByLanguage: Record<CmsLanguage, CmsDraftState>;
}

export const initialDrafts: CmsDraftState = {
  hero: {
    eyebrow: '',
    heading: '',
    body: '',
    primaryCTA: { label: '', url: '#contact' },
    secondaryCTA: { label: '', url: '#about' },
  },
  about: {
    eyebrow: '',
    heading: '',
    description: '',
    experienceBadge: '',
    impactCards: [],
    cta: { label: '', url: '' },
  },
  initiatives: {
    eyebrow: '',
    heading: '',
    description: '',
    featuredCount: 3,
  },
  gallery: {
    eyebrow: '',
    heading: '',
    description: '',
    selectedAssetIds: [],
    images: [],
    viewAllLabel: '',
    viewAllUrl: '',
  },
  donation: {
    eyebrow: '',
    heading: '',
    body: '',
    badges: [],
    cardTitle: '',
    cardSubtitle: '',
    suggestedAmountsINR: [500, 1000, 2000, 5000],
    defaultAmountINR: 1000,
    customAmountEnabled: true,
    customAmountButtonLabel: '',
    customAmountInputLabel: '',
    customAmountPlaceholder: '',
    customAmountRequired: true,
    donateButtonLabel: '',
    customFields: [
      { id: 'f1', label: 'Full Name', type: 'text', placeholder: 'Enter your name', required: true },
      { id: 'f2', label: 'Email Address', type: 'email', placeholder: 'Enter your email', required: true },
      { id: 'f3', label: 'Phone Number', type: 'tel', placeholder: 'Enter your phone number', required: true },
      { id: 'f4', label: 'Message', type: 'textarea', placeholder: 'Anything you would like us to know?', required: false },
    ],
  },
  missionCta: {
    eyebrow: '',
    heading: '',
    subheading: '',
    ctaLabel: '',
    ctaUrl: '',
  },
  seo: {
    metaTitle: '',
    metaDescription: '',
    keywords: '',
  },
};

const initialState: CmsUiState = {
  activePage: 'home',
  activeTab: 'hero',
  language: 'en',
  mediaPickerOpen: false,
  activeMediaTarget: null,
  isSaving: false,
  draftsByLanguage: {
    en: { ...initialDrafts },
    hi: { ...initialDrafts },
  },
};

export const cmsSlice = createSlice({
  name: 'cms',
  initialState,
  reducers: {
    setActivePage: (state, action: PayloadAction<CmsPageSlug>) => {
      state.activePage = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<CmsSectionKey>) => {
      state.activeTab = action.payload;
    },
    setLanguage: (state, action: PayloadAction<CmsLanguage>) => {
      state.language = action.payload;
    },
    setMediaPickerOpen: (state, action: PayloadAction<boolean>) => {
      state.mediaPickerOpen = action.payload;
      if (!action.payload) {
        state.activeMediaTarget = null;
      }
    },
    setActiveMediaTarget: (state, action: PayloadAction<MediaTarget>) => {
      state.activeMediaTarget = action.payload;
      state.mediaPickerOpen = action.payload !== null;
    },
    setIsSaving: (state, action: PayloadAction<boolean>) => {
      state.isSaving = action.payload;
    },
    setHeroDraft: (state, action: PayloadAction<Partial<CmsHeroSectionContent>>) => {
      const lang = state.language;
      state.draftsByLanguage[lang].hero = { ...state.draftsByLanguage[lang].hero, ...action.payload };
    },
    setAboutDraft: (state, action: PayloadAction<Partial<CmsAboutSectionContent>>) => {
      const lang = state.language;
      state.draftsByLanguage[lang].about = { ...state.draftsByLanguage[lang].about, ...action.payload };
    },
    setInitiativesDraft: (state, action: PayloadAction<Partial<CmsInitiativesSectionContent>>) => {
      const lang = state.language;
      state.draftsByLanguage[lang].initiatives = { ...state.draftsByLanguage[lang].initiatives, ...action.payload };
    },
    setGalleryDraft: (state, action: PayloadAction<Partial<CmsGallerySectionContent>>) => {
      const lang = state.language;
      state.draftsByLanguage[lang].gallery = { ...state.draftsByLanguage[lang].gallery, ...action.payload };
    },
    setDonationDraft: (state, action: PayloadAction<Partial<CmsDonationSectionContent>>) => {
      const lang = state.language;
      state.draftsByLanguage[lang].donation = { ...state.draftsByLanguage[lang].donation, ...action.payload };
    },
    setMissionCtaDraft: (state, action: PayloadAction<Partial<CmsMissionCTASectionContent>>) => {
      const lang = state.language;
      state.draftsByLanguage[lang].missionCta = { ...state.draftsByLanguage[lang].missionCta, ...action.payload };
    },
    setSeoDraft: (state, action: PayloadAction<Partial<CmsSEOSectionContent>>) => {
      const lang = state.language;
      state.draftsByLanguage[lang].seo = { ...state.draftsByLanguage[lang].seo, ...action.payload };
    },
    setAllDraftsForLanguage: (state, action: PayloadAction<{ language: CmsLanguage; drafts: CmsDraftState }>) => {
      state.draftsByLanguage[action.payload.language] = action.payload.drafts;
    },
  },
});

export const {
  setActivePage,
  setActiveTab,
  setLanguage,
  setMediaPickerOpen,
  setActiveMediaTarget,
  setIsSaving,
  setHeroDraft,
  setAboutDraft,
  setInitiativesDraft,
  setGalleryDraft,
  setDonationDraft,
  setMissionCtaDraft,
  setSeoDraft,
  setAllDraftsForLanguage,
} = cmsSlice.actions;

export const selectActiveCmsPage = (state: RootState) => state.cms.activePage;
export const selectActiveCmsTab = (state: RootState) => state.cms.activeTab;
export const selectCmsLanguage = (state: RootState) => state.cms.language;
export const selectCmsMediaPickerOpen = (state: RootState) => state.cms.mediaPickerOpen;
export const selectCmsActiveMediaTarget = (state: RootState) => state.cms.activeMediaTarget;
export const selectCmsIsSaving = (state: RootState) => state.cms.isSaving;
export const selectCmsDrafts = (state: RootState) => state.cms.draftsByLanguage[state.cms.language] || initialDrafts;

export default cmsSlice.reducer;
