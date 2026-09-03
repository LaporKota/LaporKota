import React, { useState } from 'react';
import { Report } from '../types';
import { CITY_STATS } from '../data/initialReports';

interface ExploreViewProps {
  reports: Report[];
  onSelectReport: (report: Report) => void;
  onToggleUpvote: (reportId: string, e: React.MouseEvent) => void;
  onNavigateToMap: () => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  reports,
  onSelectReport,
  onToggleUpvote,
  onNavigateToMap,
}) => {
  const [selectedCity, setSelectedCity] = useState<string>('all');

  const filteredReports = reports.filter((r) => {
    if (selectedCity !== 'all' && r.city !== selectedCity) return false;
    return true;
  });

  const trendingReports = [...filteredReports].sort((a, b) => b.upvotes - a.upvotes).slice(0, 4);

  const totalReportsCount = reports.length;
  const resolvedCount = reports.filter((r) => r.status === 'selesai').length;
  const inProgressCount = reports.filter((r) => r.status === 'diproses').length;
  const resolutionPercentage = Math.round((resolvedCount / (totalReportsCount || 1)) * 100);

  return (
    <div className="flex-grow w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
      {/* Header Section */}
      <section className="flex flex-col gap-2 border-b border-slate-200 pb-6">
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-slate-900 font-bold uppercase tracking-tight">
              EKSPLORASI KOTA &amp; TREN ISU
            </h1>
            <p className="font-body text-base sm:text-lg text-slate-500 max-w-3xl mt-1">
              Pantau dinamika kelayakan kota, isu paling mendesak yang membutuhkan perhatian pemerintah, serta data respon publik.
            </p>
          </div>
          <button
            onClick={onNavigateToMap}
            className="self-start md:self-auto bg-primary-600 text-white border border-slate-200 rounded-xl px-5 py-2.5 font-label text-sm font-medium shadow-md hover:bg-primary-700 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">map</span>
            Buka Peta Interaktif
          </button>
        </div>
      </section>

      {/* Metric Cards (Neo-Brutalist Bauhaus Blocks) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Total Reports */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-md hover:shadow-lg flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="font-label text-xs font-medium text-slate-500">TOTAL LAPORAN MASUK</span>
            <div className="w-8 h-8 bg-primary-600 border border-slate-200 rounded-lg flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[18px]">description</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="font-headline text-4xl font-bold text-slate-900">4,860+</div>
            <p className="font-body text-xs text-slate-500 mt-1 font-semibold">Tercatat di 5 kota metropolitan</p>
          </div>
        </div>

        {/* Card 2: Resolution Rate */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-md hover:shadow-lg flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="font-label text-xs font-medium text-slate-500">TINGKAT PENYELESAIAN</span>
            <div className="w-8 h-8 bg-primary-600 border border-slate-200 rounded-lg flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[18px] text-white">task_alt</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="font-headline text-4xl font-bold text-slate-900">83.4%</div>
            <p className="font-body text-xs text-slate-500 mt-1 font-semibold">Isu tuntas ditangani dinas terkait</p>
          </div>
        </div>

        {/* Card 3: In Progress */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-md hover:shadow-lg flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="font-label text-xs font-medium text-slate-500">DALAM PENANGANAN</span>
            <div className="w-8 h-8 bg-primary-600 border border-slate-200 rounded-lg flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[18px] text-white">autorenew</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="font-headline text-4xl font-bold text-slate-900">575</div>
            <p className="font-body text-xs text-slate-500 mt-1 font-semibold">Tim satgas aktif di lapangan</p>
          </div>
        </div>

        {/* Card 4: Avg Response Time */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-md hover:shadow-lg flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="font-label text-xs font-medium text-slate-500">RATA-RATA RESPON</span>
            <div className="w-8 h-8 bg-rose-500 border border-slate-200 rounded-lg flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[18px] text-white">speed</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="font-headline text-4xl font-bold text-slate-900">16.2 Jam</div>
            <p className="font-body text-xs text-slate-500 mt-1 font-semibold">Dari pelaporan hingga verifikasi</p>
          </div>
        </div>
      </section>

      {/* City Breakdown Table / Blocks */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-lg flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200 pb-3">
          <div>
            <h2 className="font-headline text-xl sm:text-2xl font-bold uppercase tracking-tight">
              PERFORMA KOTA &amp; INTEGRASI DINAS
            </h2>
            <p className="font-body text-xs sm:text-sm text-slate-500">
              Perbandingan kecepatan tanggap dan status penyelesaian per wilayah
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setSelectedCity('all')}
              className={`px-3 py-1 border border-slate-200 rounded-lg font-label text-xs font-medium cursor-pointer ${
                selectedCity === 'all' ? 'bg-primary-600 shadow-sm' : 'bg-white'
              }`}
            >
              Semua Kota
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {CITY_STATS.map((stat) => (
            <div
              key={stat.city}
              onClick={() => setSelectedCity(stat.city === selectedCity ? 'all' : stat.city)}
              className={`border border-slate-200 rounded-xl p-4 cursor-pointer transition-all ${
                selectedCity === stat.city
                  ? 'bg-primary-600 shadow-md translate-y-[-2px]'
                  : 'bg-white hover:bg-slate-100 shadow-sm'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-headline text-lg font-semibold">{stat.city}</span>
                <span className="font-label text-[11px] font-bold px-1.5 py-0.5 border border-slate-200 bg-white">
                  {Math.round((stat.resolved / stat.totalReports) * 100)}% Selesai
                </span>
              </div>
              <div className="mt-3 flex flex-col gap-1 text-xs font-body">
                <div className="flex justify-between text-slate-500">
                  <span>Total Isu:</span>
                  <span className="font-bold text-slate-900">{stat.totalReports}</span>
                </div>
                <div className="flex justify-between text-primary-600">
                  <span>Terselesaikan:</span>
                  <span className="font-bold text-slate-900">{stat.resolved}</span>
                </div>
                <div className="flex justify-between text-primary-600">
                  <span>Kecepatan Respon:</span>
                  <span className="font-bold text-slate-900">~{stat.avgResponseHours} Jam</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trending / Highest Upvoted Issues */}
      <section className="flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
          <h2 className="font-headline text-2xl font-semibold tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-rose-500 text-[26px]">local_fire_department</span>
            ISU DENGAN DUKUNGAN TERTINGGI (TRENDING)
          </h2>
          <span className="font-label text-xs font-medium text-slate-500">
            {trendingReports.length} Laporan Prioritas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trendingReports.map((report) => (
            <div
              key={report.id}
              onClick={() => onSelectReport(report)}
              className="bg-white border border-slate-200 rounded-xl shadow-md hover:shadow-lg hover:translate-y-0.5 hover:shadow-md transition-all p-4 flex flex-col sm:flex-row gap-4 cursor-pointer group"
            >
              <div className="w-full sm:w-40 h-32 bg-slate-100 border border-slate-200 rounded-lg overflow-hidden shrink-0">
                <img
                  src={report.imageUrl}
                  alt={report.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                />
              </div>

              <div className="flex flex-col justify-between flex-grow gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-rose-50 text-slate-900 border border-slate-200 text-[10px] px-2 py-0.5 font-bold uppercase">
                      {report.categoryLabel}
                    </span>
                    <span className="text-xs text-slate-500 font-body">{report.timeAgo}</span>
                  </div>
                  <h3 className="font-headline text-base sm:text-lg font-bold uppercase leading-tight group-hover:text-primary-600">
                    {report.title}
                  </h3>
                  <p className="font-body text-xs text-slate-500 line-clamp-2 mt-1">
                    {report.description}
                  </p>
                </div>

                <div className="flex justify-between items-center pt-2 border-t-2 border-slate-200">
                  <span className="font-label text-xs text-slate-900 flex items-center gap-1 font-bold">
                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                    {report.city}
                  </span>

                  <button
                    onClick={(e) => onToggleUpvote(report.id, e)}
                    className="flex items-center gap-1 px-2 py-1 bg-primary-600 border border-slate-200 rounded-lg font-label text-xs font-medium shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">thumb_up</span>
                    {report.upvotes}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
