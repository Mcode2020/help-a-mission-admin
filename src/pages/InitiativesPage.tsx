import React, { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Plus } from 'lucide-react';
import { adminApi } from '../services/api';
import type { Initiative } from '../types';

export const InitiativesPage: React.FC = () => {
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [body, setBody] = useState('');

  const loadData = async () => {
    try {
      const res = await adminApi.getInitiatives();
      setInitiatives(res || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.createInitiative({
        title,
        slug,
        summary,
        body,
        status: 'published',
      });
      setIsModalOpen(false);
      setTitle('');
      setSlug('');
      setSummary('');
      setBody('');
      loadData();
    } catch (err: any) {
      alert(`Error creating initiative: ${err.message}`);
    }
  };

  return (
    <div className="flex-1 min-w-0">
      <Header title="Our Work & Initiatives Manager" subtitle="Manage NGO projects, healthcare campaigns and community drives" />

      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-300">Total Initiatives: {initiatives.length}</span>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Initiative</span>
          </button>
        </div>

        {/* Initiatives List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initiatives.length === 0 ? (
            <div className="col-span-full p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-500 text-xs">
              No initiatives found. Click 'New Initiative' to add one.
            </div>
          ) : (
            initiatives.map((item) => (
              <div key={item.id} className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-3">
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {item.status}
                </span>
                <h3 className="text-base font-bold text-slate-100">{item.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{item.summary}</p>
                <div className="text-[11px] font-mono text-slate-500">slug: {item.slug}</div>
              </div>
            ))
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg space-y-4">
              <h3 className="text-lg font-bold text-slate-100">Create New Initiative</h3>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Title</label>
                  <input
                    required
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }}
                    className="w-full bg-slate-950 text-slate-100 text-xs rounded-xl p-3 border border-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Slug</label>
                  <input
                    required
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 text-xs rounded-xl p-3 border border-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Short Summary</label>
                  <input
                    required
                    type="text"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 text-xs rounded-xl p-3 border border-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Description</label>
                  <textarea
                    required
                    rows={4}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 text-xs rounded-xl p-3 border border-slate-800"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300"
                  >
                    Publish Initiative
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
