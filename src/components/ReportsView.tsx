import { motion } from 'motion/react';
import { customEasing, springConfig } from './motion/PageTransition';
import React, { useState, useMemo } from 'react';
import { Report, ReportStatus, ReportCategory } from '../types';
import { GreenEduSection } from './GreenEduSection';
import { Check } from 'lucide-react';

interface ReportsViewProps {
  reports: Report[];
  onSelectReport: (report: Report) => void;
  onToggleUpvote: (reportId: string, e: React.MouseEvent) => void;
  onOpenReportModal: () => void;
  onOpenVolunteerModal?: (report: Report) => void;
  onNavigateToEcoPulse?: () => void;
  onNavigateToForum?: () => void;
  onNavigateToPortfolio?: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  reports,
  onSelectReport,
  onToggleUpvote,
  onOpenReportModal,
  onOpenVolunteerModal,
  onNavigateToEcoPulse,
  onNavigateToForum,
  onNavigateToPortfolio,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | ReportStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | ReportCategory>('all');
  const [sortBy, setSortBy] = useState<'terbaru' | 'upvote'>('terbaru');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(8);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Filter and Sort reports
  const filteredReports = useMemo(() => {
    return reports
      .filter((r) => {
        if (statusFilter !== 'all' && r.status !== statusFilter) return false;
        if (categoryFilter !== 'all' && r.category !== categoryFilter) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = r.title.toLowerCase().includes(q);
          const matchesLoc = r.location.toLowerCase().includes(q);
          const matchesDesc = r.description.toLowerCase().includes(q);
          if (!matchesTitle && !matchesLoc && !matchesDesc) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'upvote') {
          return b.upvotes - a.upvotes;
        }
        return b.timestamp - a.timestamp;
      });
  }, [reports, statusFilter, categoryFilter, sortBy, searchQuery]);

  const displayedReports = filteredReports.slice(0, visibleCount);
  const hasMore = visibleCount < filteredReports.length;

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 4);
      setIsLoadingMore(false);
    }, 400);
  };

  const getCategoryBadge = (category: ReportCategory, label: string) => {
    switch (category) {
      case 'kebersihan':
        return {
          bg: 'bg-primary-600 text-white',
          icon: 'delete',
        };
      case 'infrastruktur':
      case 'penerangan':
        return {
          bg: 'bg-primary-100 text-slate-900',
          icon: category === 'penerangan' ? 'lightbulb' : 'construction',
        };
      case 'drainase':
        return {
          bg: 'bg-primary-100 text-slate-900',
          icon: 'water_drop',
        };
      case 'ruang_hijau':
        return {
          bg: 'bg-green-100 text-slate-900',
          icon: 'park',
        };
      case 'fasilitas':
      default:
        return {
          bg: 'bg-rose-50 text-slate-900',
          icon: 'directions_walk',
        };
    }
  };

  return (
    <div className="flex-grow w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6 sm:gap-8">
      {/* Header Section */}
      <section className="flex flex-col gap-2 border-b border-slate-200 pb-6">
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-slate-900 font-bold uppercase tracking-tight">
          STATUS &amp; PERKEMBANGAN LAPORAN
        </h1>
        <p className="font-body text-base sm:text-lg text-slate-500 max-w-3xl">
          Pantau progres penanganan isu publik di kota Anda. Transparansi adalah kunci pembangunan berkelanjutan.
        </p>

        {/* Eco-Connect Quick IoT/AI Telemetry Strip with AOS fade-right */}
        <div 
          className="mt-3 bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center"
          data-aos="fade-right"
          
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 border border-slate-200 rounded-lg flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-slate-900 text-[22px]">solar_power</span>
            </div>
            <div>
              <div className="font-label text-[10px] font-medium text-slate-500">Solar Grid Output</div>
              <div className="font-headline text-base font-bold text-slate-900">3.840 kWh <span className="text-[10px] text-green-600 font-bold">(+18.5%)</span></div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-50 border border-slate-200 rounded-lg flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-rose-500 text-[22px]">delete_sweep</span>
            </div>
            <div>
              <div className="font-label text-[10px] font-medium text-slate-500">IoT Smart Bins</div>
              <div className="font-headline text-base font-bold text-slate-900">2 Titik Kritis <span className="text-[10px] text-primary-600 font-bold">(AI Dispatched)</span></div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 border border-slate-200 rounded-lg flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary-600 text-[22px]">air</span>
            </div>
            <div>
              <div className="font-label text-[10px] font-medium text-slate-500">Kualitas Udara (AQI)</div>
              <div className="font-headline text-base font-bold text-slate-900">AQI 114 <span className="text-[10px] bg-primary-600 px-1 font-bold border border-slate-200">Sedang</span></div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-1.5 justify-center">
            {onNavigateToEcoPulse && (
              <button
                onClick={onNavigateToEcoPulse}
                className="bg-primary-50 text-primary-700 border border-slate-200 rounded-lg px-3 py-1.5 font-label text-xs font-medium hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-sm flex items-center justify-center gap-1 cursor-pointer text-center"
              >
                <span>Buka Eco-Pulse Hub</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Filter & Sort Bar */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-[6px_6px_0px_0px_#1a1a1a] p-4 flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 z-10 relative">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-slate-900">filter_list</span>
            <span className="font-label text-sm font-bold text-slate-900 uppercase">FILTER:</span>
          </div>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="border border-slate-200 rounded-lg bg-slate-50 py-2 pl-3 pr-8 font-label text-sm font-bold text-slate-900 focus:ring-0 focus:outline-none focus:bg-primary-600 transition-colors shadow-sm cursor-pointer"
          >
            <option value="all">Semua Status</option>
            <option value="baru">Baru</option>
            <option value="diproses">Diproses</option>
            <option value="selesai">Selesai</option>
          </select>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="border border-slate-200 rounded-lg bg-slate-50 py-2 pl-3 pr-8 font-label text-sm font-bold text-slate-900 focus:ring-0 focus:outline-none focus:bg-primary-600 transition-colors shadow-sm cursor-pointer"
          >
            <option value="all">Kategori (Semua)</option>
            <option value="infrastruktur">Infrastruktur</option>
            <option value="kebersihan">Kebersihan Lingkungan</option>
            <option value="fasilitas">Fasilitas Umum</option>
            <option value="drainase">Drainase</option>
            <option value="ruang_hijau">Ruang Hijau</option>
          </select>

          {/* Search box */}
          <div className="relative flex-grow sm:flex-grow-0">
            <input
              type="text"
              placeholder="Cari isu / lokasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-48 border border-slate-200 rounded-lg bg-slate-50 py-2 pl-8 pr-3 font-body text-sm text-slate-900 focus:ring-0 focus:outline-none focus:bg-white shadow-sm"
            />
            <span className="material-symbols-outlined absolute left-2 top-2.5 text-[18px] text-slate-500">search</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2.5 text-xs text-slate-900 hover:font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Sorting */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
          <span className="font-label text-sm font-bold text-slate-900 uppercase">URUTKAN:</span>
          <div className="flex border border-slate-200 rounded-lg bg-slate-50">
            <button
              onClick={() => setSortBy('terbaru')}
              className={`px-4 py-2 font-label text-sm font-medium border-r border-slate-200 transition-colors cursor-pointer ${
                sortBy === 'terbaru'
                  ? 'bg-primary-600 text-white'
                  : 'text-slate-900 hover:bg-slate-100'
              }`}
            >
              Terbaru
            </button>
            <button
              onClick={() => setSortBy('upvote')}
              className={`px-4 py-2 font-label text-sm font-medium transition-colors cursor-pointer ${
                sortBy === 'upvote'
                  ? 'bg-primary-600 text-white'
                  : 'text-slate-900 hover:bg-slate-100'
              }`}
            >
              Upvote Terbanyak
            </button>
          </div>
        </div>
      </section>

      {/* Reports Grid with AOS fade-up */}
      {displayedReports.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-[6px_6px_0px_0px_#1a1a1a] flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-5xl text-slate-500">search_off</span>
          <h3 className="font-headline text-2xl font-semibold">Tidak Ada Laporan Ditemukan</h3>
          <p className="font-body text-slate-500 max-w-md">
            Tidak ada laporan yang sesuai dengan filter yang dipilih. Coba atur ulang filter atau buat laporan baru.
          </p>
          <button
            onClick={() => {
              setStatusFilter('all');
              setCategoryFilter('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-primary-600 border border-slate-200 rounded-lg font-label text-sm font-medium shadow-sm cursor-pointer"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedReports.map((report) => {
            const catBadge = getCategoryBadge(report.category, report.categoryLabel);
            return (
              <article
                key={report.id}
                
                
                onClick={() => onSelectReport(report)}
                className="bg-white border border-slate-200 rounded-xl shadow-lg hover:translate-y-1 hover:translate-x-1 hover:shadow-md transition-all duration-200 group flex flex-col cursor-pointer"
              >
                {/* Image & Category Badge */}
                <div className="relative h-48 w-full overflow-hidden border-b border-slate-200 bg-slate-100">
                  <img
                    src={report.imageUrl}
                    alt={report.imageAlt || report.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                    loading="lazy"
                  />
                  <div
                    className={`absolute top-4 left-4 ${catBadge.bg} border border-slate-200 rounded-lg px-3 py-1 flex items-center gap-1.5 shadow-sm`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {catBadge.icon}
                    </span>
                    <span className="font-label text-xs font-medium">
                      {report.categoryLabel}
                    </span>
                  </div>

                  {report.userJoinedVolunteer && (
                    <div className="absolute bottom-2 right-2 bg-green-600 text-white border border-slate-200 rounded-lg px-2 py-0.5 font-label text-[10px] font-bold shadow-sm flex items-center gap-1">
                      <Check size={12} /> Anda Relawan
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow gap-3">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-headline text-lg font-bold text-slate-900 line-clamp-2 leading-tight uppercase group-hover:text-primary-600 transition-colors">
                      {report.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 text-slate-900 font-label text-sm">
                    <span className="material-symbols-outlined text-[18px] shrink-0 text-slate-900">
                      location_on
                    </span>
                    <span className="truncate">{report.location}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-500 font-body text-xs">
                    <span className="material-symbols-outlined text-[18px] shrink-0">
                      schedule
                    </span>
                    <span>{report.timeAgo}</span>
                  </div>

                  {/* Card Bottom Status & Upvote */}
                  <div className="mt-auto pt-3 border-t border-slate-200 flex flex-col gap-2.5">
                    <div className="flex justify-between items-center">
                      {/* Status Badge */}
                      {report.status === 'baru' && (
                        <span className="bg-primary-600 text-white border border-slate-200 rounded-lg px-2.5 py-0.5 font-label text-xs font-bold flex items-center gap-1.5 uppercase shadow-sm">
                          <span className="w-2 h-2 bg-slate-900"></span> Baru
                        </span>
                      )}

                      {report.status === 'diproses' && (
                        <span className="bg-primary-600 text-white border border-slate-200 rounded-lg px-2.5 py-0.5 font-label text-xs font-bold flex items-center gap-1.5 uppercase shadow-sm">
                          <span className="w-2 h-2 bg-white border border-slate-200"></span> Diproses
                        </span>
                      )}

                      {report.status === 'selesai' && (
                        <span className="bg-green-600 text-white border border-slate-200 rounded-lg px-2.5 py-0.5 font-label text-xs font-bold flex items-center gap-1 uppercase shadow-sm">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span> Selesai
                        </span>
                      )}

                      {/* Upvote Button */}
                      <button
                        onClick={(e) => onToggleUpvote(report.id, e)}
                        className={`flex items-center gap-1 text-slate-900 px-2 py-0.5 transition-all active:scale-95 cursor-pointer ${
                          report.hasUpvoted
                            ? 'border border-slate-200 rounded-lg bg-rose-50 shadow-sm'
                            : 'hover:text-primary-600 rounded-lg hover:bg-rose-50 hover:shadow-sm'
                        }`}
                        title={report.hasUpvoted ? 'Batalkan Upvote' : 'Dukung Laporan Ini'}
                      >
                        <span
                          className={`material-symbols-outlined text-[18px] ${
                            report.hasUpvoted ? 'fill text-rose-500' : ''
                          }`}
                        >
                          thumb_up
                        </span>
                        <span className="font-label text-xs font-bold">{report.upvotes}</span>
                      </button>
                    </div>

                    {/* Tombol 'Ikut Aksi Relawan' (Neo-Brutalist Green/Yellow CTA) */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenVolunteerModal) {
                          onOpenVolunteerModal(report);
                        } else {
                          onSelectReport(report);
                        }
                      }}
                      className={`w-full border border-slate-200 rounded-lg py-1.5 px-2 font-headline text-xs font-semibold transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                        report.userJoinedVolunteer
                          ? 'bg-green-600 text-white shadow-sm'
                          : 'bg-primary-600 hover:bg-green-600 text-white shadow-sm'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">volunteer_activism</span>
                      <span>
                        {report.userJoinedVolunteer ? 'Terdaftar Relawan (Cek Detail)' : 'Ikut Aksi Relawan'}
                      </span>
                      {report.volunteerCount ? (
                        <span className="bg-slate-900 text-white text-[10px] px-1.5 py-0.2 font-label">
                          {report.volunteerCount}
                        </span>
                      ) : null}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {/* Pagination / Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-2 mb-2">
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="px-6 py-3 border border-slate-200 rounded-xl bg-white font-headline text-lg font-bold text-slate-900 hover:bg-slate-100 shadow-[6px_6px_0px_0px_#1a1a1a] hover:translate-y-1 hover:translate-x-1 hover:shadow-sm transition-all uppercase flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoadingMore ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                Memuat...
              </>
            ) : (
              'MUAT LEBIH BANYAK'
            )}
          </button>
        </div>
      )}

      {/* Section Baru: 'Pusat Edukasi & Inovasi Hijau' (Diletakkan tepat di bawah deretan kartu status & perkembangan laporan) */}
      <GreenEduSection
        onNavigateToForum={onNavigateToForum}
        onNavigateToEcoPulse={onNavigateToEcoPulse}
        onNavigateToPortfolio={onNavigateToPortfolio}
      />
    </div>
  );
};
