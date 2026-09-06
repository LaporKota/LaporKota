import React, { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Report, User } from '../types';
import { Award } from 'lucide-react';
import { getReputationTier, getSpecialistBadge } from '../utils/civicBadges';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  reports: Report[];
  onSelectReport: (report: Report) => void;
  user: User | null;
  onUpdateUser: (updatedUser: User) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  reports,
  onSelectReport,
  user,
  onUpdateUser,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDomicile, setEditDomicile] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatarPreview, setEditAvatarPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !user) return null;

  const authHeaders = (): Record<string, string> => {
    const token = localStorage.getItem('token');
    return token
      ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
      : { 'Content-Type': 'application/json' };
  };

  const startEditing = () => {
    setEditName(user.name);
    setEditDomicile(user.domicile || '');
    setEditBio(user.bio || '');
    setEditAvatarPreview(user.avatarUrl || null);
    setIsEditing(true);
  };

  const handleAvatarFile = (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran foto maksimal 2MB ya.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setEditAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    if (!editName.trim()) {
      toast.error('Nama tidak boleh kosong.');
      return;
    }
    setIsSaving(true);
    fetch('/api/auth/profile', {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({
        name: editName.trim(),
        domicile: editDomicile.trim(),
        bio: editBio.trim(),
        avatarUrl: editAvatarPreview,
      }),
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) {
          toast.error(data.error || 'Gagal menyimpan profil');
          return;
        }
        onUpdateUser(data.user);
        setIsEditing(false);
        toast.success('Profil berhasil diperbarui!');
      })
      .catch(() => toast.error('Terjadi kesalahan jaringan'))
      .finally(() => setIsSaving(false));
  };

  // Real logic based on user interaction
  const reportsCreated = reports.filter((r) => r.userId === user.id);
  const reportsUpvoted = reports.filter((r) => r.upvotedBy?.includes(user.id));
  const reportsResolved = reportsCreated.filter((r) => r.status === 'selesai');

  // Combine and deduplicate myReports for the recent list
  const myReportsSet = new Set([...reportsCreated, ...reportsUpvoted]);
  const myReports = Array.from(myReportsSet).sort((a, b) => b.timestamp - a.timestamp);

  // Sticker/badge civic — tema disesuaikan sama identitas LaporKota
  const reputationScore = reportsCreated.length * 2 + reportsResolved.length * 3 + reportsUpvoted.length * 1;
  const reputationBadge = getReputationTier(reputationScore);
  const specialistBadge = getSpecialistBadge(reportsCreated);

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px] text-slate-900">account_circle</span>
            <h3 className="font-headline text-lg font-semibold tracking-tight">
              PROFIL WARGA &amp; REPUTASI CIVIC
            </h3>
          </div>
          <button
            onClick={() => {
              setIsEditing(false);
              onClose();
            }}
            className="w-7 h-7 bg-white border border-slate-200 rounded-lg font-bold text-sm flex items-center justify-center hover:bg-rose-500 hover:text-white shadow-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex flex-col gap-5">
          {!isEditing ? (
            <>
              {/* Profile Card Summary */}
              <div className="bg-primary-600 border border-slate-200 rounded-xl p-4 shadow-md flex items-center gap-4">
                <div className="w-14 h-14 bg-white border border-slate-200 rounded-lg flex items-center justify-center font-headline text-2xl font-bold shrink-0 overflow-hidden">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    getInitials(user.name)
                  )}
                </div>
                <div className="overflow-hidden flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-headline text-lg font-semibold truncate">{user.name}</h4>
                    <span className="bg-primary-600 text-white text-[10px] font-bold uppercase px-1.5 py-0.5 border border-slate-200">
                      Verified {user.role === 'admin' ? 'Admin' : 'Warga'}
                    </span>
                  </div>
                  <p className="font-body text-xs text-slate-900 mt-0.5 truncate">
                    Domisili: {user.domicile || 'Belum diisi'}
                  </p>
                  {reportsResolved.length > 0 && (
                    <div className="inline-flex items-center gap-1 mt-1 bg-white border border-slate-200 px-2 py-0.5 font-label text-[10px] font-medium">
                      <Award size={12} /> SDG 11 Civic Champion
                    </div>
                  )}
                </div>
                <button
                  onClick={startEditing}
                  className="shrink-0 w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center hover:bg-slate-100 shadow-sm cursor-pointer"
                  title="Edit Profil"
                >
                  <span className="material-symbols-outlined text-[16px] text-slate-900">edit</span>
                </button>
              </div>

              {/* Bio */}
              {user.bio && (
                <p className="font-body text-xs text-slate-500 italic -mt-2 px-1">"{user.bio}"</p>
              )}

              {/* Sticker / Badge Civic */}
              <div className="flex flex-wrap gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-slate-200 font-label text-[11px] font-bold shadow-sm ${reputationBadge.colorClass}`}
                >
                  <span className="text-sm leading-none">{reputationBadge.emoji}</span>
                  {reputationBadge.label}
                </span>
                {specialistBadge && (
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-slate-200 font-label text-[11px] font-bold shadow-sm ${specialistBadge.colorClass}`}
                  >
                    <span className="text-sm leading-none">{specialistBadge.emoji}</span>
                    {specialistBadge.label}
                  </span>
                )}
              </div>

              {/* Stats Metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white border border-slate-200 rounded-lg p-3 text-center shadow-sm">
                  <span className="font-label text-[10px] font-medium text-slate-500">Dibuat</span>
                  <div className="font-headline text-2xl font-bold text-slate-900">
                    {reportsCreated.length}
                  </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-3 text-center shadow-sm">
                  <span className="font-label text-[10px] font-medium text-slate-500">Didukung</span>
                  <div className="font-headline text-2xl font-bold text-primary-600">
                    {reportsUpvoted.length}
                  </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-3 text-center shadow-sm">
                  <span className="font-label text-[10px] font-medium text-slate-500">Tuntas</span>
                  <div className="font-headline text-2xl font-bold text-green-600">
                    {reportsResolved.length}
                  </div>
                </div>
              </div>

              {/* My Active Reports & Contributions */}
              <div className="flex flex-col gap-2">
                <h5 className="font-headline text-sm font-semibold border-b border-slate-200 pb-1">
                  LAPORAN &amp; DUKUNGAN TERKINI
                </h5>
                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                  {myReports.length === 0 ? (
                    <div className="text-center p-4 font-body text-sm text-slate-500 bg-white border border-slate-200 rounded-lg border-dashed">
                      Belum ada laporan atau dukungan saat ini.
                    </div>
                  ) : (
                    myReports.map((r) => (
                      <div
                        key={r.id}
                        onClick={() => {
                          onSelectReport(r);
                          onClose();
                        }}
                        className="p-2.5 border border-slate-200 rounded-lg bg-white hover:bg-rose-50 transition-colors cursor-pointer flex justify-between items-center text-xs"
                      >
                        <div className="truncate pr-2">
                          <div className="font-label font-bold text-slate-900 truncate">{r.title}</div>
                          <div className="font-body text-[11px] text-slate-500 truncate">
                            {r.location} {r.userId === user.id ? '(Pelapor)' : '(Didukung)'}
                          </div>
                        </div>
                        <span
                          className={`shrink-0 px-2 py-0.5 font-bold uppercase text-[10px] border border-slate-200 ${
                            r.status === 'baru'
                              ? 'bg-primary-600 text-white'
                              : r.status === 'diproses'
                              ? 'bg-primary-600 text-white'
                              : 'bg-green-600 text-white'
                          }`}
                        >
                          {r.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Edit Profile Form */}
              <div className="flex flex-col items-center gap-2 pb-2 border-b border-slate-200">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleAvatarFile(file);
                  }}
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-20 h-20 bg-primary-600 border border-slate-200 rounded-lg flex items-center justify-center font-headline text-3xl font-bold cursor-pointer overflow-hidden group shadow-md"
                >
                  {editAvatarPreview ? (
                    <img src={editAvatarPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    getInitials(editName || user.name)
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-[20px]">photo_camera</span>
                  </div>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="font-label text-[11px] font-bold text-primary-600 uppercase cursor-pointer hover:underline"
                >
                  Ganti Foto Profil
                </button>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label text-xs uppercase font-bold text-slate-900">Nama</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="border border-slate-200 rounded-lg p-2.5 font-body text-sm bg-white shadow-inner outline-none focus:border-primary-600"
                  placeholder="Nama lengkap"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label text-xs uppercase font-bold text-slate-900">Domisili</label>
                <input
                  type="text"
                  value={editDomicile}
                  onChange={(e) => setEditDomicile(e.target.value)}
                  className="border border-slate-200 rounded-lg p-2.5 font-body text-sm bg-white shadow-inner outline-none focus:border-primary-600"
                  placeholder="Kota domisili"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label className="font-label text-xs uppercase font-bold text-slate-900">Bio Singkat</label>
                  <span className="text-[10px] text-slate-400">{editBio.length}/200</span>
                </div>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value.slice(0, 200))}
                  rows={3}
                  className="border border-slate-200 rounded-lg p-2.5 font-body text-sm bg-white shadow-inner outline-none resize-none focus:border-primary-600"
                  placeholder="Ceritain sedikit tentang kamu atau kepedulian kamu ke kota ini..."
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-lg font-label text-xs font-bold uppercase bg-white hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="flex-1 py-2.5 bg-primary-600 text-white rounded-lg font-label text-xs font-bold uppercase hover:bg-primary-700 shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Profil'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
