import React from 'react';
import { Report, User } from '../types';
import { Award } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  reports: Report[];
  onSelectReport: (report: Report) => void;
  user: User | null;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  reports,
  onSelectReport,
  user
}) => {
  if (!isOpen || !user) return null;

  // Real logic based on user interaction
  const reportsCreated = reports.filter((r) => r.userId === user.id);
  const reportsUpvoted = reports.filter((r) => r.upvotedBy?.includes(user.id));
  const reportsResolved = reportsCreated.filter((r) => r.status === 'selesai');

  // Combine and deduplicate myReports for the recent list
  const myReportsSet = new Set([...reportsCreated, ...reportsUpvoted]);
  const myReports = Array.from(myReportsSet).sort((a, b) => b.timestamp - a.timestamp);

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px] text-slate-900">account_circle</span>
            <h3 className="font-headline text-lg font-semibold tracking-tight">
              PROFIL WARGA &amp; REPUTASI CIVIC
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 bg-white border border-slate-200 rounded-lg font-bold text-sm flex items-center justify-center hover:bg-rose-500 hover:text-white shadow-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Profile Card Summary */}
        <div className="p-5 overflow-y-auto flex flex-col gap-5">
          <div className="bg-primary-600 border border-slate-200 rounded-xl p-4 shadow-md flex items-center gap-4">
            <div className="w-14 h-14 bg-white border border-slate-200 rounded-lg flex items-center justify-center font-headline text-2xl font-bold shrink-0">
              {getInitials(user.name)}
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-headline text-lg font-semibold truncate">{user.name}</h4>
                <span className="bg-primary-600 text-white text-[10px] font-bold uppercase px-1.5 py-0.5 border border-slate-200">
                  Verified {user.role === 'admin' ? 'Admin' : 'Warga'}
                </span>
              </div>
              <p className="font-body text-xs text-slate-900 mt-0.5 truncate">
                Domisili: {user.domicile || 'Belum diisi'}
              </p>
              {reportsResolved.length > 0 && (
                <div className="inline-flex items-center gap-1 mt-1 bg-white border border-slate-200 px-2 py-0.5 font-label text-[10px] font-medium">
                  <Award size={12} /> SDG 11 Civic Champion
                </div>
              )}
            </div>
          </div>

          {/* Stats Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white border border-slate-200 rounded-lg p-3 text-center shadow-sm">
              <span className="font-label text-[10px] font-medium text-slate-500">Dibuat</span>
              <div className="font-headline text-2xl font-bold text-slate-900">
                {reportsCreated.length}
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-3 text-center shadow-sm">
              <span className="font-label text-[10px] font-medium text-slate-500">Didukung</span>
              <div className="font-headline text-2xl font-bold text-primary-600">
                {reportsUpvoted.length}
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-3 text-center shadow-sm">
              <span className="font-label text-[10px] font-medium text-slate-500">Tuntas</span>
              <div className="font-headline text-2xl font-bold text-green-600">
                {reportsResolved.length}
              </div>
            </div>
          </div>

          {/* My Active Reports & Contributions */}
          <div className="flex flex-col gap-2">
            <h5 className="font-headline text-sm font-semibold border-b border-slate-200 pb-1">
              LAPORAN &amp; DUKUNGAN TERKINI
            </h5>
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
              {myReports.length === 0 ? (
                <div className="text-center p-4 font-body text-sm text-slate-500 bg-white border border-slate-200 rounded-lg border-dashed">
                  Belum ada laporan atau dukungan saat ini.
                </div>
              ) : (
                myReports.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => {
                      onSelectReport(r);
                      onClose();
                    }}
                    className="p-2.5 border border-slate-200 rounded-lg bg-white hover:bg-rose-50 transition-colors cursor-pointer flex justify-between items-center text-xs"
                  >
                    <div className="truncate pr-2">
                      <div className="font-label font-bold text-slate-900 truncate">{r.title}</div>
                      <div className="font-body text-[11px] text-slate-500 truncate">
                        {r.location} {r.userId === user.id ? '(Pelapor)' : '(Didukung)'}
                      </div>
                    </div>
                    <span
                      className={`shrink-0 px-2 py-0.5 font-bold uppercase text-[10px] border border-slate-200 ${
                        r.status === 'baru'
                          ? 'bg-primary-600 text-white'
                          : r.status === 'diproses'
                          ? 'bg-primary-600 text-white'
                          : 'bg-green-600 text-white'
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
