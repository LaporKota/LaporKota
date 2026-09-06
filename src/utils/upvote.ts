import { Report, User } from '../types';

// Menentukan apakah laporan ini SUDAH di-upvote oleh user yang sedang login.
// Sengaja TIDAK memakai `report.hasUpvoted` (field statis dari data awal) karena
// field itu sama untuk semua orang yang melihatnya — jadi kalau dipakai langsung,
// tombol like akan tampak merah untuk SEMUA pengunjung (termasuk yang belum login),
// padahal upvote itu seharusnya spesifik per akun.
//
// Sumber kebenarannya adalah `report.upvotedBy` (daftar id user yang sudah like),
// yang diisi & dijaga oleh server di endpoint POST /api/reports/:id/upvote.
export function isUpvotedByUser(report: Report, user: User | null | undefined): boolean {
  if (!user) return false;
  if (!report.upvotedBy || report.upvotedBy.length === 0) return false;
  return report.upvotedBy.includes(user.id);
}
