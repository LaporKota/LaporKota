import React, { useState } from 'react';
import { Report, ReportStatus } from '../types';

interface ReportDetailModalProps {
  report: Report | null;
  onClose: () => void;
  onToggleUpvote: (reportId: string, e: React.MouseEvent) => void;
  onUpdateStatus: (reportId: string, newStatus: ReportStatus, note: string) => void;
  onAddComment: (reportId: string, commentText: string) => void;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  report,
  onClose,
  onToggleUpvote,
  onUpdateStatus,
  onAddComment,
}) => {
  const [commentInput, setCommentInput] = useState('');
  const [statusUpdateNote, setStatusUpdateNote] = useState('');
  const [selectedNewStatus, setSelectedNewStatus] = useState<ReportStatus>('diproses');
  const [showStatusForm, setShowStatusForm] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!report) return null;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    onAddComment(report.id, commentInput.trim());
    setCommentInput('');
  };

  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusUpdateNote.trim()) return;
    onUpdateStatus(report.id, selectedNewStatus, statusUpdateNote.trim());
    setStatusUpdateNote('');
    setShowStatusForm(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-xl shadow-xl w-full max-w-3xl my-8 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Topbar */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-label text-xs font-medium text-slate-500">
              LAPORAN #{report.id.toUpperCase()}
            </span>
            <span className="text-slate-900">•</span>
            <span
              className={`text-[11px] px-2 py-0.5 border border-slate-200 font-bold uppercase ${
                report.status === 'baru'
                  ? 'bg-primary-600 text-white'
                  : report.status === 'diproses'
                  ? 'bg-primary-600 text-white'
                  : 'bg-green-600 text-white'
              }`}
            >
              {report.status}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 bg-white border border-slate-200 rounded-lg font-bold text-base flex items-center justify-center hover:bg-rose-500 hover:text-white shadow-sm active:scale-95 cursor-pointer"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-6">
          {/* Main Photo Banner */}
          <div className="relative h-64 sm:h-80 w-full border border-slate-200 rounded-xl shadow-md overflow-hidden bg-slate-100">
            <img
              src={report.imageUrl}
              alt={report.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-primary-600 border border-slate-200 rounded-lg px-3 py-1 text-xs font-label font-bold uppercase shadow-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">{report.categoryIcon}</span>
              {report.categoryLabel}
            </div>
            <div className="absolute bottom-3 right-3 bg-slate-900 text-white px-2.5 py-1 text-xs font-label uppercase font-bold border border-white">
              Prioritas: {report.priority}
            </div>
          </div>

          {/* Title & Metadata */}
          <div className="flex flex-col gap-2">
            <h2 className="font-headline text-2xl sm:text-3xl font-bold uppercase tracking-tight text-slate-900">
              {report.title}
            </h2>

            <div className="flex flex-wrap gap-4 text-xs font-label text-slate-500 border-b border-slate-200 pb-3">
              <span className="flex items-center gap-1 text-slate-900 font-bold">
                <span className="material-symbols-outlined text-[18px]">location_on</span>
                {report.location} ({report.city})
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[18px]">schedule</span>
                {report.timeAgo}
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[18px]">person</span>
                Pelapor: {report.reporterName}
              </span>
              {report.departmentAssigned && (
                <span className="flex items-center gap-1 text-primary-600 font-bold">
                  <span className="material-symbols-outlined text-[18px]">account_balance</span>
                  {report.departmentAssigned}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <h4 className="font-label text-xs font-medium text-slate-900 mb-1">
              DESKRIPSI KELUHAN
            </h4>
            <p className="font-body text-sm text-slate-900 leading-relaxed whitespace-pre-line">
              {report.description}
            </p>
          </div>

          {/* Interactive Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3 shadow-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => onToggleUpvote(report.id, e)}
                className={`px-4 py-2 border border-slate-200 rounded-lg font-label text-sm font-medium flex items-center gap-2 transition-all active:scale-95 cursor-pointer ${
                  report.hasUpvoted
                    ? 'bg-rose-50 shadow-sm'
                    : 'bg-white hover:bg-rose-50 shadow-sm'
                }`}
              >
                <span className={`material-symbols-outlined text-[18px] ${report.hasUpvoted ? 'fill text-rose-500' : ''}`}>
                  thumb_up
                </span>
                {report.hasUpvoted ? 'Didukung (' + report.upvotes + ')' : 'Dukung (' + report.upvotes + ')'}
              </button>

              <button
                onClick={handleCopyLink}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg font-label text-xs font-medium shadow-sm hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">share</span>
                {copiedLink ? 'Link Tersalin!' : 'Bagikan'}
              </button>
            </div>

            {/* Officer / Admin Simulation Button */}
            <button
              onClick={() => setShowStatusForm(!showStatusForm)}
              className="px-3 py-2 bg-primary-600 border border-slate-200 rounded-lg font-label text-xs font-medium shadow-sm hover:bg-primary-700 flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
              {showStatusForm ? 'Tutup Panel Petugas' : 'Update Status (Mode Petugas)'}
            </button>
          </div>

          {/* Status Update Form (Officer Simulation) */}
          {showStatusForm && (
            <form onSubmit={handleStatusSubmit} className="bg-yellow-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3 shadow-md">
              <div className="font-label text-xs font-medium text-slate-900 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-primary-600">engineering</span>
                SIMULASI TINDAK LANJUT DINAS TERKAIT
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <span className="font-label text-xs font-bold text-slate-900">Ubah Status Menjadi:</span>
                <select
                  value={selectedNewStatus}
                  onChange={(e) => setSelectedNewStatus(e.target.value as ReportStatus)}
                  className="border border-slate-200 rounded-lg bg-white px-2.5 py-1 text-xs font-label font-bold"
                >
                  <option value="baru">Baru</option>
                  <option value="diproses">Diproses (Penanganan Tim)</option>
                  <option value="selesai">Selesai (Tuntas & Bersih)</option>
                </select>
              </div>
              <textarea
                required
                rows={2}
                placeholder="Tuliskan catatan progres atau verifikasi lapangan (misal: armada dikerahkan / perbaikan selesai)..."
                value={statusUpdateNote}
                onChange={(e) => setStatusUpdateNote(e.target.value)}
                className="border border-slate-200 rounded-lg p-2 bg-white text-xs font-body resize-none"
              />
              <button
                type="submit"
                className="self-start bg-primary-600 text-white border border-slate-200 rounded-lg px-4 py-1.5 font-label text-xs font-medium shadow-sm hover:bg-primary-700 cursor-pointer"
              >
                Kirim Pembaharuan Status
              </button>
            </form>
          )}

          {/* Timeline of Updates */}
          <div className="flex flex-col gap-3">
            <h4 className="font-headline text-lg font-semibold tracking-tight border-b border-slate-200 pb-1 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[20px]">history</span>
              TIMELINE PENANGANAN &amp; VERIFIKASI
            </h4>

            <div className="flex flex-col gap-3 pl-2">
              {report.updates.map((upd, idx) => (
                <div key={upd.id || idx} className="relative pl-6 pb-2 border-l-3 border-slate-200">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 bg-primary-600 border border-slate-200 rounded-lg"></div>
                  <div className="flex flex-wrap items-center justify-between gap-1 text-xs font-label">
                    <span className="font-bold text-slate-900">{upd.author} ({upd.role})</span>
                    <span className="text-slate-500">{upd.date}</span>
                  </div>
                  <p className="font-body text-xs text-slate-900 mt-1 bg-white p-2 border border-slate-200">
                    {upd.message}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Citizen Comments Section */}
          <div className="flex flex-col gap-3 border-t-2 border-slate-200 pt-4">
            <h4 className="font-headline text-lg font-semibold tracking-tight flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[20px]">forum</span>
              KOMENTAR &amp; TANGGAPAN WARGA ({report.comments.length})
            </h4>

            {/* Comment List */}
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
              {report.comments.length === 0 ? (
                <p className="font-body text-xs text-slate-500 italic">Belum ada tanggapan. Jadilah warga pertama yang berkomentar!</p>
              ) : (
                report.comments.map((c) => (
                  <div
                    key={c.id}
                    className={`p-3 border border-slate-200 rounded-lg text-xs ${
                      c.isOfficial ? 'bg-primary-100' : 'bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-label font-bold text-slate-900 flex items-center gap-1">
                        {c.userName}
                        {c.isOfficial && (
                          <span className="bg-primary-600 text-white text-[9px] px-1 py-0.2 font-bold uppercase border border-slate-200">
                            Official
                          </span>
                        )}
                      </span>
                      <span className="font-body text-[10px] text-slate-500">{c.timestamp}</span>
                    </div>
                    <p className="font-body text-slate-900">{c.content}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment Input */}
            <form onSubmit={handleCommentSubmit} className="flex gap-2 mt-2">
              <input
                type="text"
                required
                placeholder="Tulis tanggapan atau informasi tambahan..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="flex-grow border border-slate-200 rounded-lg p-2 bg-white text-xs font-body outline-none shadow-[inset_1px_1px_0px_0px_rgba(0,0,0,0.1)]"
              />
              <button
                type="submit"
                className="bg-slate-900 text-white border border-slate-200 rounded-lg px-4 py-2 font-label text-xs font-medium hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-sm active:scale-95 cursor-pointer"
              >
                Kirim
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
