import { Report, ReportCategory } from '../types';

export interface CivicBadge {
  emoji: string;
  label: string;
  colorClass: string; // kelas Tailwind buat background pill
}

// Tier reputasi umum berdasarkan skor aktivitas warga (dibuat + didukung + tuntas)
// Temanya "civic hero" perkotaan — cocok sama identitas LaporKota (SDG 11 & pemantauan kota)
export function getReputationTier(score: number): CivicBadge {
  if (score >= 30) return { emoji: '🏆', label: 'Pahlawan Kota', colorClass: 'bg-yellow-400 text-slate-900' };
  if (score >= 15) return { emoji: '🚦', label: 'Garda Infrastruktur', colorClass: 'bg-primary-600 text-white' };
  if (score >= 5) return { emoji: '🔧', label: 'Montir Kota', colorClass: 'bg-primary-600 text-white' };
  if (score >= 1) return { emoji: '🚶', label: 'Penjaga Trotoar', colorClass: 'bg-slate-900 text-white' };
  return { emoji: '🌱', label: 'Bibit Warga', colorClass: 'bg-slate-200 text-slate-900' };
}

// Sticker spesialisasi — dipicu kalau warga sudah 3x+ lapor kategori yang sama
const CATEGORY_BADGE: Record<ReportCategory, CivicBadge> = {
  kebersihan: { emoji: '🗑️', label: 'Spesialis Kebersihan', colorClass: 'bg-rose-500 text-white' },
  drainase: { emoji: '💧', label: 'Spesialis Drainase', colorClass: 'bg-sky-500 text-white' },
  infrastruktur: { emoji: '🚧', label: 'Spesialis Infrastruktur', colorClass: 'bg-amber-500 text-slate-900' },
  penerangan: { emoji: '💡', label: 'Spesialis Penerangan', colorClass: 'bg-amber-400 text-slate-900' },
  ruang_hijau: { emoji: '🌳', label: 'Spesialis Ruang Hijau', colorClass: 'bg-green-600 text-white' },
  fasilitas: { emoji: '🚏', label: 'Spesialis Fasilitas Umum', colorClass: 'bg-indigo-500 text-white' },
  lainnya: { emoji: '⭐', label: 'Kontributor Aktif', colorClass: 'bg-slate-700 text-white' },
};

export function getSpecialistBadge(myCreatedReports: Report[]): CivicBadge | null {
  const counts: Partial<Record<ReportCategory, number>> = {};
  for (const r of myCreatedReports) {
    counts[r.category] = (counts[r.category] || 0) + 1;
  }
  let topCategory: ReportCategory | null = null;
  let topCount = 0;
  for (const [cat, count] of Object.entries(counts)) {
    if ((count as number) > topCount) {
      topCount = count as number;
      topCategory = cat as ReportCategory;
    }
  }
  if (topCategory && topCount >= 3) {
    return CATEGORY_BADGE[topCategory];
  }
  return null;
}

// Sticker perayaan random — muncul di layar sukses setelah warga berhasil mengirim laporan.
// Bukan reputasi permanen, cuma "hadiah" kecil biar momen kirim laporan berasa lebih hidup.
const CELEBRATION_BADGES: CivicBadge[] = [
  { emoji: '🎉', label: 'Warga Peduli Kota!', colorClass: 'bg-primary-600 text-white' },
  { emoji: '🦸', label: 'Aksi Kecil, Dampak Besar!', colorClass: 'bg-yellow-400 text-slate-900' },
  { emoji: '🏅', label: 'Pejuang Lapor Hari Ini', colorClass: 'bg-slate-900 text-white' },
  { emoji: '🌟', label: 'Mata & Telinga Kota', colorClass: 'bg-amber-400 text-slate-900' },
  { emoji: '📢', label: 'Suara Warga Didengar!', colorClass: 'bg-rose-500 text-white' },
  { emoji: '💪', label: 'Kota Lebih Baik Dimulai Darimu', colorClass: 'bg-green-600 text-white' },
  { emoji: '🛡️', label: 'Garda Depan Lingkungan', colorClass: 'bg-sky-500 text-white' },
];

export function getRandomCelebrationBadge(): CivicBadge {
  return CELEBRATION_BADGES[Math.floor(Math.random() * CELEBRATION_BADGES.length)];
}
