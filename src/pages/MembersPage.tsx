import React, { useState, useEffect } from 'react';
import { Header } from '../components/layout/Header';
import {
  Plus,
  Edit2,
  Trash2,
  Mail,
  Phone,
  Loader2,
  X,
  CheckCircle2,
  AlertCircle,
  Users,
  Search,
  Image as ImageIcon,
  Upload,
} from 'lucide-react';
import { adminApi } from '../services/api';
import { MediaPickerModal } from '../components/cms/MediaPickerModal';

export interface Member {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  title: string;
  description: string | null;
  image_url: string | null;
  status: 'published' | 'draft';
  language?: 'en' | 'hi';
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export const MembersPage: React.FC<{ hideHeader?: boolean; currentLanguage?: 'en' | 'hi' }> = ({
  hideHeader = false,
  currentLanguage = 'en',
}) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [memberLanguage, setMemberLanguage] = useState<'en' | 'hi'>(currentLanguage);
  const [sortOrder, setSortOrder] = useState<number>(0);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<Member | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast alert
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getMembers(1, 100, '', currentLanguage);
      setMembers(data || []);
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch members.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [currentLanguage]);

  const openCreateModal = () => {
    setEditingMember(null);
    setName('');
    setEmail('');
    setPhone('');
    setTitle('');
    setDescription('');
    setImageUrl('');
    setStatus('published');
    setMemberLanguage(currentLanguage);
    setSortOrder(members.length + 1);
    setIsModalOpen(true);
  };

  const openEditModal = (member: Member) => {
    setEditingMember(member);
    setName(member.name || '');
    setEmail(member.email || '');
    setPhone(member.phone || '');
    setTitle(member.title || '');
    setDescription(member.description || '');
    setImageUrl(member.image_url || '');
    setStatus(member.status || 'published');
    setMemberLanguage(member.language || currentLanguage);
    setSortOrder(member.sort_order || 0);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Member name is required.', 'error');
      return;
    }
    if (!title.trim()) {
      showToast('Member title is required.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        title: title.trim(),
        description: description.trim() || undefined,
        image_url: imageUrl.trim() || undefined,
        status,
        language: memberLanguage,
        sort_order: Number(sortOrder),
      };

      if (editingMember) {
        await adminApi.updateMember(editingMember.id, payload);
        showToast(`Member '${name}' updated successfully!`);
      } else {
        await adminApi.createMember(payload);
        showToast(`Member '${name}' added successfully!`);
      }

      setIsModalOpen(false);
      fetchMembers();
    } catch (err: any) {
      showToast(err.message || 'Failed to save member.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await adminApi.deleteMember(deleteTarget.id);
      showToast(`Member '${deleteTarget.name}' deleted successfully.`);
      setDeleteTarget(null);
      fetchMembers();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete member.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredMembers = members.filter(
    (m) =>
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.title?.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase()) ||
      m.phone?.includes(search)
  );

  return (
    <div className="flex-1 min-w-0 pb-12">
      {!hideHeader && (
        <Header
          title="Members & Leadership Hub"
          subtitle="Manage NGO committee members, board directors, and dedicated team members"
        />
      )}

      <div className="px-6 md:px-8 space-y-6">
        {/* Toast Alert */}
        {toast && (
          <div
            className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border text-xs font-semibold backdrop-blur-xl transition-all duration-300 ${toast.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40 shadow-emerald-500/10'
              : 'bg-rose-950/90 text-rose-200 border-rose-500/40 shadow-rose-500/10'
              }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span>{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-2 text-slate-400 hover:text-slate-200">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Control Bar: Search & Actions */}
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-lg shadow-black/20">
          <div className="flex flex-wrap items-center gap-3">
            {/* Instant Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search member name, title, contact..."
                className="w-full bg-slate-950/80 text-slate-200 text-xs rounded-xl pl-9 pr-8 py-2 border border-slate-800 focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-slate-500"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Total Members Count Badge */}
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3.5 py-2 rounded-xl border border-emerald-500/20 shrink-0">
              <Users className="w-4 h-4" />
              <span>Total Members: {filteredMembers.length}</span>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            {/* Layout Toggle */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${viewMode === 'grid'
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-400 hover:text-slate-200'
                  }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${viewMode === 'table'
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-400 hover:text-slate-200'
                  }`}
              >
                Table
              </button>
            </div>

            {/* Add Member Button */}
            <button
              onClick={openCreateModal}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Member</span>
            </button>
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-xs flex items-center justify-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
            <span>Loading members directory...</span>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/40 rounded-3xl border border-slate-800/80 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/60 flex items-center justify-center text-slate-500 mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-200">No Members Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No society members have been added yet. Click 'Add Member' to get started.
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          /* GRID VIEW */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="bg-slate-900/80 rounded-3xl border border-slate-800/90 overflow-hidden hover:border-slate-700 transition-all duration-200 flex flex-col justify-between group shadow-lg shadow-black/20"
              >
                <div>
                  {/* Top Image Banner / Avatar */}
                  <div className="h-44 bg-slate-950 relative flex items-center justify-center overflow-hidden border-b border-slate-800/60">
                    {member.image_url ? (
                      <img
                        src={member.image_url}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          // Fallback on image error
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-2xl">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {/* Language Pill */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border backdrop-blur-md bg-slate-900/80 text-emerald-400 border-slate-700">
                        {member.language ? member.language.toUpperCase() : 'EN'}
                      </span>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="text-base font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-xs font-semibold text-emerald-400 mt-0.5">{member.title}</p>
                    </div>

                    {member.description && (
                      <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                        {member.description}
                      </p>
                    )}

                    <div className="pt-2 space-y-1.5 text-xs text-slate-400">
                      {member.email && (
                        <div className="flex items-center gap-2 truncate">
                          <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="truncate">{member.email}</span>
                        </div>
                      )}
                      {member.phone && (
                        <div className="flex items-center gap-2 truncate">
                          <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span>{member.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-end">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(member)}
                      className="p-2 rounded-xl text-slate-400 hover:text-emerald-300 hover:bg-slate-800 transition-colors"
                      title="Edit Member"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(member)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete Member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* TABLE VIEW */
          <div className="bg-slate-900/80 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-4 px-6">Member</th>
                    <th className="py-4 px-6">Title</th>
                    <th className="py-4 px-6">Contact Info</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-950 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center font-bold text-emerald-400">
                            {member.image_url ? (
                              <img
                                src={member.image_url}
                                alt={member.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              member.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-100">{member.name}</p>
                            <p className="text-[11px] text-slate-400 line-clamp-1">{member.description || 'No bio'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-medium text-emerald-400">{member.title}</td>
                      <td className="py-4 px-6 text-slate-300">
                        <div className="space-y-0.5">
                          {member.email && <div className="text-slate-300">{member.email}</div>}
                          {member.phone && <div className="text-slate-400 font-mono text-[11px]">{member.phone}</div>}
                          {!member.email && !member.phone && <span className="text-slate-600">—</span>}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(member)}
                            className="p-2 rounded-xl text-slate-400 hover:text-emerald-300 hover:bg-slate-800 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(member)}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ADD / EDIT MEMBER MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 w-full max-w-xl space-y-6 shadow-2xl my-8">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-100">
                    {editingMember ? 'Edit Society Member' : 'Add New Society Member'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Fill in member profile details for public NGO website display
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1.5">
                      Full Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Dr. Rajesh Kumar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-950 text-slate-100 rounded-xl p-3 border border-slate-800 focus:border-emerald-500/50 focus:outline-none"
                    />
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1.5">
                      Designation / Title <span className="text-rose-400">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Founder & President"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-slate-950 text-slate-100 rounded-xl p-3 border border-slate-800 focus:border-emerald-500/50 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email */}
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      placeholder="e.g. rajesh@helpamission.org"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950 text-slate-100 rounded-xl p-3 border border-slate-800 focus:border-emerald-500/50 focus:outline-none"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1.5">Phone Number</label>
                    <input
                      type="text"
                      placeholder="e.g. +91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-950 text-slate-100 rounded-xl p-3 border border-slate-800 focus:border-emerald-500/50 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">Description / Bio</label>
                  <textarea
                    rows={3}
                    placeholder="Brief intro about member's role and contributions to Help A Mission Welfare Society..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 rounded-xl p-3 border border-slate-800 focus:border-emerald-500/50 focus:outline-none resize-none"
                  />
                </div>

                {/* Member Photo (Media Library & File Upload) */}
                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">
                    Member Photo
                  </label>
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center text-emerald-400">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt="Member Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-slate-500" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-200">
                          {imageUrl ? 'Member Photo Selected' : 'No Photo Selected'}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate max-w-xs">
                          {imageUrl || 'Choose an image from media library or upload a new file'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                      {imageUrl && (
                        <button
                          type="button"
                          onClick={() => setImageUrl('')}
                          className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold rounded-xl border border-red-500/20 transition-colors cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setIsMediaPickerOpen(true)}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 w-full sm:w-auto"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{imageUrl ? 'Change Photo' : 'Select / Upload Image'}</span>
                      </button>
                    </div>
                  </div>
                </div>



                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin text-slate-950" />}
                    <span>{editingMember ? 'Save Changes' : 'Create Member'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        {deleteTarget && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-base font-bold text-slate-100">Delete Society Member</h3>
                <p className="text-xs text-slate-400">
                  Are you sure you want to delete member <strong className="text-slate-200">{deleteTarget.name}</strong>? This action will remove them from the public website listing.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Delete Member</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Media Selector Overlay Modal */}
        <MediaPickerModal
          isOpen={isMediaPickerOpen}
          onClose={() => setIsMediaPickerOpen(false)}
          onSelect={(asset) => {
            setImageUrl(asset.url);
            setIsMediaPickerOpen(false);
          }}
          onRemove={() => {
            setImageUrl('');
            setIsMediaPickerOpen(false);
          }}
          title="Select Member Profile Photo"
          targetSection="about"
          activeMediaUrl={imageUrl}
        />
      </div>
    </div>
  );
};
