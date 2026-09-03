import React from 'react';
import { Report, ReportStatus, ReportCategory } from '../types';
import { GreenEduSection } from './GreenEduSection';
import { motion } from 'motion/react';
import { StaggeredText } from './motion/StaggeredText';
import { CountUpStat } from './motion/CountUpStat';
import { customEasing, springConfig } from './motion/PageTransition';
import { ShieldCheck, Leaf, Megaphone, Zap, Users, Building2, Activity } from 'lucide-react';

interface HomeViewProps {
  reports: Report[];
  onSelectReport: (report: Report) => void;
  onToggleUpvote: (reportId: string, e: React.MouseEvent) => void;
  onOpenReportModal: () => void;
  onOpenVolunteerModal: (report: Report) => void;
  onNavigateToReports: () => void;
  onNavigateToMap: () => void;
  onNavigateToEcoPulse: () => void;
  onNavigateToForum: () => void;
  onNavigateToPortfolio: () => void;
  onNavigateToImpact: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  reports,
  onSelectReport,
  onToggleUpvote,
  onOpenReportModal,
  onOpenVolunteerModal,
  onNavigateToReports,
  onNavigateToMap,
  onNavigateToEcoPulse,
  onNavigateToForum,
  onNavigateToPortfolio,
  onNavigateToImpact,
}) => {
  // Top active/featured reports
  const featuredReports = reports.slice(0, 4);

  const getCategoryBadge = (category: ReportCategory) => {
    switch (category) {
      case 'kebersihan':
        return { bg: 'bg-primary-600 text-white', icon: 'delete', label: 'Kebersihan' };
      case 'infrastruktur':
      case 'penerangan':
        return { bg: 'bg-primary-100 text-slate-900', icon: 'construction', label: 'Infrastruktur' };
      case 'drainase':
        return { bg: 'bg-primary-100 text-slate-900', icon: 'water_drop', label: 'Drainase' };
      case 'ruang_hijau':
        return { bg: 'bg-green-100 text-slate-900', icon: 'park', label: 'Ruang Hijau' };
      default:
        return { bg: 'bg-rose-50 text-slate-900', icon: 'directions_walk', label: 'Fasilitas' };
    }
  };

  return (
    <div className="flex-grow w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-8 sm:gap-12">
      {/* 1. Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 sm:p-12 lg:p-16 relative overflow-hidden flex flex-col gap-8"
      >
        {/* Subtle Gradient Accent */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-50/50 to-transparent pointer-events-none" />
        
        <div className="absolute -right-8 -bottom-12 opacity-[0.03] pointer-events-none transform -rotate-12">
          <Building2 size={400} strokeWidth={1} className="text-primary-900" />
        </div>
        
        <div className="flex flex-wrap items-center gap-2 relative z-10">
          <motion.span 
    initial={{ opacity: 0, y: -10 }} 
    whileInView={{ opacity: 1, y: 0 }} 
    transition={{ duration: 0.5, ease: customEasing }} 
    viewport={{ once: true }} 
    className="bg-primary-50 text-primary-700 border border-primary-100 rounded-full px-3 py-1 font-label text-xs font-semibold flex items-center gap-1.5 shadow-sm">
    <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse inline-block"></span>
    ECO-CONNECT & IOT/AI METRICS
  </motion.span>
          <span className="bg-slate-50 text-slate-700 border border-slate-200 rounded-full px-3 py-1 font-label text-xs font-semibold flex items-center gap-1.5 shadow-sm">
            <Leaf size={14} /> SDG 11: Kota Berkelanjutan
          </span>
          <span className="bg-primary-50 text-primary-700 border border-primary-100 rounded-full px-3 py-1 font-label text-xs font-semibold flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse inline-block"></span>
            IoT Telemetry Active
          </span>
        </div>
        
        <div className="flex flex-col gap-4 relative z-10">
          <StaggeredText text="Wujudkan Kota Pintar, Bersih, dan Berkelanjutan Bersama" className="font-headline text-5xl sm:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6" delay={2} />
          <p className="font-body text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl leading-relaxed">
            Wadah partisipasi publik untuk melaporkan masalah infrastruktur, memantau kondisi kota secara real-time, dan bergabung dalam inisiatif perbaikan lingkungan terpadu.
          </p>
        </div>
        
        {/* Hero CTA Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-4 relative z-10">
          <button
            onClick={onOpenReportModal}
            className="bg-primary-600 text-white hover:bg-primary-700 border border-transparent rounded-xl px-6 py-3.5 font-label text-sm font-semibold shadow-sm hover:shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Laporkan Isu Publik</span>
            <span className="material-symbols-outlined text-[18px]">add_location_alt</span>
          </button>
          <button
            onClick={onNavigateToEcoPulse}
            className="bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 rounded-xl px-6 py-3.5 font-label text-sm font-semibold shadow-sm hover:shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Pantau Eco-Pulse (IoT)</span>
            <span className="material-symbols-outlined text-[18px]">bolt</span>
          </button>
          <button
            onClick={onNavigateToMap}
            className="bg-slate-50 text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-xl px-5 py-3.5 font-label text-sm font-semibold shadow-sm hover:shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Peta Interaktif</span>
            <span className="material-symbols-outlined text-[18px]">map</span>
          </button>
        </div>
      </motion.section>
      
      {/* 2. Live Civic Ticker Bar */}
      <div 
        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 sm:px-5 sm:py-3.5 shadow-md flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 overflow-hidden relative group"
        data-aos="fade-up"
        data-aos-duration="650"
      >
        {/* Badge Area (Fixed Left) */}
        <div className="flex items-center gap-2 shrink-0 z-10 relative">
          <div className="bg-primary-500/20 border border-primary-500/30 text-primary-400 px-2.5 py-1 rounded-md font-label text-[10px] sm:text-xs font-bold tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-pulse"></span>
            LIVE DISPATCH
          </div>
          {/* Fading gradient for smooth marquee entry on desktop */}
          <div className="hidden sm:block absolute right-[-24px] top-0 bottom-0 w-6 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none"></div>
        </div>

        {/* Marquee Area */}
        <div className="flex-1 overflow-hidden relative flex items-center">
          <div className="flex w-max animate-marquee gap-6 sm:gap-8 cursor-default items-center">
            {/* We duplicate the content to ensure seamless scrolling loop */}
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-6 sm:gap-8 items-center shrink-0">
                <span className="flex items-center gap-2 text-slate-300 font-body text-xs sm:text-sm">
                  <Megaphone size={14} className="text-slate-400 opacity-80" /> 
                  <strong className="text-white font-semibold">Bandung:</strong> Truk sampah dialokasikan ke Cihampelas
                </span>
                
                <div className="w-[1px] h-3.5 bg-slate-700/60"></div>
                
                <span className="flex items-center gap-2 text-slate-300 font-body text-xs sm:text-sm">
                  <Zap size={14} className="text-slate-400 opacity-80" /> 
                  <strong className="text-white font-semibold">Jakarta:</strong> Panel surya PJU aktif: 3.840 kWh
                </span>

                <div className="w-[1px] h-3.5 bg-slate-700/60"></div>
                
                <span className="flex items-center gap-2 text-slate-300 font-body text-xs sm:text-sm">
                  <Users size={14} className="text-slate-400 opacity-80" /> 
                  <strong className="text-white font-semibold">Surabaya:</strong> 22 relawan mendaftar gotong royong
                </span>

                <div className="w-[1px] h-3.5 bg-slate-700/60"></div>

                <span className="flex items-center gap-2 text-slate-300 font-body text-xs sm:text-sm">
                  <Activity size={14} className="text-slate-400 opacity-80" /> 
                  <strong className="text-white font-semibold">Medan:</strong> 4 unit pompa air diaktifkan (Siaga Banjir)
                </span>
                
                {/* Separator at the end of the block so it joins nicely with the duplicated block */}
                <div className="w-[1px] h-3.5 bg-slate-700/60"></div>
              </div>
            ))}
          </div>
          {/* Fading gradient for smooth marquee exit */}
          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none"></div>
        </div>
      </div>

      {/* 3. Metric Stats Grid */}
      <motion.section 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: customEasing, staggerChildren: 0.1 }}
    viewport={{ once: true, margin: "-50px" }}
    className="grid grid-cols-2 lg:grid-cols-4 gap-4"
  >
        <motion.div 
    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } }}
    whileHover={{ y: -4, boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.1)" }}
    className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-md flex flex-col gap-1 group"
  >
          <div className="flex items-center justify-between">
            <span className="font-label text-xs font-medium text-slate-500">Total Laporan Teratasi</span>
            <motion.span whileHover={{ rotate: 15, scale: 1.2 }} className="material-symbols-outlined text-green-600 inline-block">check_circle</motion.span>
          </div>
          <div className="font-headline text-2xl sm:text-3xl font-bold text-slate-900">
    <CountUpStat end={1420} suffix="+" />
  </div>
          <span className="font-body text-xs text-primary-600 font-semibold">
            Tingkat penyelesaian 86.4%
          </span>
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } }}
    whileHover={{ y: -4, boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.1)" }}
    className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-md flex flex-col gap-1 group"
  >
          <div className="flex items-center justify-between">
            <span className="font-label text-xs font-medium text-slate-500">Energi Surya Terpanen</span>
            <motion.span whileHover={{ rotate: 15, scale: 1.2 }} className="material-symbols-outlined text-primary-600 inline-block">solar_power</motion.span>
          </div>
          <div className="font-headline text-2xl sm:text-3xl font-bold text-slate-900">
            3.840 kWh
          </div>
          <span className="font-body text-xs text-green-600 font-semibold">
            -2.7 ton emisi CO2 hari ini
          </span>
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } }}
    whileHover={{ y: -4, boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.1)" }}
    className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-md flex flex-col gap-1 group"
  >
          <div className="flex items-center justify-between">
            <span className="font-label text-xs font-medium text-slate-500">Sensor IoT Tersebar</span>
            <motion.span whileHover={{ rotate: 15, scale: 1.2 }} className="material-symbols-outlined text-primary-600 inline-block">sensors</motion.span>
          </div>
          <div className="font-headline text-2xl sm:text-3xl font-bold text-slate-900">
            148 Titik
          </div>
          <span className="font-body text-xs text-slate-500 font-semibold">
            LoRaWAN &amp; Smart Compactor
          </span>
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } }}
    whileHover={{ y: -4, boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.1)" }}
    className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-md flex flex-col gap-1 group"
  >
          <div className="flex items-center justify-between">
            <span className="font-label text-xs font-medium text-slate-500">Relawan Gotong Royong</span>
            <span className="material-symbols-outlined text-rose-500">volunteer_activism</span>
          </div>
          <div className="font-headline text-2xl sm:text-3xl font-bold text-slate-900">
    <CountUpStat end={4250} suffix="+" />
  </div>
          <span className="font-body text-xs text-slate-900 font-semibold">
            Aktif di 5 kota besar
          </span>
        </motion.div>
      </motion.section>

      {/* 4. Modul Eco-Pulse IoT Telemetry Snapshot (with data-aos="fade-right") */}
      <section 
        className="bg-white border border-slate-200 rounded-xl shadow-lg p-5 sm:p-7 flex flex-col gap-4"
        data-aos="fade-right"
        data-aos-duration="750"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 bg-green-600 border border-slate-200"></div>
            <h2 className="font-headline text-xl sm:text-2xl font-bold uppercase text-slate-900">
              Eco-Pulse: Telemetri Kota Hijau Terkini
            </h2>
          </div>
          <button
            onClick={onNavigateToEcoPulse}
            className="font-label text-xs font-medium text-primary-600 hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>Buka Dashboard Penuh</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8 bg-slate-50 border border-slate-200 rounded-lg p-5 sm:p-7 flex flex-col justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-2 font-label text-sm font-medium text-slate-500">
              <span className="material-symbols-outlined text-primary-600 text-[24px]">solar_power</span>
              Solar Grid Micro-Power
            </div>
            <div>
              <div className="font-headline text-4xl lg:text-5xl font-bold text-slate-900 mb-2">
                3.840 kWh
              </div>
              <p className="font-body text-sm text-slate-500 max-w-lg leading-relaxed">
                Menyuplai 42% kebutuhan listrik lampu jalan umum di 12 kelurahan percontohan. Mengurangi beban grid konvensional secara signifikan.
              </p>
            </div>
          </div>

          <div className="md:col-span-4 flex flex-col gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col justify-between gap-2 shadow-sm flex-grow">
              <div className="flex items-center gap-2 font-label text-xs font-medium text-slate-500">
                <span className="material-symbols-outlined text-rose-500 text-[20px]">delete_sweep</span>
                IoT Smart Bins
              </div>
              <div className="font-headline text-2xl font-bold text-slate-900">
                2 Titik Penuh (&gt;80%)
              </div>
              <p className="font-body text-xs text-slate-500">
                AI Route otomatis mengatur prioritas truk angkut.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col justify-between gap-2 shadow-sm flex-grow">
              <div className="flex items-center gap-2 font-label text-xs font-medium text-slate-500">
                <span className="material-symbols-outlined text-primary-600 text-[20px]">air</span>
                Kualitas Udara
              </div>
              <div className="font-headline text-2xl font-bold text-slate-900">
                AQI 114 <span className="text-xs bg-primary-600 px-1.5 py-0.5 border border-slate-200 ml-1">Sedang</span>
              </div>
              <p className="font-body text-xs text-slate-500">
                Terpantau normal di sebagian besar pusat kota.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Status & Perkembangan Laporan Terkini (Cards with data-aos="fade-up" & 'Ikut Aksi Relawan') */}
      <section className="flex flex-col gap-6" data-aos="fade-up" data-aos-duration="700">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <div className="font-label text-xs font-medium text-primary-600 mb-1">
              RESPON CEPAT KOTA
            </div>
            <h2 className="font-headline text-2xl sm:text-3xl lg:text-4xl font-bold uppercase text-slate-900">
              Status &amp; Perkembangan Laporan Terkini
            </h2>
          </div>
          <button
            onClick={onNavigateToReports}
            className="bg-primary-50 text-primary-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 rounded-lg px-4 py-2 font-headline text-xs uppercase font-bold shadow-sm active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <span>Lihat Semua Laporan ({reports.length})</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredReports.map((report) => {
            const catBadge = getCategoryBadge(report.category);
            return (
              <article
                key={report.id}
                data-aos="fade-up"
                data-aos-duration="650"
                onClick={() => onSelectReport(report)}
                className="bg-white border border-slate-200 rounded-xl shadow-lg hover:translate-y-1 hover:shadow-md transition-all duration-200 group flex flex-col cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-44 w-full overflow-hidden border-b border-slate-200 bg-slate-100">
                  <img
                    src={report.imageUrl}
                    alt={report.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                    loading="lazy"
                  />
                  <div
                    className={`absolute top-3 left-3 ${catBadge.bg} border border-slate-200 rounded-lg px-2.5 py-0.5 flex items-center gap-1 shadow-sm`}
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {catBadge.icon}
                    </span>
                    <span className="font-label text-[11px] font-medium">
                      {report.categoryLabel}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-grow gap-2.5 justify-between">
                  <div className="flex flex-col gap-1.5">
                    <h3 className="font-headline text-base font-bold text-slate-900 line-clamp-2 uppercase group-hover:text-primary-600 transition-colors leading-snug">
                      {report.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 truncate">
                      <span className="material-symbols-outlined text-[16px] text-slate-900">location_on</span>
                      <span className="truncate">{report.location}</span>
                    </div>
                  </div>

                  {/* Card Bottom: Status, Upvotes, & 'Ikut Aksi Relawan' */}
                  <div className="pt-3 border-t-2 border-slate-200 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      {report.status === 'baru' && (
                        <span className="bg-primary-600 text-white border border-slate-200 px-2 py-0.5 font-label text-[10px] font-medium">
                          Baru
                        </span>
                      )}
                      {report.status === 'diproses' && (
                        <span className="bg-primary-600 text-white border border-slate-200 px-2 py-0.5 font-label text-[10px] font-medium">
                          Diproses
                        </span>
                      )}
                      {report.status === 'selesai' && (
                        <span className="bg-green-600 text-white border border-slate-200 px-2 py-0.5 font-label text-[10px] font-medium">
                          Selesai
                        </span>
                      )}

                      <button
                        onClick={(e) => onToggleUpvote(report.id, e)}
                        className="flex items-center gap-1 font-label text-xs font-bold text-slate-900 hover:text-rose-500"
                      >
                        <span className={`material-symbols-outlined text-[16px] ${report.hasUpvoted ? 'fill text-rose-500' : ''}`}>
                          thumb_up
                        </span>
                        <span>{report.upvotes}</span>
                      </button>
                    </div>

                    {/* Tombol 'Ikut Aksi Relawan' (Neo-Brutalist Green/Yellow CTA) */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenVolunteerModal(report);
                      }}
                      className={`w-full border border-slate-200 rounded-lg py-1.5 px-2 font-headline text-xs font-semibold transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                        report.userJoinedVolunteer
                          ? 'bg-primary-600 text-white shadow-sm'
                          : 'bg-primary-600 hover:bg-primary-600 text-white shadow-sm'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">volunteer_activism</span>
                      <span>
                        {report.userJoinedVolunteer ? 'Terdaftar Relawan' : 'Ikut Aksi Relawan'}
                      </span>
                      {report.volunteerCount ? (
                        <span className="bg-slate-900 text-white text-[10px] px-1 font-label">
                          {report.volunteerCount}
                        </span>
                      ) : null}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 6. Pusat Edukasi & Inovasi Hijau (Swiperjs Carousel Slider) */}
      <GreenEduSection
        onNavigateToForum={onNavigateToForum}
        onNavigateToEcoPulse={onNavigateToEcoPulse}
        onNavigateToPortfolio={onNavigateToPortfolio}
      />

      {/* 7. Alur 3 Langkah Kolaborasi Warga */}
      <section 
        className="bg-white border border-slate-200 rounded-xl shadow-lg p-6 sm:p-10 flex flex-col gap-6"
        data-aos="fade-up"
        data-aos-duration="700"
      >
        <div className="flex flex-col gap-1 border-b border-slate-200 pb-4">
          <span className="font-label text-xs font-medium text-primary-600">
            ALUR KERJA TRANSPARAN
          </span>
          <h2 className="font-headline text-2xl sm:text-3xl font-bold uppercase text-slate-900">
            Bagaimana LaporKota Bekerja untuk Anda
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col gap-3 shadow-md">
            <div className="w-12 h-12 bg-primary-600 border border-slate-200 rounded-lg font-headline text-xl font-bold flex items-center justify-center">
              01
            </div>
            <h3 className="font-headline text-lg font-semibold text-slate-900">
              Foto &amp; Pinpoint Isu
            </h3>
            <p className="font-body text-xs sm:text-sm text-slate-500 leading-relaxed">
              Unggah foto jalan rusak, sampah, atau lampu padam. AI sistem kami akan mengidentifikasi kategori dan mendisposisi ke instansi terkait.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col gap-3 shadow-md">
            <div className="w-12 h-12 bg-primary-600 text-white border border-slate-200 rounded-lg font-headline text-xl font-bold flex items-center justify-center">
              02
            </div>
            <h3 className="font-headline text-lg font-semibold text-slate-900">
              Pantau AI &amp; Petugas Lapangan
            </h3>
            <p className="font-body text-xs sm:text-sm text-slate-500 leading-relaxed">
              Lihat status penanganan secara terbuka di linimasa. Terintegrasi dengan sensor IoT armada pembersih dan jaringan kelistrikan surya.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col gap-3 shadow-md">
            <div className="w-12 h-12 bg-primary-600 text-white border border-slate-200 rounded-lg font-headline text-xl font-bold flex items-center justify-center">
              03
            </div>
            <h3 className="font-headline text-lg font-semibold text-slate-900">
              Gotong Royong &amp; Relawan
            </h3>
            <p className="font-body text-xs sm:text-sm text-slate-500 leading-relaxed">
              Bergabung bersama komunitas warga dalam aksi pembersihan gotong royong akhir pekan untuk dampak langsung yang berkelanjutan.
            </p>
          </div>
        </div>
      </section>

      {/* 8. Call To Action Footer Banner */}
      <section 
        className="bg-slate-900 text-slate-100 border border-slate-200 rounded-xl p-8 sm:p-12 shadow-md flex flex-col md:flex-row items-center justify-between gap-6"
        data-aos="fade-up"
      >
        <div className="flex flex-col gap-2 max-w-2xl">
          <span className="text-primary-600 font-label text-xs font-medium tracking-wider">
            BERGABUNG BERSAMA GERAKAN WARGA KOTA
          </span>
          <h2 className="font-headline text-2xl sm:text-4xl font-bold uppercase text-white leading-tight">
            Wujudkan Kota Kita Lebih Bersih, Aman, &amp; Berkelanjutan
          </h2>
          <p className="font-body text-sm text-slate-400">
            Setiap laporan Anda adalah langkah nyata bagi masa depan infrastruktur dan lingkungan yang tangguh.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
          <button
            onClick={onOpenReportModal}
            className="bg-primary-600 text-white hover:bg-primary-700 border border-slate-200 rounded-lg px-6 py-3 font-headline text-sm uppercase font-bold shadow-sm hover:shadow-md active:scale-95 cursor-pointer text-center"
          >
            Buat Laporan Sekarang
          </button>
          <button
            onClick={onNavigateToForum}
            className="bg-white text-slate-800 hover:bg-slate-50 border border-slate-200 rounded-lg px-6 py-3 font-headline text-sm uppercase font-bold shadow-sm hover:shadow-md active:scale-95 cursor-pointer text-center"
          >
            Masuk Forum Komunitas
          </button>
        </div>
      </section>
    </div>
  );
};
