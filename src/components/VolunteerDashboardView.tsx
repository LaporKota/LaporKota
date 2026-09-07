import React, { useEffect, useMemo, useState } from 'react';
import { Report, User } from '../types';

interface VolunteerDashboardViewProps {
  user: User;
  reports: Report[];
  onSelectReport: (report: Report) => void;
  onNavigateToReports: () => void;
}

const getCategoryIcon = (category: Report['category']) => {
  switch (category) {
    case 'kebersihan':
      return 'delete';
    case 'penerangan':
      return 'lightbulb';
    case 'infrastruktur':
      return 'construction';
    case 'drainase':
      return 'water_drop';
    case 'ruang_hijau':
      return 'park';
    case 'fasilitas':
      return 'directions_walk';
    default:
      return 'report';
  }
};

const StatusBadge: React.FC<{ status: Report['status'] }> = ({ status }) => {
  if (status === 'selesai') {
    return (
      <span className="bg-green-600 text-white border border-slate-200 px-2 py-0.5 font-label text-[10px] font-medium">
        Selesai
      </span>
    );
  }
  if (status === 'diproses') {
    return (
      <span className="bg-primary-600 text-white border border-slate-200 px-2 py-0.5 font-label text-[10px] font-medium">
        Diproses
      </span>
    );
  }
  return (
    <span className="bg-primary-600 text-white border border-slate-200 px-2 py-0.5 font-label text-[10px] font-medium">
      Baru
    </span>
  );
};

interface AdminMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  domicile?: string;
  createdAt: number;
}

// Anggota yang daftar dalam 7 hari terakhir dianggap "baru daftar"
const NEW_MEMBER_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

const formatJoinDate = (ts: number) => {
  if (!ts) return 'Tidak diketahui';
  return new Date(ts).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};

