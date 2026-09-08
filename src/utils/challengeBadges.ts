import { Report } from '../types';

// ===================== CHALLENGE MINGGUAN WARGA =====================
// Aturan (sesuai request):
// - Setiap MINGGU (Senin-Minggu) warga bikin >=3 laporan sendiri  -> 1 Bintang Kecil
// - Setiap 2 minggu, kalau 2 minggu itu berhasil semua            -> 1 Bintang Super Duper
// - Setiap bulan, kalau SEMUA minggu di bulan itu berhasil semua  -> 1 Mahkota
// Semua dihitung murni dari r.timestamp & r.userId yang sudah ada di data laporan,
// jadi tidak perlu kolom/tabel database baru.

export interface ChallengeProgress {
  weeklyStars: number;
  superStars: number;
  crowns: number;
  currentWeekCount: number;
  currentWeekGoal: number;
}

const WEEKLY_GOAL = 3;
const DAY_MS = 24 * 60 * 60 * 1000;

// Tengah malam lokal dari sebuah tanggal (biar perbandingan hari konsisten)
function startOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

// Senin di minggu yang sama dengan tanggal d (minggu = Senin - Minggu)
function getWeekMonday(d: Date): Date {
  const day = startOfLocalDay(d);
  const dow = day.getDay(); // 0 = Minggu, 1 = Senin, ... 6 = Sabtu
  const diff = dow === 0 ? -6 : 1 - dow;
  day.setDate(day.getDate() + diff);
  return day;
}

function weekKeyOf(monday: Date): string {
  return `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, '0')}-${String(
    monday.getDate()
  ).padStart(2, '0')}`;
}

// Semua tanggal Senin yang jatuh di bulan (year, month) tertentu — month 0-indexed
function getMondaysInMonth(year: number, month: number): Date[] {
  const mondays: Date[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day);
    if (d.getDay() === 1) mondays.push(d);
  }
  return mondays;
}

export function getChallengeProgress(myCreatedReports: Report[]): ChallengeProgress {
  const weekCounts: Record<string, number> = {};
  const weekMondayOf: Record<string, Date> = {};

  for (const r of myCreatedReports) {
    if (!r.timestamp) continue;
    const monday = getWeekMonday(new Date(r.timestamp));
    const key = weekKeyOf(monday);
    weekCounts[key] = (weekCounts[key] || 0) + 1;
    if (!weekMondayOf[key]) weekMondayOf[key] = monday;
  }

  const isWeekSuccess = (key: string) => (weekCounts[key] || 0) >= WEEKLY_GOAL;
  const allWeekKeys = Object.keys(weekMondayOf).sort(
    (a, b) => weekMondayOf[a].getTime() - weekMondayOf[b].getTime()
  );
  const weeklyStars = allWeekKeys.filter(isWeekSuccess).length;

  // --- Bintang Super Duper: pasangan 2 minggu berurutan, dihitung dari minggu
  // pertama warga itu mulai bikin laporan (biar adil buat yang baru gabung belakangan) ---
  let superStars = 0;
  if (allWeekKeys.length > 0) {
    const firstMonday = weekMondayOf[allWeekKeys[0]];
    const weekIndexOf = (key: string) =>
      Math.round((weekMondayOf[key].getTime() - firstMonday.getTime()) / (7 * DAY_MS));
    const maxIndex = Math.max(...allWeekKeys.map(weekIndexOf));

    for (let pairStart = 0; pairStart <= maxIndex; pairStart += 2) {
      const monday1 = new Date(firstMonday);
      monday1.setDate(monday1.getDate() + pairStart * 7);
      const monday2 = new Date(firstMonday);
      monday2.setDate(monday2.getDate() + (pairStart + 1) * 7);
      if (isWeekSuccess(weekKeyOf(monday1)) && isWeekSuccess(weekKeyOf(monday2))) {
        superStars++;
      }
    }
  }

  // --- Mahkota: SEMUA minggu (Senin) di satu bulan kalender harus berhasil ---
  const monthCandidates = new Set<string>(); // "YYYY-M" (M = 0-indexed)
  for (const key of allWeekKeys) {
    const monday = weekMondayOf[key];
    monthCandidates.add(`${monday.getFullYear()}-${monday.getMonth()}`);
  }
  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${now.getMonth()}`;

  let crowns = 0;
  for (const monthKey of monthCandidates) {
    if (monthKey === currentMonthKey) continue; // bulan berjalan belum final, jangan dihitung dulu
    const [yearStr, monthStr] = monthKey.split('-');
    const mondays = getMondaysInMonth(Number(yearStr), Number(monthStr));
    if (mondays.length === 0) continue;
    const allSuccess = mondays.every((m) => isWeekSuccess(weekKeyOf(m)));
    if (allSuccess) crowns++;
  }

  // Progress minggu yang sedang berjalan (buat ditampilkan real-time)
  const currentWeekKey = weekKeyOf(getWeekMonday(now));
  const currentWeekCount = weekCounts[currentWeekKey] || 0;

  return { weeklyStars, superStars, crowns, currentWeekCount, currentWeekGoal: WEEKLY_GOAL };
}
