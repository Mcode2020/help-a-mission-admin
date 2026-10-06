import React, { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { HeartHandshake, Search } from 'lucide-react';
import { adminApi } from '../services/api';
import type { Donation } from '../types';

export const DonationsPage: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDonations = async () => {
      try {
        const data = await adminApi.getDonations(1, 50);
        setDonations(data.data || []);
      } catch (err) {
        console.error('Failed to load donations:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadDonations();
  }, []);

  const formatRupees = (paise: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(paise / 100);
  };

  const filteredDonations = donations.filter(
    (d) =>
      (d.razorpay_order_id && d.razorpay_order_id.toLowerCase().includes(search.toLowerCase())) ||
      (d.razorpay_payment_id && d.razorpay_payment_id.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex-1 min-w-0">
      <Header title="Donation Transactions" subtitle="Razorpay order references, payment statuses and integer minor unit conversions" />

      <div className="p-8 space-y-6">
        {/* Search & Filter Header Bar */}
        <div className="flex items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
          <div className="relative w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Order or Payment ID..."
              className="w-full bg-slate-950/80 text-slate-200 text-xs rounded-xl pl-9 pr-4 py-2 border border-slate-800 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
            <HeartHandshake className="w-4 h-4" />
            <span>Total Records: {donations.length}</span>
          </div>
        </div>

        {/* Donations Table */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-6 py-4">Donation ID</th>
                  <th className="px-6 py-4">Amount (INR)</th>
                  <th className="px-6 py-4">Provider References</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading donation records...</td>
                  </tr>
                ) : filteredDonations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No donation records found.</td>
                  </tr>
                ) : (
                  filteredDonations.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4 font-mono text-[11px] text-slate-400">{item.id.slice(0, 13)}...</td>
                      <td className="px-6 py-4 font-bold text-slate-100 text-sm">
                        {formatRupees(item.amount_minor)}
                      </td>
                      <td className="px-6 py-4 space-y-1 font-mono text-[11px]">
                        {item.razorpay_order_id && (
                          <div className="text-slate-300">order: {item.razorpay_order_id}</div>
                        )}
                        {item.razorpay_payment_id && (
                          <div className="text-emerald-400">pay: {item.razorpay_payment_id}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border ${
                          item.status === 'captured'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 font-mono text-[11px]">
                        {new Date(item.created_at).toLocaleString()}
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
