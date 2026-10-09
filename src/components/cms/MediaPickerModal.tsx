import React, { useState, useEffect } from 'react';
import { X, Upload, Check, Image as ImageIcon, Loader2, Trash2 } from 'lucide-react';
import { adminApi } from '../../services/api';
import type { MediaAsset } from '../../types';

export type CmsMediaSectionTarget = 'hero' | 'about' | 'donation' | 'seo' | 'gallery';
export type CmsAspectRatio = '16:9' | '4:3' | '1:1' | '21:9' | 'auto';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (asset: { id: string; url: string; aspectRatio?: CmsAspectRatio }) => void;
  onRemove?: () => void;
  title?: string;
  targetSection?: CmsMediaSectionTarget | null;
  activeAssetId?: string;
  activeMediaUrl?: string;
  initialAspectRatio?: CmsAspectRatio;
}

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  onRemove,
  title,
  targetSection = 'hero',
  activeAssetId,
  activeMediaUrl,
}) => {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const sectionTitles: Record<CmsMediaSectionTarget, { title: string; subtitle: string }> = {
    hero: {
      title: 'Select Hero Banner Media Asset',
      subtitle: 'Displaying media assets belonging strictly to the Hero Banner section',
    },
    about: {
      title: 'Select About Us Media Asset',
      subtitle: 'Displaying media assets belonging strictly to the About Us section',
    },
    donation: {
      title: 'Select Donation Fund Media Asset',
      subtitle: 'Displaying media assets belonging strictly to the Donation Fund section',
    },
    seo: {
      title: 'Select SEO Metadata Media Asset',
      subtitle: 'Displaying media assets belonging strictly to SEO Social Sharing',
    },
    gallery: {
      title: 'Select Gallery Section Media Asset',
      subtitle: 'Displaying media assets belonging strictly to the Gallery section',
    },
  };

  const currentSection: CmsMediaSectionTarget =
    typeof targetSection === 'string' && targetSection in sectionTitles
      ? (targetSection as CmsMediaSectionTarget)
      : 'about';

  const displayTitle = title || sectionTitles[currentSection]?.title || 'Select Media Asset';
  const displaySubtitle = sectionTitles[currentSection]?.subtitle || 'Displaying media assets for this section';

  useEffect(() => {
    if (isOpen) {
      setSelectedAsset(null);
      loadMediaAssets();
    }
  }, [isOpen, currentSection, activeAssetId, activeMediaUrl]);

  useEffect(() => {
    if (isOpen && assets.length > 0) {
      const currentAssigned = assets.find((asset) => {
        const url = asset.public_url || `/storage/public/${asset.relative_path}`;
        return (
          (activeAssetId && asset.id === activeAssetId) ||
          (activeMediaUrl && (url === activeMediaUrl || asset.relative_path === activeMediaUrl || activeMediaUrl.includes(asset.relative_path)))
        );
      });
      if (currentAssigned) {
        setSelectedAsset(currentAssigned);
      }
    }
  }, [isOpen, assets, activeAssetId, activeMediaUrl]);

  const loadMediaAssets = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await adminApi.getMediaAssets(1, 50);
      if (res && res.items) {
        setAssets(res.items);
      } else if (Array.isArray(res)) {
        setAssets(res);
      } else {
        setAssets([]);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load media assets from API');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrorMsg('');
    try {
      const uploaded = await adminApi.uploadMedia(file, 'public');
      setAssets((prev) => [uploaded, ...prev]);
      setSelectedAsset(uploaded);
    } catch (err: any) {
      setErrorMsg(err.message || 'File upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleConfirm = () => {
    if (selectedAsset) {
      const url = selectedAsset.public_url || `/storage/public/${selectedAsset.relative_path}`;
      onSelect({
        id: selectedAsset.id,
        url,
        aspectRatio: '16:9',
      });
      onClose();
    }
  };

  const handleClearSelection = () => {
    if (onRemove) {
      onRemove();
    } else {
      onSelect({ id: '', url: '', aspectRatio: '16:9' });
    }
    onClose();
  };

  // Safely filter media assets for current section
  const sectionAssets = assets.filter((asset) => {
    if (!asset) return false;
    const assetUrl = asset.public_url || (asset.relative_path ? `/storage/public/${asset.relative_path}` : '');
    const matchesId = Boolean(activeAssetId && asset.id === activeAssetId);
    const matchesUrl = Boolean(
      activeMediaUrl &&
      ((assetUrl && assetUrl === activeMediaUrl) ||
        (asset.relative_path && asset.relative_path === activeMediaUrl) ||
        activeMediaUrl.includes(asset.id) ||
        (asset.relative_path && activeMediaUrl.includes(asset.relative_path)))
    );
    const matchesSectionName = Boolean(
      (asset.relative_path && asset.relative_path.toLowerCase().includes(currentSection)) ||
      (asset.public_url && asset.public_url.toLowerCase().includes(currentSection))
    );

    return matchesId || matchesUrl || matchesSectionName;
  });

  // Display section assets if available, otherwise show all media library assets
  const displayAssets = sectionAssets.length > 0 ? sectionAssets : assets;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">{displayTitle}</h3>
              <p className="text-xs text-slate-400">{displaySubtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            title="Close Modal"
            className="w-8 h-8 rounded-full bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {errorMsg && (
            <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
              {errorMsg}
            </div>
          )}

          {/* Upload Button Box */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/60 border border-slate-800 border-dashed">
            <div className="flex items-center gap-3">
              <Upload className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-xs font-semibold text-slate-200">Upload New Media File</p>
                <p className="text-[11px] text-slate-400">PNG, JPG, WEBP or SVG for {currentSection.toUpperCase()} section</p>
              </div>
            </div>
            <label className="cursor-pointer px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2">
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Choose File</span>
                </>
              )}
              <input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} className="hidden" />
            </label>
          </div>

          {/* Asset Grid */}
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
              <p className="text-xs">Loading media assets from API...</p>
            </div>
          ) : displayAssets.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No media assets found in the media library. Upload a new image above to select it.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
              {displayAssets.map((asset) => {
                const url = asset.public_url || `/storage/public/${asset.relative_path}`;
                const isSelected = selectedAsset?.id === asset.id;
                return (
                  <label
                    key={asset.id}
                    className={`relative rounded-2xl overflow-hidden border transition-all text-left group cursor-pointer block aspect-[16/9] ${isSelected
                      ? 'border-emerald-400 ring-2 ring-emerald-500/40 bg-slate-950 shadow-xl shadow-emerald-500/10'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                      }`}
                  >
                    <input
                      type="radio"
                      name={`section_media_selection_${currentSection}`}
                      value={asset.id}
                      checked={isSelected}
                      onChange={() => setSelectedAsset(asset)}
                      className="sr-only"
                    />

                    <img src={url} alt="Media Asset" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />

                    {/* Radio Button & Check Indicator Overlay */}
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-slate-800 shadow-lg">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-emerald-400 bg-emerald-400' : 'border-slate-400 bg-slate-900'
                        }`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                      </div>
                      <span className={`text-[10px] font-bold tracking-wider ${isSelected ? 'text-emerald-400' : 'text-slate-300'
                        }`}>
                        {isSelected ? 'Selected' : 'Select'}
                      </span>
                    </div>

                    {isSelected && (
                      <div className="absolute inset-0 bg-emerald-500/15 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      </div>
                    )}
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">
              {selectedAsset ? `Selected: ${selectedAsset.id.slice(0, 8)}...` : 'No asset selected'}
            </span>
            <button
              type="button"
              onClick={handleClearSelection}
              className="px-3 py-1.5 text-xs font-semibold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove Selected Image</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Close</span>
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedAsset}
              className="px-5 py-2 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 disabled:hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              Select Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

