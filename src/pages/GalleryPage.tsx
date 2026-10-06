import React, { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { adminApi } from '../services/api';
import type { GalleryItem } from '../types';

export const GalleryPage: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const res = await adminApi.getGallery();
        setItems(res || []);
      } catch (err) {
        console.error(err);
      }
    };
    loadGallery();
  }, []);

  return (
    <div className="flex-1 min-w-0">
      <Header title="Gallery Manager" subtitle="Manage high-resolution photo gallery uploads and categories" />

      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-300">Total Gallery Items: {items.length}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.length === 0 ? (
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
