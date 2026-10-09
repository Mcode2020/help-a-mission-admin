export interface CmsCTA {
  label: string;
  url: string;
  openInNewTab?: boolean;
}

export interface CmsHeroSectionContent {
  eyebrow: string;
  heading: string;
  headingHighlight?: string;
  body: string;
  primaryCTA: CmsCTA;
  secondaryCTA: CmsCTA;
  heroMediaAssetId?: string;
  heroMediaUrl?: string;
  heroImageAlt?: string;
  stat1Value?: string;
  stat1Label?: string;
  stat2Value?: string;
  stat2Label?: string;
  stat3Value?: string;
  stat3Label?: string;
}

export interface CmsImpactCard {
  id: string;
  title: string;
  description: string;
  iconName: string;
  linkUrl?: string;
  sortOrder: number;
  mediaAssetId?: string;
  mediaUrl?: string;
}

export interface CmsAboutSectionContent {
  eyebrow: string;
  heading: string;
  description: string;
  experienceBadge: string;
  mediaAssetId?: string;
  mediaUrl?: string;
  mediaAlt?: string;
  impactCards: CmsImpactCard[];
  cta?: CmsCTA;
}

export interface CmsInitiativeCard {
  id: string;
  title: string;
  description: string;
  mediaAssetId?: string;
  mediaUrl?: string;
  linkUrl?: string;
  category?: string;
  sortOrder?: number;
}

export interface CmsInitiativesSectionContent {
  eyebrow: string;
  heading: string;
  description: string;
  featuredCount?: number;
  viewAllUrl?: string;
  viewAllLabel?: string;
  initiatives?: CmsInitiativeCard[];
}

export interface CmsGalleryItem {
  id: string;
  title?: string;
  mediaAssetId?: string;
  url: string;
  alt?: string;
  sortOrder?: number;
}

export interface CmsGallerySectionContent {
  eyebrow?: string;
  heading?: string;
  description?: string;
  selectedAssetIds?: string[];
  images?: CmsGalleryItem[];
  viewAllUrl?: string;
  viewAllLabel?: string;
}

export interface CmsDonationBadge {
  id: string;
  icon: string;
  label: string;
}

export interface CmsFormField {
  id: string;
  label: string;
  type:
    | 'text'
    | 'email'
    | 'tel'
    | 'number'
    | 'textarea'
    | 'date'
    | 'time'
    | 'datetime-local'
    | 'month'
    | 'week'
    | 'url'
    | 'password'
    | 'checkbox'
    | 'radio'
    | 'color'
    | 'range'
    | 'file';
  placeholder?: string;
  required?: boolean;
}

export interface CmsDonationSectionContent {
  eyebrow: string;
  heading: string;
  body: string;
  badges: CmsDonationBadge[];
  featureMediaAssetId?: string;
  featureMediaUrl?: string;
  featureMediaAlt?: string;
  cardTitle: string;
  cardSubtitle: string;
  suggestedAmountsINR: number[];
  defaultAmountINR: number;
  customAmountEnabled: boolean;
  customAmountButtonLabel?: string;
  customAmountInputLabel?: string;
  customAmountPlaceholder?: string;
  customAmountRequired?: boolean;
  minAmountINR?: number;
  maxAmountINR?: number;
  donateButtonLabel: string;
  showFullName?: boolean;
  showEmail?: boolean;
  showPhone?: boolean;
  showMessage?: boolean;
  customFields?: CmsFormField[];
}

export interface CmsMissionCTASectionContent {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  secondaryCtaLabel?: string;
  secondaryCtaUrl?: string;
  bannerMediaAssetId?: string;
  bannerMediaUrl?: string;
  bannerMediaAspectRatio?: string;
}

export interface CmsSEOSectionContent {
  metaTitle: string;
  metaDescription: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogMediaAssetId?: string;
  ogMediaUrl?: string;
  keywords?: string;
}

export type CmsSectionKey =
  | 'hero'
  | 'about'
  | 'initiatives'
  | 'gallery'
  | 'donation_settings'
  | 'mission_cta'
  | 'seo';

export interface CmsSectionPayload {
  sectionKey: CmsSectionKey;
  sectionType: string;
  sortOrder: number;
  contentJson: Record<string, unknown> | unknown;
  status?: string;
}
