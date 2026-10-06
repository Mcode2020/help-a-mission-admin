export interface AdminUser {
  id: string;
  email: string;
  role: string;
  permissions: string[];
  lastLoginAt?: string;
  createdAt?: string;
}

export interface Permission {
  id: string;
  key: string;
  module: string;
  description: string;
  is_active: boolean;
}

export interface Role {
  id: string;
  key: string;
  name: string;
  description: string;
  is_system: boolean;
  is_active: boolean;
  permissions?: Permission[];
}

export interface Donor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'active' | 'disabled';
  created_source: 'signup' | 'donation';
  created_at: string;
}

export interface Donation {
  id: string;
  user_id: string;
  amount_minor: number;
  currency: string;
  status: 'initiated' | 'order_created' | 'authorized' | 'captured' | 'failed' | 'refunded';
  message?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  paid_at?: string;
  created_at: string;
}

export interface FinancialSummary {
  grossAmountMinor: number;
  refundAmountMinor: number;
  netAmountMinor: number;
  totalSuccessfulCount: number;
  uniqueDonorsCount: number;
  averageDonationMinor: number;
}

export interface CmsSection {
  id?: string;
  sectionKey: string;
  sectionType: string;
  sortOrder: number;
  contentJson: any;
  status?: string;
  version?: number;
}

export interface CmsPageData {
  id: string;
  slug: string;
  title: string;
  status: string;
  sections: CmsSection[];
}

export interface Initiative {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  cover_media_asset_id?: string;
  status: 'draft' | 'published' | 'archived';
  published_at?: string;
  created_at: string;
}

export interface GalleryItem {
  id: string;
  media_asset_id: string;
  title?: string;
  caption?: string;
  alt_text?: string;
  category?: string;
  sort_order: number;
  public_url?: string;
  status: 'published' | 'draft';
  created_at: string;
}

export interface MediaAsset {
  id: string;
  visibility: 'public' | 'private';
  storage_type: 'local_public' | 'local_private';
  relative_path: string;
  public_url?: string;
  mime_type: string;
  size_bytes: number;
  sha256: string;
  created_at: string;
}

export interface AuditEvent {
  id: string;
  request_id: string;
  actor_type: 'admin' | 'user' | 'system';
  actor_id?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  before_redacted?: any;
  after_redacted?: any;
  created_at: string;
}
