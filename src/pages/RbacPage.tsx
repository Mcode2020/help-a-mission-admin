import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Plus, KeyRound, Loader2 } from 'lucide-react';
import { useGetRolesQuery, useGetPermissionsQuery, useCreateRoleMutation } from '../features/users/usersApi';

export const RbacPage: React.FC = () => {
  const { data: rolesData, isLoading: isLoadingRoles } = useGetRolesQuery();
  const { data: permsData, isLoading: isLoadingPerms } = useGetPermissionsQuery();
  const [createRole, { isLoading: isCreatingRole }] = useCreateRoleMutation();

  const roles = rolesData?.roles || [];
  const permissions = permsData?.permissions || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [key, setKey] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createRole({
        key,
        name,
        description,
        permissionIds: selectedPerms,
      }).unwrap();
      setIsModalOpen(false);
      setKey('');
      setName('');
      setDescription('');
      setSelectedPerms([]);
    } catch (err: any) {
      alert(`Error creating role: ${err.data?.message || err.message}`);
    }
  };

  const togglePerm = (permId: string) => {
    if (selectedPerms.includes(permId)) {
      setSelectedPerms(selectedPerms.filter((p) => p !== permId));
    } else {
      setSelectedPerms([...selectedPerms, permId]);
    }
  };

  return (
    <div className="flex-1 min-w-0">
      <Header title="Dynamic RBAC Roles & Permissions" subtitle="Manage PostgreSQL permission bundles, dynamic roles and access enforcement" />

      <div className="p-8 space-y-8">
        <div className="flex items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-300">Active Roles: {roles.length} | Available Permissions: {permissions.length}</span>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Custom Role</span>
          </button>
        </div>

        {/* Roles List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoadingRoles ? (
            <div className="col-span-full p-8 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
              <span>Loading roles...</span>
            </div>
          ) : (
            roles.map((role) => (
              <div key={role.id} className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-emerald-400 font-semibold">{role.key}</span>
                  {role.is_system && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      System Role
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-slate-100">{role.name}</h3>
                <p className="text-xs text-slate-400">{role.description}</p>
              </div>
            ))
          )}
        </div>

        {/* Permissions Registry */}
        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <KeyRound className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-slate-100">Authoritative Permission Registry</h3>
          </div>
          {isLoadingPerms ? (
            <div className="p-8 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
              <span>Loading permissions...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {permissions.map((perm) => (
                <div key={perm.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
                  <div className="font-mono font-semibold text-emerald-400">{perm.key}</div>
                  <div className="text-[11px] text-slate-400">{perm.description}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-bold text-slate-100">Create Custom Role</h3>
              <form onSubmit={handleCreateRole} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Role Key</label>
                  <input
                    required
                    type="text"
                    value={key}
                    onChange={(e) => setKey(e.target.value.toLowerCase().replace(/[^a-z0-9_]+/g, '_'))}
                    placeholder="moderator_role"
                    className="w-full bg-slate-950 text-slate-100 text-xs rounded-xl p-3 border border-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Display Name</label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Moderator"
                    className="w-full bg-slate-950 text-slate-100 text-xs rounded-xl p-3 border border-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Role description..."
                    className="w-full bg-slate-950 text-slate-100 text-xs rounded-xl p-3 border border-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Assign Permissions</label>
                  <div className="space-y-2 max-h-48 overflow-y-auto p-2 bg-slate-950 rounded-xl border border-slate-800">
                    {permissions.map((p) => (
                      <label key={p.id} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedPerms.includes(p.id)}
                          onChange={() => togglePerm(p.id)}
                          className="rounded border-slate-800 text-emerald-500 focus:ring-emerald-500/20"
                        />
                        <span className="font-mono text-emerald-400">{p.key}</span>
                      </label>
                    ))}
                  </div>
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
                    disabled={isCreatingRole}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isCreatingRole && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{isCreatingRole ? 'Saving...' : 'Save Role'}</span>
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
