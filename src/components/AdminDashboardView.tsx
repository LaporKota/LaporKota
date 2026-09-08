import React, { useMemo, useState, useEffect } from 'react';
import { User, Report } from '../types';
import { motion } from 'motion/react';
import CountUp from 'react-countup';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';

interface AdminDashboardViewProps {
  user: User;
  reports: Report[];
  onNavigateToReports: () => void;
  onOpenReport: (report: Report) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const PRIORITY_COLORS: Record<string, string> = {
  Tinggi: '#e11d48',
  Sedang: '#d97706',
  Rendah: '#0d9488',
};

interface AdminMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  domicile?: string;
  createdAt: number;
  lastActiveAt: number;
}

// User dianggap "online sekarang" kalau request terakhirnya kurang dari 2 menit lalu
const ONLINE_WINDOW_MS = 2 * 60 * 1000;
// Polling interval biar list-nya kerasa realtime tanpa perlu websocket
const MEMBERS_POLL_MS = 15 * 1000;

const formatJoinDateTime = (ts: number) => {
  if (!ts) return 'Tidak diketahui';
  return new Date(ts).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatRelativeActive = (ts: number) => {
  if (!ts) return 'Belum pernah aktif';
  const diffMs = Date.now() - ts;
  if (diffMs < 60 * 1000) return 'Baru saja';
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 60) return `${diffMin} menit lalu`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} jam lalu`;
  return formatJoinDateTime(ts);
};

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ user, reports, onNavigateToReports, onOpenReport }) => {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [members, setMembers] = useState<AdminMember[]>([]);
  const [membersLoading, setMembersLoading] = useState(true);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.totalUsers === 'number') setTotalUsers(data.totalUsers);
      })
      .catch(() => {});

    const fetchMembers = () => {
      fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data.users)) setMembers(data.users);
        })
        .catch(() => {})
        .finally(() => setMembersLoading(false));
    };

    fetchMembers();
    // Polling biar "online sekarang" & daftar anggota kerasa realtime
    const pollId = setInterval(fetchMembers, MEMBERS_POLL_MS);
    const clockId = setInterval(() => setNow(Date.now()), 15 * 1000);
    return () => {
      clearInterval(pollId);
      clearInterval(clockId);
    };
  }, []);

  const onlineMembers = useMemo(
    () => members.filter((m) => m.lastActiveAt && now - m.lastActiveAt <= ONLINE_WINDOW_MS),
    [members, now]
  );
  const allMembersSorted = useMemo(
    () => [...members].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)),
    [members]
  );

  const newReports = reports.filter(r => r.status === 'baru').length;
  const inProgress = reports.filter(r => r.status === 'diproses').length;
  const resolved = reports.filter(r => r.status === 'selesai').length;
  const totalVolunteers = reports.reduce((sum, r) => sum + (r.volunteerCount || 0), 0);

  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};
    reports.forEach(r => {
      counts[r.categoryLabel] = (counts[r.categoryLabel] || 0) + 1;
    });
    return Object.keys(counts).map(key => ({
      name: key,
      Jumlah: counts[key]
    }));
  }, [reports]);

  const priorityData = useMemo(() => {
    const counts: Record<string, number> = {};
    reports.forEach((r) => {
      const p = r.priority || 'Sedang';
      counts[p] = (counts[p] || 0) + 1;
    });
    return Object.keys(counts).map((key) => ({ name: key, value: counts[key] }));
  }, [reports]);

  // Laporan prioritas tinggi yang belum selesai — perlu perhatian segera
  const urgentReports = useMemo(() => {
    return reports
      .filter((r) => r.status !== 'selesai' && r.priority === 'Tinggi')
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
      .slice(0, 5);
  }, [reports]);

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      baru: 'bg-rose-100 text-rose-700',
      diproses: 'bg-amber-100 text-amber-700',
      selesai: 'bg-primary-100 text-primary-700',
    };
    return map[status] || 'bg-slate-100 text-slate-700';
  };

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="flex-grow w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6 sm:gap-8"
    >
      <motion.section variants={itemVariants} className="flex flex-col gap-2 border-b border-slate-200 pb-6">
        <h1 className="font-display text-3xl sm:text-4xl text-slate-900 font-bold uppercase tracking-tight">
          ADMIN DASHBOARD
        </h1>
        <p className="font-body text-base text-slate-500">
          Selamat datang, <span className="font-bold text-slate-900">{user.name}</span>. Kelola dan pantau seluruh laporan warga dari panel ini.
        </p>
      </motion.section>

      <motion.section variants={itemVariants} className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6">
        <motion.div whileHover={{ scale: 1.02 }} className="bg-rose-500 border border-slate-200 rounded-xl p-5 shadow-lg flex flex-col justify-between text-white">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-headline text-xs sm:text-sm uppercase font-bold">Laporan Baru</h3>
            <span className="material-symbols-outlined text-[24px]">report</span>
          </div>
          <div className="font-display text-3xl sm:text-4xl font-bold">
            <CountUp end={newReports} duration={2} />
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="bg-amber-500 border border-slate-200 rounded-xl p-5 shadow-lg flex flex-col justify-between text-white">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-headline text-xs sm:text-sm uppercase font-bold">Diproses</h3>
            <span className="material-symbols-outlined text-[24px]">sync</span>
          </div>
          <div className="font-display text-3xl sm:text-4xl font-bold">
            <CountUp end={inProgress} duration={2} />
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="bg-primary-600 border border-slate-200 rounded-xl p-5 shadow-lg flex flex-col justify-between text-white">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-headline text-xs sm:text-sm uppercase font-bold">Selesai</h3>
            <span className="material-symbols-outlined text-[24px]">check_circle</span>
          </div>
          <div className="font-display text-3xl sm:text-4xl font-bold">
            <CountUp end={resolved} duration={2} />
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="bg-white border border-slate-200 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-headline text-xs sm:text-sm uppercase font-bold text-slate-900">Total Relawan</h3>
            <span className="material-symbols-outlined text-[24px] text-slate-900">volunteer_activism</span>
          </div>
          <div className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
            <CountUp end={totalVolunteers} duration={2} />
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="bg-white border border-slate-200 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-headline text-xs sm:text-sm uppercase font-bold text-slate-900">Warga Terdaftar</h3>
            <span className="material-symbols-outlined text-[24px] text-slate-900">group</span>
          </div>
          <div className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
            {totalUsers === null ? '—' : <CountUp end={totalUsers} duration={2} />}
          </div>
        </motion.div>
      </motion.section>

      <motion.section variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-lg">
          <h3 className="font-headline text-xl uppercase font-bold text-slate-900 mb-6">Statistik Kategori Laporan</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="name" tick={{ fill: '#1a1a1a', fontWeight: 'bold', fontSize: 11 }} />
                <YAxis tick={{ fill: '#1a1a1a', fontWeight: 'bold' }} allowDecimals={false} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.1)' }} contentStyle={{ border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="Jumlah" fill="var(--color-primary-600)" stroke="#1a1a1a" strokeWidth={2} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-lg">
          <h3 className="font-headline text-xl uppercase font-bold text-slate-900 mb-6">Distribusi Prioritas</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={priorityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  {priorityData.map((entry, i) => (
                    <Cell key={i} fill={PRIORITY_COLORS[entry.name] || '#94a3b8'} stroke="#fff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.section>

      <motion.section variants={itemVariants} className="bg-white border border-slate-200 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-headline text-xl uppercase font-bold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-rose-500">priority_high</span>
            Perlu Perhatian Segera
          </h3>
          <span className="text-xs font-label text-slate-500">Prioritas Tinggi • Belum Selesai</span>
        </div>

        {urgentReports.length === 0 ? (
          <p className="font-body text-sm text-slate-400 py-6 text-center">
            Tidak ada laporan prioritas tinggi yang perlu segera ditindaklanjuti. 🎉
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-slate-100">
            {urgentReports.map((r) => (
              <button
                key={r.id}
                onClick={() => onOpenReport(r)}
                className="flex items-center justify-between gap-4 py-3 text-left hover:bg-slate-50 px-2 -mx-2 rounded-lg transition-colors"
              >
                <div className="min-w-0">
                  <p className="font-label text-sm font-bold text-slate-900 truncate">{r.title}</p>
                  <p className="text-xs text-slate-500 truncate">{r.location}</p>
                </div>
                <span className={`shrink-0 px-2 py-1 rounded-full text-[10px] font-bold uppercase ${statusBadge(r.status)}`}>
                  {r.status}
                </span>
              </button>
            ))}
          </div>
        )}
      </motion.section>

      <motion.section variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline text-xl uppercase font-bold text-slate-900 flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              Online Sekarang
            </h3>
            <span className="text-xs font-label text-slate-500">Total {onlineMembers.length}</span>
          </div>
          {membersLoading ? (
            <p className="font-body text-sm text-slate-400 py-6 text-center">Memuat data anggota...</p>
          ) : onlineMembers.length === 0 ? (
            <p className="font-body text-sm text-slate-400 py-6 text-center">
              Tidak ada anggota yang sedang online saat ini.
            </p>
          ) : (
            <div className="flex flex-col divide-y divide-slate-100 max-h-[320px] overflow-y-auto">
              {onlineMembers.map((m) => (
                <div key={m.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0 flex items-center gap-2">
                    <span className="shrink-0 h-2 w-2 rounded-full bg-green-500" />
                    <div className="min-w-0">
                      <p className="font-label text-sm font-bold text-slate-900 truncate">{m.name}</p>
                      <p className="text-xs text-slate-500 truncate">{m.email}</p>
                    </div>
                  </div>
                  <span className="shrink-0 text-[11px] font-bold text-green-600">{formatRelativeActive(m.lastActiveAt)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline text-xl uppercase font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-900">group</span>
              Semua Anggota
            </h3>
            <span className="text-xs font-label text-slate-500">Total {allMembersSorted.length}</span>
          </div>
          {membersLoading ? (
            <p className="font-body text-sm text-slate-400 py-6 text-center">Memuat data anggota...</p>
          ) : allMembersSorted.length === 0 ? (
            <p className="font-body text-sm text-slate-400 py-6 text-center">Belum ada anggota terdaftar.</p>
          ) : (
            <div className="flex flex-col divide-y divide-slate-100 max-h-[320px] overflow-y-auto">
              {allMembersSorted.map((m) => (
                <div key={m.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="font-label text-sm font-bold text-slate-900 truncate">{m.name}</p>
                    <p className="text-xs text-slate-500 truncate">{m.email}</p>
                  </div>
                  <span className="shrink-0 text-[11px] font-bold text-slate-500 text-right">
                    Daftar: {formatJoinDateTime(m.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.section>

      <motion.section variants={itemVariants} className="mt-2">
        <button
          onClick={onNavigateToReports}
          className="bg-white text-slate-800 hover:bg-slate-50 border border-slate-200 rounded-xl px-6 py-4 font-headline text-lg uppercase font-bold shadow-md active:scale-95 transition-all w-full md:w-auto flex items-center justify-center gap-2"
        >
          <span>Kelola Semua Laporan</span>
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </motion.section>
    </motion.div>
  );
};
