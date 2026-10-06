import React, { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Plus, KeyRound } from 'lucide-react';
import { adminApi } from '../services/api';
import type { Role, Permission } from '../types';

export const RbacPage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [key, setKey] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);

  const loadData = async () => {
    try {
      const [rolesData, permsData] = await Promise.all([
        adminApi.getRoles(),
        adminApi.getPermissions(),
      ]);
      setRoles(rolesData.roles || []);
      setPermissions(permsData.permissions || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.createRole({
        key,
        name,
        description,
        permissionKeys: selectedPerms,
      });
      setIsModalOpen(false);
      setKey('');
      setName('');
      setDescription('');
      setSelectedPerms([]);
      loadData();
    } catch (err: any) {
      alert(`Error creating role: ${err.message}`);
    }
  };

  const togglePerm = (permKey: string) => {
    if (selectedPerms.includes(permKey)) {
      setSelectedPerms(selectedPerms.filter((p) => p !== permKey));
    } else {
      setSelectedPerms([...selectedPerms, permKey]);
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
          {roles.map((role) => (
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
          ))}
        </div>

        {/* Permissions Registry */}
        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <KeyRound className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-slate-100">Authoritative Permission Registry</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {permissions.map((perm) => (
              <div key={perm.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
                <div className="font-mono font-semibold text-emerald-400">{perm.key}</div>
                <div className="text-[11px] text-slate-400">{perm.description}</div>
              </div>
            ))}
          </div>
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
                      <label key={p.key} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedPerms.includes(p.key)}
                          onChange={() => togglePerm(p.key)}
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
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300"
                  >
                    Save Role
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
