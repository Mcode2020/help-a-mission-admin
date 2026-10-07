import React, { useState } from 'react';
import { Image as ImageIcon, Plus, Trash2, Upload, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
import type { CmsGallerySectionContent, CmsGalleryItem } from '../../types';
import { adminApi } from '../../services/api';

export type GalleryMediaTarget = { type: 'gallery_image'; index: number };

interface CmsGalleryEditorProps {
  content: CmsGallerySectionContent;
  onChange: (updated: CmsGallerySectionContent) => void;
  onOpenMediaPicker?: (target: GalleryMediaTarget) => void;
}

export const CmsGalleryEditor: React.FC<CmsGalleryEditorProps> = ({
  content,
  onChange,
  onOpenMediaPicker,
}) => {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [globalUploading, setGlobalUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>('');

  const updateField = (field: keyof CmsGallerySectionContent, value: any) => {
    onChange({ ...content, [field]: value });
  };

  const imagesList = content.images || [];

  const handleUpdateImage = (index: number, field: keyof CmsGalleryItem, value: any) => {
    const updated = [...imagesList];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...content, images: updated });
  };

  const handleAddImage = (newUrl?: string, newAssetId?: string, defaultTitle?: string) => {
    const newIndex = imagesList.length + 1;
    const newItem: CmsGalleryItem = {
      id: `gal_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      title: defaultTitle || `Gallery Activity Photo #${newIndex}`,
      url: newUrl || '',
      mediaAssetId: newAssetId || '',
      alt: defaultTitle || 'Help-A-Mission Gallery Photo',
      sortOrder: newIndex,
    };
    onChange({ ...content, images: [...imagesList, newItem] });
  };

  const handleRemoveImage = (index: number) => {
    const updated = imagesList.filter((_, i) => i !== index);
    onChange({ ...content, images: updated });
  };

  const handleClearImageMedia = (index: number) => {
    const updated = [...imagesList];
    updated[index] = {
      ...updated[index],
      url: '',
      mediaAssetId: '',
    };
    onChange({ ...content, images: updated });
  };

  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= imagesList.length) return;
    const updated = [...imagesList];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onChange({ ...content, images: updated });
  };

  // Direct File Upload for a specific card
  const handleCardFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingIndex(index);
    setUploadError('');
    try {
      const uploaded = await adminApi.uploadMedia(file, 'public');
      const publicUrl = uploaded.public_url || `/storage/public/${uploaded.relative_path}`;
      const updated = [...imagesList];
      updated[index] = {
        ...updated[index],
        mediaAssetId: uploaded.id,
        url: publicUrl,
      };
      onChange({ ...content, images: updated });
    } catch (err: any) {
      setUploadError(err.message || 'Image upload failed');
    } finally {
      setUploadingIndex(null);
    }
  };

  // Direct File Upload to add a NEW card
  const handleGlobalFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setGlobalUploading(true);
    setUploadError('');
    try {
      const uploaded = await adminApi.uploadMedia(file, 'public');
      const publicUrl = uploaded.public_url || `/storage/public/${uploaded.relative_path}`;
      const defaultTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      handleAddImage(publicUrl, uploaded.id, defaultTitle);
    } catch (err: any) {
      setUploadError(err.message || 'Image upload failed');
    } finally {
      setGlobalUploading(false);
    }
  };

  // Preset default photos from Figma mockup if list is empty
  const handleLoadFigmaDefaults = () => {
    const defaults: CmsGalleryItem[] = [
      { id: 'fig_1', title: 'Welfare Cheque Distribution', url: '/src/assets/gallery-1.png', alt: 'Welfare Cheque Distribution' },
      { id: 'fig_2', title: 'School Support Contribution', url: '/src/assets/gallery-2.png', alt: 'School Support Contribution' },
      { id: 'fig_3', title: 'Community Aid Felicitation', url: '/src/assets/campaign_financial.png', alt: 'Community Aid Felicitation' },
      { id: 'fig_4', title: 'Welfare Cheque Distribution', url: '/src/assets/gallery-1.png', alt: 'Welfare Cheque Distribution' },
      { id: 'fig_5', title: 'School Support Contribution', url: '/src/assets/gallery-2.png', alt: 'School Support Contribution' },
      { id: 'fig_6', title: 'Community Aid Felicitation', url: '/src/assets/campaign_financial.png', alt: 'Community Aid Felicitation' },
      { id: 'fig_7', title: 'Welfare Cheque Distribution', url: '/src/assets/gallery-1.png', alt: 'Welfare Cheque Distribution' },
      { id: 'fig_8', title: 'School Support Contribution', url: '/src/assets/gallery-2.png', alt: 'School Support Contribution' },
      { id: 'fig_9', title: 'Community Aid Felicitation', url: '/src/assets/campaign_financial.png', alt: 'Community Aid Felicitation' },
    ];
    onChange({ ...content, images: defaults });
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Moments That Matter / Gallery Section</h3>
            <p className="text-xs text-slate-400">Manage section text copy, upload new photos and structure 3x3 photo gallery layout</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <label className="cursor-pointer px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5">
            {globalUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Upload New Image</span>
              </>
            )}
            <input type="file" accept="image/*" onChange={handleGlobalFileUpload} disabled={globalUploading} className="hidden" />
          </label>
          <button
            type="button"
            onClick={() => handleAddImage()}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {uploadError && (
        <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
          {uploadError}
        </div>
      )}

      {/* Section Text Copy Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">Eyebrow Tagline</label>
          <input
            type="text"
            value={content.eyebrow || ''}
            onChange={(e) => updateField('eyebrow', e.target.value)}
            placeholder="OUR GALLERY"
            className="w-full bg-slate-950/80 text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-slate-800 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">View All Gallery CTA Label</label>
          <input
            type="text"
            value={content.viewAllLabel || ''}
            onChange={(e) => updateField('viewAllLabel', e.target.value)}
            placeholder="View All Photos"
            className="w-full bg-slate-950/80 text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-slate-800 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-300 mb-2">Section Heading</label>
          <input
            type="text"
            value={content.heading || ''}
            onChange={(e) => updateField('heading', e.target.value)}
            placeholder="Moments That Matter"
            className="w-full bg-slate-950/80 text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-slate-800 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-300 mb-2">Sub-heading Description</label>
          <textarea
            rows={2}
            value={content.description || ''}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="A glimpse of our recent activities, health camps and social initiatives."
            className="w-full bg-slate-950/80 text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-slate-800 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
      </div>

      {/* Gallery Images Manager Header */}
      <div className="pt-4 border-t border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-xs font-bold text-slate-200">
              Gallery Photos ({imagesList.length} total)
            </h4>
            <p className="text-[11px] text-slate-400">
              Photos uploaded here are displayed in the 3x3 layout on the homepage
            </p>
          </div>

          {imagesList.length === 0 && (
            <button
              type="button"
              onClick={handleLoadFigmaDefaults}
              className="px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold transition-all"
            >
              Load 9 Demo Figma Photos
            </button>
          )}
        </div>

        {imagesList.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800 border-dashed space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-200">No photos in gallery section yet</p>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                Upload image files or select existing media assets to build your gallery.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <label className="cursor-pointer px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2">
                <Upload className="w-4 h-4" />
                <span>Upload First Image</span>
                <input type="file" accept="image/*" onChange={handleGlobalFileUpload} disabled={globalUploading} className="hidden" />
              </label>
              <button
                type="button"
                onClick={handleLoadFigmaDefaults}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all"
              >
                Load Figma Defaults
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {imagesList.map((img, idx) => (
              <div
                key={img.id || idx}
                className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3 flex flex-col justify-between group hover:border-slate-700 transition-all shadow-lg"
              >
                {/* Photo Item Header & Reordering */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                  <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                    Photo #{idx + 1}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveImage(idx, 'up')}
                      className="p-1 text-slate-400 hover:text-slate-100 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === imagesList.length - 1}
                      onClick={() => handleMoveImage(idx, 'down')}
                      className="p-1 text-slate-400 hover:text-slate-100 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="p-1 text-slate-400 hover:text-red-400 transition-colors ml-1"
                      title="Delete Photo Card"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Photo Image Preview & Upload Controls */}
                <div className="relative h-44 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center group/preview">
                  {img.url ? (
                    <>
                      <img src={img.url} alt={img.title || 'Gallery Photo'} className="w-full h-full object-cover transition-transform duration-300 group-hover/preview:scale-105" />
                      <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2 backdrop-blur-[2px]">
                        {onOpenMediaPicker && (
                          <button
                            type="button"
                            onClick={() => onOpenMediaPicker({ type: 'gallery_image', index: idx })}
                            className="px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[11px] font-bold rounded-lg transition-all shadow-md"
                          >
                            Change Asset
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleClearImageMedia(idx)}
                          className="px-2 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-[11px] font-semibold rounded-lg transition-all"
                        >
                          Clear
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4 text-center space-y-2">
                      <ImageIcon className="w-8 h-8 text-slate-600" />
                      <p className="text-[11px] text-slate-400">No image assigned</p>
                      <div className="flex items-center gap-2 pt-1">
                        <label className="cursor-pointer px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[11px] font-bold rounded-lg transition-all shadow-sm flex items-center gap-1">
                          {uploadingIndex === idx ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Upload className="w-3 h-3" />
                          )}
                          <span>Upload File</span>
                          <input type="file" accept="image/*" onChange={(e) => handleCardFileUpload(e, idx)} disabled={uploadingIndex === idx} className="hidden" />
                        </label>
                        {onOpenMediaPicker && (
                          <button
                            type="button"
                            onClick={() => onOpenMediaPicker({ type: 'gallery_image', index: idx })}
                            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold rounded-lg border border-slate-700"
                          >
                            Library
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Direct Upload / Library Quick Bar when URL is present */}
                {img.url && (
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <label className="cursor-pointer text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors">
                      {uploadingIndex === idx ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3 h-3" />
                          <span>Upload Replacement</span>
                        </>
                      )}
                      <input type="file" accept="image/*" onChange={(e) => handleCardFileUpload(e, idx)} disabled={uploadingIndex === idx} className="hidden" />
                    </label>

                    {onOpenMediaPicker && (
                      <button
                        type="button"
                        onClick={() => onOpenMediaPicker({ type: 'gallery_image', index: idx })}
                        className="text-[11px] font-semibold text-slate-400 hover:text-slate-200 transition-colors"
                      >
                        Media Library
                      </button>
                    )}
                  </div>
                )}

                {/* Form Fields: Title / Caption */}
                <div className="space-y-2 pt-1">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Image Title / Caption</label>
                    <input
                      type="text"
                      value={img.title || ''}
                      onChange={(e) => handleUpdateImage(idx, 'title', e.target.value)}
                      placeholder="e.g. Welfare Cheque Distribution"
                      className="w-full bg-slate-900 text-slate-100 text-xs rounded-lg px-3 py-2 border border-slate-800 focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CmsGalleryEditor;
