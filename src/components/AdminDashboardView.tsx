import React, { useMemo } from 'react';
import { User, Report } from '../types';
import { motion } from 'motion/react';
import CountUp from 'react-countup';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface AdminDashboardViewProps {
  user: User;
  reports: Report[];
  onNavigateToReports: () => void;
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

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ user, reports, onNavigateToReports }) => {
  const newReports = reports.filter(r => r.status === 'baru').length;
  const inProgress = reports.filter(r => r.status === 'diproses').length;
  const resolved = reports.filter(r => r.status === 'selesai').length;

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

      <motion.section variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div whileHover={{ scale: 1.02 }} className="bg-primary-600 border border-slate-200 rounded-xl p-6 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline text-lg uppercase font-bold text-slate-900">Laporan Baru</h3>
            <span className="material-symbols-outlined text-[32px] text-slate-900">report</span>
          </div>
          <div className="font-display text-5xl font-bold text-slate-900">
            <CountUp end={newReports} duration={2} />
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="bg-primary-600 border border-slate-200 rounded-xl p-6 shadow-lg flex flex-col justify-between text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline text-lg uppercase font-bold">Diproses</h3>
            <span className="material-symbols-outlined text-[32px]">sync</span>
          </div>
          <div className="font-display text-5xl font-bold">
            <CountUp end={inProgress} duration={2} />
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="bg-primary-600 border border-slate-200 rounded-xl p-6 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline text-lg uppercase font-bold text-slate-900">Selesai</h3>
            <span className="material-symbols-outlined text-[32px] text-slate-900">check_circle</span>
          </div>
          <div className="font-display text-5xl font-bold text-slate-900">
            <CountUp end={resolved} duration={2} />
          </div>
        </motion.div>
      </motion.section>

      <motion.section variants={itemVariants} className="bg-white border border-slate-200 rounded-xl p-6 shadow-lg mt-4">
        <h3 className="font-headline text-xl uppercase font-bold text-slate-900 mb-6">Statistik Kategori Laporan</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="name" tick={{ fill: '#1a1a1a', fontWeight: 'bold' }} />
              <YAxis tick={{ fill: '#1a1a1a', fontWeight: 'bold' }} />
              <Tooltip cursor={{ fill: 'rgba(0,0,0,0.1)' }} contentStyle={{ border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="Jumlah" fill="var(--color-primary-600)" stroke="#1a1a1a" strokeWidth={2} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.section>

      <motion.section variants={itemVariants} className="mt-4">
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