// Section daftar anggota — cuma dirender & di-fetch kalau yang login adalah admin
const AdminMembersSection: React.FC = () => {
  const [members, setMembers] = useState<AdminMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.users)) setMembers(data.users);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const now = Date.now();
  const newMembers = useMemo(
    () => members.filter((m) => m.createdAt && now - m.createdAt <= NEW_MEMBER_WINDOW_MS),
    [members]
  );
  const existingMembers = useMemo(
    () => members.filter((m) => !m.createdAt || now - m.createdAt > NEW_MEMBER_WINDOW_MS),
    [members]
  );

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-headline text-lg font-bold text-slate-900 uppercase border-b-2 border-slate-200 pb-2">
        Anggota (Khusus Admin)
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-headline text-sm font-bold text-slate-900 uppercase flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-600 text-[18px]">person_add</span>
              Baru Mendaftar
            </h3>
            <span className="text-[11px] font-label text-slate-500">7 hari terakhir</span>
          </div>
          {loading ? (
            <p className="font-body text-sm text-slate-400 py-4 text-center">Memuat data anggota...</p>
          ) : newMembers.length === 0 ? (
            <p className="font-body text-sm text-slate-400 py-4 text-center">
              Belum ada anggota baru dalam 7 hari terakhir.
            </p>
          ) : (
            <div className="flex flex-col divide-y divide-slate-100 max-h-[280px] overflow-y-auto">
              {newMembers.map((m) => (
                <div key={m.id} className="flex items-center justify-between gap-4 py-2.5">
                  <div className="min-w-0">
                    <p className="font-label text-sm font-bold text-slate-900 truncate">{m.name}</p>
                    <p className="text-xs text-slate-500 truncate">{m.email}</p>
                  </div>
                  <span className="shrink-0 text-[11px] font-bold text-slate-500">{formatJoinDate(m.createdAt)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-headline text-sm font-bold text-slate-900 uppercase flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-900 text-[18px]">group</span>
              Sudah Terdaftar
            </h3>
            <span className="text-[11px] font-label text-slate-500">Total {existingMembers.length}</span>
          </div>
          {loading ? (
            <p className="font-body text-sm text-slate-400 py-4 text-center">Memuat data anggota...</p>
          ) : existingMembers.length === 0 ? (
            <p className="font-body text-sm text-slate-400 py-4 text-center">Belum ada anggota lama.</p>
          ) : (
            <div className="flex flex-col divide-y divide-slate-100 max-h-[280px] overflow-y-auto">
              {existingMembers.map((m) => (
                <div key={m.id} className="flex items-center justify-between gap-4 py-2.5">
                  <div className="min-w-0">
                    <p className="font-label text-sm font-bold text-slate-900 truncate">{m.name}</p>
                    <p className="text-xs text-slate-500 truncate">{m.email}</p>
                  </div>
                  <span className="shrink-0 text-[11px] font-bold text-slate-500">{formatJoinDate(m.createdAt)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const VolunteerDashboardView: React.FC<VolunteerDashboardViewProps> = ({
  user,
  reports,
  onSelectReport,
  onNavigateToReports,
}) => {
  const myVolunteeredReports = reports.filter((r) => (r.volunteeredBy || []).includes(user.id));
  const totalSelesai = myVolunteeredReports.filter((r) => r.status === 'selesai').length;
  const totalBerjalan = myVolunteeredReports.filter((r) => r.status !== 'selesai').length;

  return (
    <div className="flex-grow w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <span className="font-label text-xs font-bold text-primary-600 uppercase tracking-wider">
          {user.role === 'admin' ? 'Ruang Admin' : 'Ruang Relawan'}
        </span>
        <h1 className="font-headline text-2xl sm:text-3xl font-bold text-slate-900 uppercase">
          {user.role === 'admin' ? 'Dashboard Relawan & Anggota' : 'Dashboard Relawan Saya'}
        </h1>
        <p className="font-body text-sm text-slate-500 max-w-2xl">
          {user.role === 'admin'
            ? `Pantau anggota yang terdaftar dan aksi gotong royong yang berjalan lewat LaporKota, ${user.name}.`
            : `Rekap semua aksi gotong royong yang sudah kamu ikuti lewat LaporKota, ${user.name}. Terima kasih sudah jadi bagian dari perubahan nyata di kota ini!`}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-primary-600 text-white border border-slate-200 rounded-xl p-5 shadow-md flex flex-col gap-1">
          <span className="font-label text-xs uppercase tracking-wider opacity-90">Total Aksi Diikuti</span>
          <span className="font-headline text-3xl font-bold">{myVolunteeredReports.length}</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col gap-1">
          <span className="font-label text-xs uppercase tracking-wider text-slate-500">Masih Berjalan</span>
          <span className="font-headline text-3xl font-bold text-slate-900">{totalBerjalan}</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col gap-1">
          <span className="font-label text-xs uppercase tracking-wider text-slate-500">Sudah Tuntas</span>
          <span className="font-headline text-3xl font-bold text-green-600">{totalSelesai}</span>
        </div>
      </div>

      {/* Anggota — khusus admin */}
      {user.role === 'admin' && <AdminMembersSection />}

      {/* List Aksi Relawan */}
      <div className="flex flex-col gap-4">
        <h2 className="font-headline text-lg font-bold text-slate-900 uppercase border-b-2 border-slate-200 pb-2">
          Aksi yang Saya Ikuti
        </h2>

        {myVolunteeredReports.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 sm:p-12 flex flex-col items-center text-center gap-3 shadow-sm">
            <span className="material-symbols-outlined text-[40px] text-slate-300">volunteer_activism</span>
            <h3 className="font-headline text-base font-bold text-slate-900 uppercase">
              Belum Ada Aksi Relawan
            </h3>
            <p className="font-body text-sm text-slate-500 max-w-md">
              Kamu belum pernah ikut aksi relawan gotong royong. Yuk jelajahi laporan warga di sekitarmu dan mulai
              bantu bersihkan kota!
            </p>
            <button
              onClick={onNavigateToReports}
              className="mt-2 bg-primary-600 text-white border border-slate-200 rounded-lg px-5 py-2.5 font-label text-sm font-bold uppercase shadow-md hover:bg-primary-700 transition-all cursor-pointer"
            >
              Jelajahi Laporan
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {myVolunteeredReports.map((report) => (
              <button
                key={report.id}
                onClick={() => onSelectReport(report)}
                className="text-left bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col"
              >
                <div className="relative h-36 w-full overflow-hidden">
                  <img src={report.imageUrl} alt={report.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 bg-white/95 border border-slate-200 rounded-lg px-2 py-1 flex items-center gap-1 shadow-sm">
                    <span className="material-symbols-outlined text-[14px] text-primary-600">
                      {getCategoryIcon(report.category)}
                    </span>
                    <span className="font-label text-[10px] font-bold text-slate-900 uppercase">
                      {report.categoryLabel}
                    </span>
                  </div>
                </div>
                <div className="p-4 flex flex-col gap-2 flex-grow">
                  <h3 className="font-headline text-sm font-bold text-slate-900 uppercase line-clamp-2">
                    {report.title}
                  </h3>
                  <div className="flex items-center gap-1 text-slate-500">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    <span className="font-body text-xs truncate">{report.location}</span>
                  </div>
                  <div className="mt-auto pt-2 border-t border-slate-100 flex items-center justify-between">
                    <StatusBadge status={report.status} />
                    <span className="flex items-center gap-1 font-label text-[11px] font-bold text-slate-500">
                      <span className="material-symbols-outlined text-[14px]">groups</span>
                      {report.volunteerCount || 0} Relawan
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
