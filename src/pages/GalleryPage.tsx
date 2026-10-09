import React from 'react';
import { Header } from '../components/layout/Header';
import { Loader2 } from 'lucide-react';
import { useGetGalleryQuery } from '../features/gallery/galleryApi';

export const GalleryPage: React.FC = () => {
  const { data: items = [], isLoading } = useGetGalleryQuery();

  return (
    <div className="flex-1 min-w-0">
      <Header title="Gallery Manager" subtitle="Manage high-resolution photo gallery uploads and categories" />

      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-300">Total Gallery Items: {items.length}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-xs flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
              <span>Loading gallery...</span>
            </div>
          ) : items.length === 0 ? (
            <div className="col-span-full p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-500 text-xs">
              No gallery images found. Upload images in Media Library to attach.
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-3 overflow-hidden">
                {item.public_url && (
                  <img src={item.public_url} alt={item.alt_text || 'Gallery'} className="w-full h-48 object-cover rounded-xl" />
                )}
                <h4 className="text-sm font-bold text-slate-100">{item.title || 'Untitled'}</h4>
                <p className="text-xs text-slate-400">{item.caption}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
