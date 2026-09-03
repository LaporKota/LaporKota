import React, { useState } from 'react';
import { Report } from '../types';
import { ClipboardList, MapPin, Clock, Users, Phone } from 'lucide-react';

interface VolunteerModalProps {
  report: Report | null;
  onClose: () => void;
  onConfirmVolunteer: (reportId: string, volunteerData: { name: string; phone: string; role: string }) => void;
}

export const VolunteerModal: React.FC<VolunteerModalProps> = ({
  report,
  onClose,
  onConfirmVolunteer,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Tenaga Pembersih & Gotong Royong');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!report) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    onConfirmVolunteer(report.id, { name, phone, role });
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-slate-50 border border-slate-200 rounded-xl shadow-xl w-full max-w-xl my-auto relative overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-primary-600 border-b border-slate-200 p-4 sm:p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-slate-900">volunteer_activism</span>
            <span className="font-headline text-lg sm:text-xl font-bold uppercase text-slate-900 tracking-tight">
              IKUT AKSI RELAWAN GOTONG ROYONG
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 border border-slate-200 rounded-lg bg-white hover:bg-rose-50 text-slate-900 font-bold text-base flex items-center justify-center shadow-sm active:scale-95 cursor-pointer"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        {isSuccess ? (
          /* Success State */
          <div className="p-6 sm:p-8 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 bg-primary-600 border border-slate-200 rounded-xl flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-3xl text-slate-900">check_circle</span>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-headline text-2xl font-semibold text-slate-900">
                TERIMA KASIH, {name.toUpperCase()}!
              </h3>
              <p className="font-body text-sm text-slate-500 max-w-md">
                Anda telah resmi terdaftar dalam aksi relawan untuk menangani <span className="font-bold text-slate-900">"{report.title}"</span>.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-4 w-full text-left flex flex-col gap-2 shadow-sm">
              <div className="font-label text-xs font-medium text-primary-600 flex items-center gap-1.5">
                <ClipboardList size={16} /> Rincian Jadwal Aksi Komunitas:
              </div>
              <div className="font-body text-xs text-slate-900 space-y-2">
                <p className="flex items-center gap-2"><MapPin size={14} className="shrink-0" /> <span><strong>Titik Kumpul:</strong> {report.location}</span></p>
                <p className="flex items-center gap-2"><Clock size={14} className="shrink-0" /> <span><strong>Waktu:</strong> {report.volunteerActionDate || 'Sabtu Pagi, 07:30 WIB'}</span></p>
                <p className="flex items-center gap-2"><Users size={14} className="shrink-0" /> <span><strong>Peran Anda:</strong> {role}</span></p>
                <p className="flex items-start gap-2"><Phone size={14} className="shrink-0 mt-0.5" /> <span><strong>Konfirmasi WA:</strong> Link grup koordinasi lapangan telah dikirim ke nomor {phone}</span></p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-2 w-full bg-primary-50 text-primary-700 border border-slate-200 rounded-lg py-3 font-headline text-base uppercase font-bold hover:bg-slate-100 hover:text-slate-900 transition-all shadow-md cursor-pointer"
            >
              SELESAI &amp; KEMBALI KE LAPORAN
            </button>
          </div>
        ) : (
          /* Volunteer Sign Up Form */
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 flex flex-col gap-5 overflow-y-auto max-h-[80vh]">
            {/* Target Issue Highlight */}
            <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex gap-3 items-center shadow-sm">
              <img 
                src={report.imageUrl} 
                alt={report.title}
                className="w-16 h-16 object-cover border border-slate-200 rounded-lg shrink-0" 
              />
              <div className="flex flex-col gap-0.5 overflow-hidden">
                <span className="font-label text-[10px] font-medium text-primary-600">
                  Aksi Kolaborasi Publik #{report.id}
                </span>
                <h4 className="font-headline text-sm font-bold text-slate-900 uppercase truncate">
                  {report.title}
                </h4>
                <p className="font-body text-xs text-slate-500 truncate">
                  📍 {report.location}
                </p>
              </div>
            </div>

            {/* Volunteer Stats Info */}
            <div className="bg-primary-600 border border-slate-200 rounded-lg p-3 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-slate-900">group</span>
                <span className="font-label text-xs font-medium text-slate-900">
                  Total Relawan Terdaftar:
                </span>
              </div>
              <span className="font-headline text-base font-bold bg-white border border-slate-200 px-2 py-0.5 text-slate-900">
                {(report.volunteerCount || 0) + (report.userJoinedVolunteer ? 0 : 0)} Warga
              </span>
            </div>

            {/* Form Inputs */}
            <div className="flex flex-col gap-3">
              <div>
                <label className="block font-label text-xs font-medium text-slate-900 mb-1">
                  Nama Lengkap Relawan *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan nama lengkap Anda"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg bg-white p-2.5 font-body text-sm text-slate-900 focus:bg-slate-50 focus:outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="block font-label text-xs font-medium text-slate-900 mb-1">
                  Nomor WhatsApp Aktif *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Nomor handphone yang aktif"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg bg-white p-2.5 font-body text-sm text-slate-900 focus:bg-slate-50 focus:outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="block font-label text-xs font-medium text-slate-900 mb-1">
                  Pilihan Peran Relawan
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg bg-white p-2.5 font-label text-xs font-medium text-slate-900 focus:outline-none shadow-sm cursor-pointer"
                >
                  <option value="Tenaga Pembersih & Gotong Royong">Tenaga Pembersih &amp; Angkut Sampah</option>
                  <option value="Koordinator Lapangan & Keselamatan">Koordinator Lapangan &amp; Safety</option>
                  <option value="Logistik & Perlengkapan Warga">Logistik, Trashbag &amp; Sarung Tangan</option>
                  <option value="Konsumsi & Air Minum Relawan">Konsumsi &amp; Dukungan Warga</option>
                  <option value="Dokumentasi & Publikasi Media">Dokumentasi Sebelum-Sesudah</option>
                </select>
              </div>

              <div>
                <label className="block font-label text-xs font-medium text-slate-900 mb-1">
                  Catatan / Alat yang Bisa Dibawa Sendiri (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Sebutkan peralatan yang bisa Anda bawa"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg bg-white p-2 font-body text-xs text-slate-900 focus:outline-none shadow-sm"
                />
              </div>
            </div>

            {/* Checklist guidelines */}
            <div className="bg-slate-100 border border-slate-200 rounded-lg p-3 text-xs font-body text-slate-500 space-y-1">
              <div className="font-label text-[11px] font-medium text-slate-900 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">info</span>
                Panduan Keselamatan Relawan
              </div>
              <p>• Gunakan alas kaki tertutup dan masker pelindung.</p>
              <p>• Aksi gotong royong berkoordinasi langsung dengan pengurus RT/RW setempat.</p>
            </div>

            {/* Submit CTA */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 bg-white border border-slate-200 rounded-lg py-2.5 font-label text-xs font-medium hover:bg-rose-50 transition-colors shadow-sm cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="w-2/3 bg-primary-600 text-white border border-slate-200 rounded-lg py-2.5 font-headline text-sm uppercase font-bold hover:bg-primary-700 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>GABUNG AKSI SEKARANG</span>
                <span className="material-symbols-outlined text-[18px]">handshake</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
