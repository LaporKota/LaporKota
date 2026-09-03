import React from 'react';
import { CivicNotification } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: CivicNotification[];
  onMarkAllRead: () => void;
  onSelectNotification: (reportId: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onSelectNotification,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px] text-slate-900">notifications</span>
            <h3 className="font-headline text-lg font-semibold tracking-tight">
              PEMBERITAHUAN KOTA ({notifications.filter((n) => !n.isRead).length} BARU)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 bg-white border border-slate-200 rounded-lg font-bold text-sm flex items-center justify-center hover:bg-rose-500 hover:text-white shadow-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Action bar */}
        <div className="bg-white border-b border-slate-200 px-4 py-2 flex justify-between items-center text-xs font-label">
          <span className="text-slate-500 font-semibold">Aktivitas Laporan Anda &amp; Sekitar</span>
          <button
            onClick={onMarkAllRead}
            className="text-primary-600 hover:underline font-bold uppercase cursor-pointer"
          >
            Tandai Semua Dibaca
          </button>
        </div>

        {/* List */}
        <div className="p-4 overflow-y-auto flex flex-col gap-3">
          {notifications.length === 0 ? (
            <p className="text-center font-body text-xs text-slate-500 py-8">
              Tidak ada pemberitahuan baru saat ini.
            </p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  onSelectNotification(n.reportId);
                  onClose();
                }}
                className={`p-3 border border-slate-200 rounded-lg flex flex-col gap-1 cursor-pointer transition-all hover:translate-x-1 ${
                  n.isRead
                    ? 'bg-white'
                    : 'bg-rose-50 shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-label text-xs font-medium text-slate-900">
                    {n.title}
                  </span>
                  <span className="font-body text-[10px] text-slate-500">{n.timeAgo}</span>
                </div>
                <p className="font-body text-xs text-slate-900 leading-tight">{n.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
