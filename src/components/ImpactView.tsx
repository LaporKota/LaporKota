import { motion } from 'motion/react';
import { CountUpStat } from './motion/CountUpStat';
import { customEasing, springConfig } from './motion/PageTransition';
import React, { useState } from 'react';
import { Report } from '../types';
import { Check } from 'lucide-react';

interface ImpactViewProps {
  reports: Report[];
  onOpenReportModal: () => void;
}

export const ImpactView: React.FC<ImpactViewProps> = ({ reports, onOpenReportModal }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Handle Open Data Export
  const handleExportData = (format: 'json' | 'csv') => {
    if (format === 'json') {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(reports, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `laporkota-open-data-${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } else {
      const headers = ['ID', 'Judul', 'Kategori', 'Status', 'Lokasi', 'Kota', 'Upvotes', 'Waktu'];
      const rows = reports.map((r) => [
        r.id,
        `"${r.title.replace(/"/g, '""')}"`,
        r.category,
        r.status,
        `"${r.location.replace(/"/g, '""')}"`,
        r.city,
        r.upvotes,
        r.timeAgo,
      ]);
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', encodedUri);
      downloadAnchor.setAttribute('download', `laporkota-open-data-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    }

    setDownloadSuccess(`Data ${format.toUpperCase()} berhasil diunduh secara transparan.`);
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  return (
    <div className="flex-grow w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
      {/* Header Section */}
      <section className="flex flex-col gap-2 border-b border-slate-200 pb-6">
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary-600 border border-slate-200 rounded-lg px-3 py-1 text-xs font-label font-bold uppercase mb-2 shadow-sm">
              <span className="material-symbols-outlined text-[16px]">emoji_events</span>
              UNITED NATIONS SDG 11 INITIATIVE
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-slate-900 font-bold uppercase tracking-tight">
              DAMPAK &amp; TRANSPARANSI PUBLIK
            </h1>
            <p className="font-body text-base sm:text-lg text-slate-500 max-w-3xl mt-1">
              Setiap laporan Anda mendorong akuntabilitas birokrasi, mempercepat pemulihan ruang kota, dan membangun peradaban kota yang berkelanjutan.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleExportData('json')}
              className="bg-white text-slate-800 border border-slate-200 rounded-xl px-3 py-2 font-label text-xs font-medium shadow-sm hover:bg-white active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">code</span>
              Export JSON
            </button>
            <button
              onClick={() => handleExportData('csv')}
              className="bg-primary-600 text-white border border-slate-200 rounded-xl px-3 py-2 font-label text-xs font-medium shadow-sm hover:bg-primary-700 active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              Export CSV
            </button>
          </div>
        </div>
      </section>

      {downloadSuccess && (
        <div className="bg-primary-600 text-white border border-slate-200 rounded-xl p-3 shadow-md font-label text-sm font-medium flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          {downloadSuccess}
        </div>
      )}

      {/* SDG 11 Core Metrics */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-primary-600 border border-slate-200 rounded-xl p-6 shadow-lg">
          <div className="font-label text-xs font-medium text-slate-900">SAMPAH TERANGKUT</div>
          <div className="font-headline text-4xl font-bold text-slate-900 mt-2">14,280 Ton</div>
          <p className="font-body text-xs text-slate-900 mt-2 font-semibold">
            Hasil tindak lanjut 840+ titik tumpukan sampah liar
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-lg">
          <div className="font-label text-xs font-medium text-slate-500">JALAN &amp; TROTOAR TUNTAS</div>
          <div className="font-headline text-4xl font-bold text-slate-900 mt-2">3,450 Titik</div>
          <p className="font-body text-xs text-slate-500 mt-2 font-semibold">
            Tambal aspal cepat & perbaikan guiding block disabilitas
          </p>
        </div>

        <div className="bg-primary-600 text-white border border-slate-200 rounded-xl p-6 shadow-lg">
          <div className="font-label text-xs font-medium text-white/90">DRAINASE BEBAS SUMBATAN</div>
          <div className="font-headline text-4xl font-bold text-white mt-2">912 Lokasi</div>
          <p className="font-body text-xs text-white/90 mt-2 font-semibold">
            Pengerukan lumpur mencegah 24 potensi banjir genangan
          </p>
        </div>

        <div className="bg-primary-600 border border-slate-200 rounded-xl p-6 shadow-lg">
          <div className="font-label text-xs font-medium text-slate-900">PJU MENYALA KEMBALI</div>
          <div className="font-headline text-4xl font-bold text-slate-900 mt-2">1,240 Tiang</div>
          <p className="font-body text-xs text-slate-900 mt-2 font-semibold">
            Meningkatkan keamanan lingkungan warga pada malam hari
          </p>
        </div>
      </section>

      {/* Before & After Interactive Showcase */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-lg flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-200 pb-4">
          <div>
            <h2 className="font-headline text-2xl sm:text-3xl font-bold uppercase tracking-tight">
              BUKTI HASIL TUNTAS (SEBELUM &amp; SESUDAH)
            </h2>
            <p className="font-body text-xs sm:text-sm text-slate-500">
              Geser slider pembanding di bawah ini untuk melihat hasil kerja tim petugas dinas di lapangan
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-primary-600 text-white border border-slate-200 rounded-lg px-3 py-1 font-label text-xs font-medium shadow-sm flex items-center gap-1">
              <Check size={14} /> Terverifikasi Warga
            </span>
          </div>
        </div>

        {/* Interactive Comparison Slider */}
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          <div className="w-full lg:w-3/5">
            <div className="relative h-[320px] sm:h-[400px] w-full border border-slate-200 rounded-xl shadow-md hover:shadow-lg overflow-hidden select-none bg-black">
              {/* After Image (Right/Full) */}
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfwJRph6sfFILt6isCntY_ikP2Awvh53h1lah90xKwhpwV3WO8lWIasOKau4ML_JvlFw202bCxEMlAN3OwtJkEmb00wn8ctEASCUHXxMZm3W-p2z3yVCPPQb6WWp-ITHXhoNzq74iEkKs7gDTlnHHZO3vr9NfATBHtob3nDmcuwqPLqQExsNryDtWAObdbnJ4dGHYJ3IGFtLfB_7js3mqMQnhGghsT0lI94e_68ZmfMr4jA_BLy2fF9g"
                alt="Sesudah Perbaikan Jalan"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Before Image (Left, clipped) */}
              <div
                className="absolute inset-y-0 left-0 overflow-hidden border-r-4 border-[#ffcc00]"
                style={{ width: `${sliderPosition}%` }}
              >
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoZk0bpCla6hC9BfwKahestfAWIK6K3MSEDOOdUAR3qRC7sTWJOZkVpxO4WaQdbz7T6P3tuYRX2yE9iORQTH9teBIyxyGDEbOSBUWMFlM2JKBfSLFrsfr0CrOhXYgkneuQj40QCdWhkOFNTQKCMf0MP5zOmFg5LIQ7vz6gJ8hg8re6jcgIv246unBgUEjvVSSs70ex4yU6W7MtEvmZ9TK7RNpVh-w3_y0tbWgn0mVvvPDkl9SUDbA4cA"
                  alt="Sebelum Perbaikan"
                  className="absolute inset-0 w-[1000px] max-w-none h-full object-cover grayscale contrast-125"
                />
              </div>

              {/* Badges on image */}
              <div className="absolute top-4 left-4 bg-rose-500 text-white border border-slate-200 rounded-lg px-3 py-1 font-label text-xs font-medium shadow-sm pointer-events-none">
                SEBELUM (RUSAK)
              </div>
              <div className="absolute top-4 right-4 bg-primary-600 text-white border border-slate-200 rounded-lg px-3 py-1 font-label text-xs font-medium shadow-sm pointer-events-none">
                SESUDAH (PERBAIKAN TUNTAS)
              </div>

              {/* Slider Handle Divider */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-primary-600 cursor-ew-resize flex items-center justify-center pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="w-8 h-8 bg-primary-50 text-primary-700 border-2 border-white rounded-full rounded-full flex items-center justify-center font-bold text-xs shadow-md">
                  ↔
                </div>
              </div>
            </div>

            {/* Slider Range Input */}
            <div className="mt-4 flex items-center gap-4">
              <span className="font-label text-xs font-medium text-rose-500">Kondisi Awal</span>
              <input
                type="range"
                min="5"
                max="95"
                value={sliderPosition}
                onChange={(e) => setSliderPosition(Number(e.target.value))}
                className="flex-grow accent-primary-600 cursor-pointer"
              />
              <span className="font-label text-xs font-medium text-green-600">Hasil Tuntas</span>
            </div>
          </div>

          {/* Context Details for the comparison */}
          <div className="w-full lg:w-2/5 flex flex-col gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-md flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-600">verified</span>
                <span className="font-label text-xs font-medium text-primary-600">
                  STUDI KASUS #REP-03
                </span>
              </div>
              <h3 className="font-headline text-xl font-semibold leading-tight">
                Rekonstruksi Jalan Aspal Cihampelas
              </h3>
              <p className="font-body text-xs text-slate-500 leading-relaxed">
                Lubang jalan sedalam 12cm yang membahayakan pengendara motor berhasil ditambal dan dilapisi hotmix rata dalam kurun waktu 36 jam setelah 89 warga memberikan upvote.
              </p>

              <div className="border-t-2 border-slate-200 pt-3 flex flex-col gap-2 font-label text-xs font-semibold">
                <div className="flex justify-between">
                  <span className="text-slate-500">Instansi Pelaksana:</span>
                  <span className="font-bold">DSDABM Kota Bandung</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Waktu Pengerjaan:</span>
                  <span className="font-bold">1 Hari 12 Jam</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Kepuasan Warga:</span>
                  <span className="font-bold text-green-600">98.2% Positif</span>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenReportModal}
              className="bg-primary-600 text-white border border-slate-200 rounded-xl p-3 font-label text-sm font-medium shadow-md hover:bg-primary-700 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              Buat Laporan Baru Di Sekitar Anda
            </button>
          </div>
        </div>
      </section>

      {/* Department Accountability Table */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-lg flex flex-col gap-4">
        <h2 className="font-headline text-2xl font-semibold tracking-tight border-b border-slate-200 pb-2">
          LEADERBOARD AKUNTABILITAS DINAS &amp; SKPD
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-slate-200 rounded-lg">
            <thead>
              <tr className="bg-primary-600 border-b border-slate-200 font-label text-xs font-medium text-slate-900">
                <th className="p-3 border-r border-slate-200">No</th>
                <th className="p-3 border-r border-slate-200">Nama Dinas / SKPD</th>
                <th className="p-3 border-r border-slate-200">Wilayah</th>
                <th className="p-3 border-r border-slate-200">Total Laporan</th>
                <th className="p-3 border-r border-slate-200">Terselesaikan</th>
                <th className="p-3">Skor Respon</th>
              </tr>
            </thead>
            <tbody className="font-body text-xs divide-y-2 divide-[#1a1a1a]">
              <tr className="hover:bg-white">
                <td className="p-3 font-bold border-r border-slate-200">1</td>
                <td className="p-3 font-bold border-r border-slate-200">Dinas Bina Marga DKI Jakarta</td>
                <td className="p-3 border-r border-slate-200">Jakarta</td>
                <td className="p-3 border-r border-slate-200">640</td>
                <td className="p-3 font-bold text-green-600 border-r border-slate-200">582 (91%)</td>
                <td className="p-3 font-bold text-primary-600">9.6 / 10</td>
              </tr>
              <tr className="hover:bg-white">
                <td className="p-3 font-bold border-r border-slate-200">2</td>
                <td className="p-3 font-bold border-r border-slate-200">Dinas Lingkungan Hidup & Kehutanan</td>
                <td className="p-3 border-r border-slate-200">Yogyakarta</td>
                <td className="p-3 border-r border-slate-200">320</td>
                <td className="p-3 font-bold text-green-600 border-r border-slate-200">285 (89%)</td>
                <td className="p-3 font-bold text-primary-600">9.4 / 10</td>
              </tr>
              <tr className="hover:bg-white">
                <td className="p-3 font-bold border-r border-slate-200">3</td>
                <td className="p-3 font-bold border-r border-slate-200">DSDABM Kota Bandung</td>
                <td className="p-3 border-r border-slate-200">Bandung</td>
                <td className="p-3 border-r border-slate-200">450</td>
                <td className="p-3 font-bold text-green-600 border-r border-slate-200">392 (87%)</td>
                <td className="p-3 font-bold text-primary-600">9.1 / 10</td>
              </tr>
              <tr className="hover:bg-white">
                <td className="p-3 font-bold border-r border-slate-200">4</td>
                <td className="p-3 font-bold border-r border-slate-200">Dinas Sumber Daya Air & Drainase</td>
                <td className="p-3 border-r border-slate-200">Surabaya</td>
                <td className="p-3 border-r border-slate-200">510</td>
                <td className="p-3 font-bold text-green-600 border-r border-slate-200">430 (84%)</td>
                <td className="p-3 font-bold text-primary-600">8.8 / 10</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
