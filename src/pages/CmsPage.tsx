import React, { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Save, CheckCircle2, Layout, Sliders } from 'lucide-react';
import { adminApi } from '../services/api';

export const CmsPage: React.FC = () => {
  const [eyebrow, setEyebrow] = useState('Empowering Communities Across India');
  const [heading, setHeading] = useState('Help A Mission Welfare Society');
  const [aboutHeading, setAboutHeading] = useState('Serving humanity with dignity and transparency');
  const [aboutBody, setAboutBody] = useState('Established to bridge healthcare gaps and support community empowerment.');
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const loadCms = async () => {
      try {
        const data = await adminApi.getCmsPage('home');
        if (data && data.sections) {
          const heroSec = data.sections.find((s: any) => s.section_key === 'hero');
          if (heroSec && heroSec.content_json) {
            const content = typeof heroSec.content_json === 'string' ? JSON.parse(heroSec.content_json) : heroSec.content_json;
            if (content.eyebrow) setEyebrow(content.eyebrow);
            if (content.heading) setHeading(content.heading);
          }
        }
      } catch (err) {
        console.error('Failed to load CMS:', err);
      }
    };
    loadCms();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSuccessMsg('');
    try {
      await adminApi.updateCmsSections('home', [
        {
          sectionKey: 'hero',
          sectionType: 'hero',
          sortOrder: 1,
          contentJson: { eyebrow, heading },
        },
        {
          sectionKey: 'about',
          sectionType: 'about',
          sortOrder: 2,
          contentJson: { heading: aboutHeading, description: aboutBody },
        },
      ]);
      setSuccessMsg('Homepage CMS sections saved & published successfully!');
    } catch (err: any) {
      alert(`Failed to save CMS: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 min-w-0">
      <Header title="Homepage CMS Section Manager" subtitle="Manage dynamic reusable homepage sections, text copy and CTA settings" />

      <div className="p-8 space-y-6">
        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Publishing...' : 'Save & Publish Sections'}</span>
          </button>
        </div>

        {/* Hero Section Form */}
        <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <Layout className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-slate-100">Hero Section Settings</h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Eyebrow Text</label>
              <input
                type="text"
                value={eyebrow}
                onChange={(e) => setEyebrow(e.target.value)}
                className="w-full bg-slate-950/80 text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-slate-800 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Main Heading</label>
              <input
                type="text"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                className="w-full bg-slate-950/80 text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-slate-800 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>
        </div>

        {/* About Section Form */}
        <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <Sliders className="w-5 h-5 text-teal-400" />
            <h3 className="text-base font-bold text-slate-100">About Section Settings</h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Section Heading</label>
              <input
                type="text"
                value={aboutHeading}
                onChange={(e) => setAboutHeading(e.target.value)}
                className="w-full bg-slate-950/80 text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-slate-800 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Body Description</label>
              <textarea
                rows={3}
                value={aboutBody}
                onChange={(e) => setAboutBody(e.target.value)}
                className="w-full bg-slate-950/80 text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-slate-800 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
