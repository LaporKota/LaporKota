import React, { useRef, useState } from 'react';
import { Report } from '../types';
import { CITIES } from '../data/cities';

export interface ReportLocationPrefill {
  lat: number;
  lng: number;
  city: string;
  address?: string;
}

interface CreateReportViewProps {
  onSubmitReport: (newReport: Partial<Report>) => void;
  onCancel: () => void;
  initialLocation: ReportLocationPrefill | null;
  onClearInitialLocation: () => void;
  onPickOnMap: () => void;
}

export const CreateReportView: React.FC<CreateReportViewProps> = ({
  onSubmitReport,
  onCancel,
  initialLocation,
  onClearInitialLocation,
  onPickOnMap,
}) => {
  const [judul, setJudul] = useState('');
  const [kategori, setKategori] = useState<string>('');
  const [deskripsi, setDeskripsi] = useState('');
  const [kota, setKota] = useState<string>(initialLocation?.city || CITIES[0].name);
  const [lokasi, setLokasi] = useState(initialLocation?.address || '');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUseSampleImage = (categoryType: string) => {
    const sampleImages: Record<string, string> = {
      sampah: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWr_lkpfQCI44JNAXYqVGOligdK6hKpa2qXvASY05dcYN1CuURLlcUnFmmexUoZNL1WR18HuYH97K4vYIPYyMgVlDEEmKAhGudGDu_O2e0D1fysBrtk7Q0JA9obSrTY2uTT8-khG8Cs_4t2B60wEMSLQGflPbV0kUVY06PUNY8ieDKTuSaS8_eYKyXIiP2RA_whGxHmUM88yCSFPM-R3giOEPjuIImwxerYR6wOASYEZWLm1Mfe5G_XQ',
      infrastruktur_jalan: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfwJRph6sfFILt6isCntY_ikP2Awvh53h1lah90xKwhpwV3WO8lWIasOKau4ML_JvlFw202bCxEMlAN3OwtJkEmb00wn8ctEASCUHXxMZm3W-p2z3yVCPPQb6WWp-ITHXhoNzq74iEkKs7gDTlnHHZO3vr9NfATBHtob3nDmcuwqPLqQExsNryDtWAObdbnJ4dGHYJ3IGFtLfB_7js3mqMQnhGghsT0lI94e_68ZmfMr4jA_BLy2fF9g',
      penerangan: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5AUTQTkCc0xWxXV3epX4-PU5zsI6grRTgdaYlr6fw6oCAZtVqQBeYZLXgJuBJuo42l394HVpGkyH1lmfJAtHlgLy4KmQ9aUbbuW-qTzNV1MQ4oiWiGFHtbh6O5ABTNWQ-5R4H0dz0I1RJfnq1TPBm2z8KG_MQxNZxb4VNLHj8wSB2ROiiPker9r8v27gL_DgLw__eKljfcoHFGgC01fhrJNiQty9PtZWboQ-MnxfaC8iCDb5VWVWrpg',
      drainase: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoZk0bpCla6hC9BfwKahestfAWIK6K3MSEDOOdUAR3qRC7sTWJOZkVpxO4WaQdbz7T6P3tuYRX2yE9iORQTH9teBIyxyGDEbOSBUWMFlM2JKBfSLFrsfr0CrOhXYgkneuQj40QCdWhkOFNTQKCMf0MP5zOmFg5LIQ7vz6gJ8hg8re6jcgIv246unBgUEjvVSSs70ex4yU6W7MtEvmZ9TK7RNpVh-w3_y0tbWgn0mVvvPDkl9SUDbA4cA',
      ruang_hijau: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2gQqFQHEQO9HX3UCRwGaSP7MU4VgOee0yugmDuuAr14tRs3qRb88LovdflUICNqxBg3T9FPySoebOY6o9ik9eDZwP2xVQKoC90lUX-If4yFZ7NKelIjbA6RavMDooLQ3qrcc15jlRMhnsrE9OziQbGvGDmh0F-bqatoH4xJ1rOhVqflw9sNYjNxtbEw_5ugcIaxXPqgiLNybssn1eRuF_ET_JP6pzFcXyKbCdWKvjoV6arXypXvTwHw',
    };
    setPhotoPreview(sampleImages[categoryType] || sampleImages.sampah);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul || !kategori || !deskripsi || !lokasi || !kota) return;

    setIsSubmitting(true);

    const categoryMap: Record<string, { value: string; label: string; icon: string }> = {
      sampah: { value: 'kebersihan', label: 'Kebersihan', icon: 'delete' },
      ruang_hijau: { value: 'ruang_hijau', label: 'Ruang Hijau', icon: 'park' },
      infrastruktur_jalan: { value: 'infrastruktur', label: 'Infrastruktur', icon: 'construction' },
      penerangan: { value: 'penerangan', label: 'Infrastruktur', icon: 'lightbulb' },
      drainase: { value: 'drainase', label: 'Drainase', icon: 'water_drop' },
      fasilitas: { value: 'fasilitas', label: 'Fasilitas Umum', icon: 'directions_walk' },
      lainnya: { value: 'lainnya', label: 'Lainnya', icon: 'info' },
    };

    const catInfo = categoryMap[kategori] || { value: 'lainnya', label: 'Lainnya', icon: 'report' };
    const cityConfig = CITIES.find((c) => c.name === kota) || CITIES[0];

    const lat = initialLocation?.lat ?? cityConfig.center[0] + (Math.random() - 0.5) * 0.03;
    const lng = initialLocation?.lng ?? cityConfig.center[1] + (Math.random() - 0.5) * 0.03;

    const defaultImg =
      photoPreview ||
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCWr_lkpfQCI44JNAXYqVGOligdK6hKpa2qXvASY05dcYN1CuURLlcUnFmmexUoZNL1WR18HuYH97K4vYIPYyMgVlDEEmKAhGudGDu_O2e0D1fysBrtk7Q0JA9obSrTY2uTT8-khG8Cs_4t2B60wEMSLQGflPbV0kUVY06PUNY8ieDKTuSaS8_eYKyXIiP2RA_whGxHmUM88yCSFPM-R3giOEPjuIImwxerYR6wOASYEZWLm1Mfe5G_XQ';

    setTimeout(() => {
      onSubmitReport({
        title: judul,
        category: catInfo.value as any,
        categoryLabel: catInfo.label,
        categoryIcon: catInfo.icon,
        description: deskripsi,
        location: lokasi,
        city: kota,
        lat,
        lng,
        timeAgo: 'Baru saja',
        timestamp: Date.now(),
        status: 'baru',
        upvotes: 1,
        hasUpvoted: true,
        imageUrl: defaultImg,
        priority: 'Tinggi',
      });

      setIsSubmitting(false);
      setFormSuccess(true);
      setJudul('');
      setKategori('');
      setDeskripsi('');
      setLokasi('');
      setPhotoPreview(null);
      onClearInitialLocation();

      setTimeout(() => setFormSuccess(false), 4000);
    }, 500);
  };

  return (
    <div className="flex-grow w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 flex flex-col gap-4 shadow-lg" data-aos="fade-up">
        <button
          onClick={onCancel}
          className="self-start flex items-center gap-1 text-xs font-label font-bold uppercase text-slate-500 hover:text-primary-600 mb-1 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Kembali ke Peta
        </button>

        <h1 className="font-headline text-2xl sm:text-3xl text-slate-900 mb-1 uppercase font-bold tracking-tight">
          BUAT LAPORAN BARU
        </h1>
        <p className="font-body text-sm text-slate-500 mb-2 font-medium">
          Sampaikan keluhan Anda untuk kota yang lebih baik. Transparansi dan aksi nyata untuk lingkungan kita.
        </p>

        {formSuccess && (
          <div className="bg-green-600 text-white border border-slate-200 rounded-xl p-3 shadow-md font-label text-sm font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            Laporan berhasil dikirim & dipublikasikan di peta!
          </div>
        )}

        {initialLocation && (
          <div className="bg-primary-50 border border-primary-600 rounded-lg p-3 flex items-start gap-2">
            <span className="material-symbols-outlined text-[18px] text-primary-600 mt-0.5">location_on</span>
            <div className="text-xs font-body text-slate-900">
              <span className="font-bold">Lokasi dipilih dari peta</span> ({initialLocation.city}). Sudah otomatis
              diisi di bawah — silakan sesuaikan alamat kalau perlu.
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Judul Laporan */}
          <div className="flex flex-col gap-1">
            <label className="font-label text-xs text-slate-900 uppercase font-bold tracking-wider" htmlFor="judul">
              JUDUL LAPORAN *
            </label>
            <input
              id="judul"
              type="text"
              required
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Beri judul singkat mengenai laporan Anda"
              className="border border-slate-200 rounded-lg p-2.5 focus:border-primary-600 focus:ring-0 transition-all font-body text-sm bg-white shadow-inner outline-none"
            />
          </div>

          {/* Kategori */}
          <div className="flex flex-col gap-1">
            <label className="font-label text-xs text-slate-900 uppercase font-bold tracking-wider" htmlFor="kategori">
              KATEGORI *
            </label>
            <select
              id="kategori"
              required
              value={kategori}
              onChange={(e) => {
                const val = e.target.value as any;
                setKategori(val);
                if (!photoPreview && val) handleUseSampleImage(val);
              }}
              className="border border-slate-200 rounded-lg p-2.5 focus:border-primary-600 focus:ring-0 transition-all font-body text-sm bg-white shadow-inner outline-none cursor-pointer"
            >
              <option value="" disabled>
                Pilih Kategori
              </option>
              <option value="sampah">Sampah & Kebersihan</option>
              <option value="ruang_hijau">Ruang Hijau & Taman</option>
              <option value="infrastruktur_jalan">Infrastruktur Jalan</option>
              <option value="penerangan">Penerangan Jalan (PJU)</option>
              <option value="drainase">Drainase & Saluran Air</option>
              <option value="fasilitas">Fasilitas Umum & Trotoar</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </div>

          {/* Deskripsi Masalah */}
          <div className="flex flex-col gap-1">
            <label className="font-label text-xs text-slate-900 uppercase font-bold tracking-wider" htmlFor="deskripsi">
              DESKRIPSI MASALAH *
            </label>
            <textarea
              id="deskripsi"
              required
              rows={3}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Jelaskan secara detail masalah yang Anda temukan..."
              className="border border-slate-200 rounded-lg p-2.5 focus:border-primary-600 focus:ring-0 transition-all font-body text-sm resize-none bg-white shadow-inner outline-none"
            />
          </div>

          {/* Kota */}
          <div className="flex flex-col gap-1">
            <label className="font-label text-xs text-slate-900 uppercase font-bold tracking-wider" htmlFor="kota">
              KOTA *
            </label>
            <select
              id="kota"
              required
              value={kota}
              onChange={(e) => setKota(e.target.value)}
              disabled={!!initialLocation}
              className="border border-slate-200 rounded-lg p-2.5 focus:border-primary-600 focus:ring-0 transition-all font-body text-sm bg-white shadow-inner outline-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {CITIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Alamat/Lokasi */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <label className="font-label text-xs text-slate-900 uppercase font-bold tracking-wider" htmlFor="lokasi">
                ALAMAT/LOKASI *
              </label>
              <button
                type="button"
                onClick={onPickOnMap}
                className="text-[11px] font-label uppercase text-primary-600 font-bold hover:underline cursor-pointer"
              >
                Pilih di peta
              </button>
            </div>
            <div className="relative">
              <input
                id="lokasi"
                type="text"
                required
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                placeholder="Ketik alamat lokasi laporan"
                className="w-full border border-slate-200 rounded-lg p-2.5 pl-9 focus:border-primary-600 focus:ring-0 transition-all font-body text-sm bg-white shadow-inner outline-none"
              />
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-900 text-[18px]">
                location_on
              </span>
            </div>
          </div>

          {/* Bukti Foto */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <label className="font-label text-xs text-slate-900 uppercase font-bold tracking-wider">
                BUKTI FOTO *
              </label>
              {photoPreview && (
                <button
                  type="button"
                  onClick={() => setPhotoPreview(null)}
                  className="text-xs text-rose-500 font-bold uppercase underline cursor-pointer"
                >
                  Hapus Foto
                </button>
              )}
            </div>

            <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleFileChange} />

            {photoPreview ? (
              <div className="relative border border-slate-200 rounded-lg bg-black h-40 overflow-hidden shadow-sm group">
                <img src={photoPreview} alt="Bukti foto laporan" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 bg-white border border-slate-200 rounded-lg px-2 py-1 font-label text-xs font-medium shadow-sm"
                >
                  Ganti Foto
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-[3px] border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center gap-1.5 bg-white hover:bg-slate-100 transition-colors cursor-pointer group"
              >
                <span className="material-symbols-outlined text-[32px] text-slate-500 group-hover:text-primary-600 transition-colors">
                  cloud_upload
                </span>
                <p className="font-label text-xs sm:text-sm text-slate-500 group-hover:text-primary-600 text-center uppercase font-bold">
                  KLIK UNTUK UPLOAD ATAU DRAG &amp; DROP
                </p>
                <p className="font-label text-[11px] text-slate-900 uppercase font-semibold">
                  JPG, PNG, MAKSIMAL 5MB
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 bg-primary-600 text-white font-label text-sm sm:text-base py-3 rounded-lg brutal-border-sm hover:bg-primary-700 transition-colors w-full flex items-center justify-center gap-2 uppercase font-bold shadow-md active:translate-y-1 active:translate-x-1 active:shadow-none cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                MENGIRIM LAPORAN...
              </>
            ) : (
              <>
                KIRIM LAPORAN
                <span className="material-symbols-outlined text-[18px]">send</span>
              </>
            )}
          </button>
        </form>
      </section>
    </div>
  );
};
