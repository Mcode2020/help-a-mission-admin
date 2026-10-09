import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Search, Mail, Phone, UserCheck, Loader2 } from 'lucide-react';
import { useGetDonorsQuery } from '../features/donations/donationsApi';
import type { Donor } from '../types';

export const DonorsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const { data: donorsData, isLoading } = useGetDonorsQuery({ page: 1, limit: 50 });

  const donors: Donor[] = donorsData?.data || [];

  const filteredDonors = donors.filter(
    (d) =>
      d.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 min-w-0">
      <Header title="Donors Management" subtitle="Manage NGO donor profiles, accounts and acquisition channels" />

      <div className="p-8 space-y-6">
        {/* Search & Filter Header Bar */}
        <div className="flex items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
          <div className="relative w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search donor name or email..."
              className="w-full bg-slate-950/80 text-slate-200 text-xs rounded-xl pl-9 pr-4 py-2 border border-slate-800 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
            <UserCheck className="w-4 h-4" />
            <span>Total Donors: {donors.length}</span>
          </div>
        </div>

        {/* Donors Table */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-6 py-4">Donor Name</th>
                  <th className="px-6 py-4">Contact Info</th>
                  <th className="px-6 py-4">Source</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Registered At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                        <span>Loading donor database...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredDonors.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No donor records found matching search.</td>
                  </tr>
                ) : (
                  filteredDonors.map((donor) => (
                    <tr key={donor.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-100">{donor.name}</td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-slate-300">
                            <Mail className="w-3.5 h-3.5 text-slate-500" />
                            <span>{donor.email}</span>
                          </div>
                          {donor.phone && (
                            <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                              <Phone className="w-3.5 h-3.5 text-slate-500" />
                              <span>{donor.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                          {donor.created_source}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {donor.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 font-mono text-[11px]">
                        {donor.created_at ? new Date(donor.created_at).toLocaleDateString() : ''}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
