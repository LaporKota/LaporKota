import React, { useState, useRef, useEffect } from 'react';
import { Report, ReportCategory, ReportStatus } from '../types';

interface MapViewProps {
  reports: Report[];
  onSelectReport: (report: Report) => void;
  onSubmitReport: (newReport: Partial<Report>) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  reports,
  onSelectReport,
  onSubmitReport,
}) => {
  // Form State
  const [judul, setJudul] = useState('');
  const [kategori, setKategori] = useState<ReportCategory | ''>('');
  const [deskripsi, setDeskripsi] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // Map Filter & Interaction State
  const [mapStatusFilter, setMapStatusFilter] = useState<'all' | ReportStatus>('all');
  const selectedCity: 'Jakarta' = 'Jakarta';
  const [tempMarker, setTempMarker] = useState<{ topPct: number; leftPct: number } | null>(null);
  const [activeHoverReport, setActiveHoverReport] = useState<Report | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showTwoFingerWarning, setShowTwoFingerWarning] = useState(false);
  
  const dragStart = useRef({ x: 0, y: 0 });
  const hasDragged = useRef(false);
  
  useEffect(() => {
    const el = mapContainerRef.current;
    if (!el) return;
    
    const handleWheel = (e) => {
      e.preventDefault();
      const zoomDelta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoomLevel((prev) => Math.max(0.5, Math.min(prev + zoomDelta, 3)));
    };
    
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);
  
  useEffect(() => {
    const el = mapContainerRef.current;
    if (!el) return;
    
    let initialPinchDistance = null;
    let initialZoom = 1;
    
    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        setShowTwoFingerWarning(true);
        setTimeout(() => setShowTwoFingerWarning(false), 2000);
      } else if (e.touches.length === 2) {
        e.preventDefault();
        setShowTwoFingerWarning(false);
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialPinchDistance = Math.sqrt(dx*dx + dy*dy);
        
        setZoomLevel(prev => {
           initialZoom = prev;
           return prev;
        });
      }
    };
    
    const handleTouchMove = (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const distance = Math.sqrt(dx*dx + dy*dy);
        
        if (initialPinchDistance) {
          const scale = distance / initialPinchDistance;
          setZoomLevel(() => Math.max(0.5, Math.min(initialZoom * scale, 3)));
        }
      }
    };
    
    el.addEventListener('touchstart', handleTouchStart, { passive: false });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch') return;
    if (e.button !== 0) return;
    setIsDragging(true);
    hasDragged.current = false;
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    if (Math.abs(pan.x - dx) > 2 || Math.abs(pan.y - dy) > 2) {
      hasDragged.current = true;
    }
    setPan({ x: dx, y: dy });
  };
  
  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };


  const fileInputRef = useRef<HTMLInputElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Filter reports on map
  const visibleMapReports = reports.filter((r) => {
    if (mapStatusFilter !== 'all' && r.status !== mapStatusFilter) return false;
    if (r.city && r.city !== selectedCity) return false;
    return true;
  });

  // Handle Map Click to place pin
  
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (hasDragged.current) return;
    
    if (!mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = x - cx;
    const ry = y - cy;
    const unzoomedX = (rx - pan.x) / zoomLevel;
    const unzoomedY = (ry - pan.y) / zoomLevel;
    const originX = unzoomedX + cx;
    const originY = unzoomedY + cy;
    
    const leftPct = Math.max(5, Math.min(95, Math.round((originX / rect.width) * 100)));
    const topPct = Math.max(5, Math.min(95, Math.round((originY / rect.height) * 100)));
    
    setTempMarker({ topPct, leftPct });
    
    const mockStreets = [
      'Jl. Jenderal Sudirman No. 42',
      'Jl. MH Thamrin Kav. 12',
      'Jl. Rasuna Said, Kuningan',
      'Jl. Gatot Subroto No. 88',
      'Jl. Hayam Wuruk, Harmoni',
      'Jl. Danau Sunter Utara',
      'Jl. Boulevard Kelapa Gading',
    ];
    const randomStreet = mockStreets[Math.floor(Math.random() * mockStreets.length)] + `, ${selectedCity}`;
    
    if (!lokasi) {
      setLokasi(randomStreet);
    }
  };


  // Handle file drop / upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Set sample image helper
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

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul || !kategori || !deskripsi || !lokasi) return;

    setIsSubmitting(true);

    const categoryMap: Record<string, { label: string; icon: string }> = {
      sampah: { label: 'Kebersihan', icon: 'delete' },
      ruang_hijau: { label: 'Ruang Hijau', icon: 'park' },
      infrastruktur_jalan: { label: 'Infrastruktur', icon: 'construction' },
      penerangan: { label: 'Infrastruktur', icon: 'lightbulb' },
      drainase: { label: 'Drainase', icon: 'water_drop' },
      fasilitas: { label: 'Fasilitas Umum', icon: 'directions_walk' },
      lainnya: { label: 'Fasilitas Umum', icon: 'info' },
    };

    const catInfo = categoryMap[kategori] || { label: 'Lainnya', icon: 'report' };

    const topPct = tempMarker ? tempMarker.topPct : Math.floor(Math.random() * 60) + 20;
    const leftPct = tempMarker ? tempMarker.leftPct : Math.floor(Math.random() * 60) + 20;

    const defaultImg =
      photoPreview ||
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCWr_lkpfQCI44JNAXYqVGOligdK6hKpa2qXvASY05dcYN1CuURLlcUnFmmexUoZNL1WR18HuYH97K4vYIPYyMgVlDEEmKAhGudGDu_O2e0D1fysBrtk7Q0JA9obSrTY2uTT8-khG8Cs_4t2B60wEMSLQGflPbV0kUVY06PUNY8ieDKTuSaS8_eYKyXIiP2RA_whGxHmUM88yCSFPM-R3giOEPjuIImwxerYR6wOASYEZWLm1Mfe5G_XQ';

    setTimeout(() => {
      onSubmitReport({
        title: judul,
        category: (kategori === 'infrastruktur' || kategori === 'penerangan' ? 'infrastruktur' : kategori) as any,
        categoryLabel: catInfo.label,
        categoryIcon: catInfo.icon,
        description: deskripsi,
        location: lokasi,
        city: selectedCity,
        lat: -6.2,
        lng: 106.8,
        mapTopPct: topPct,
        mapLeftPct: leftPct,
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
      setTempMarker(null);

      setTimeout(() => {
        setFormSuccess(false);
      }, 4000);
    }, 600);
  };

  const getMarkerStyle = (cat: ReportCategory) => {
    switch (cat) {
      case 'kebersihan':
        return {
          bg: 'bg-rose-500 text-white',
          border: 'border-slate-200',
          icon: 'delete',
        };
      case 'drainase':
        return {
          bg: 'bg-primary-600 text-white',
          border: 'border-slate-200',
          icon: 'water_drop',
        };
      case 'ruang_hijau':
        return {
          bg: 'bg-green-600 text-white',
          border: 'border-slate-200',
          icon: 'park',
        };
      case 'infrastruktur':
      case 'penerangan':
      default:
        return {
          bg: 'bg-primary-600 text-white',
          border: 'border-slate-200',
          icon: cat === 'penerangan' ? 'lightbulb' : 'construction',
        };
    }
  };

  return (
    <div className="flex-grow w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
      {/* LEFT COLUMN: Form Section */}
      <section className="w-full lg:w-[380px] xl:w-[420px] bg-white border border-slate-200 rounded-xl p-6 flex flex-col gap-4 shadow-lg shrink-0">
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
              className="border border-slate-200 rounded-lg rounded-none p-2.5 focus:border-primary-600 focus:ring-0 transition-all font-body text-sm bg-white shadow-inner outline-none"
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
                if (!photoPreview && val) {
                  handleUseSampleImage(val);
                }
              }}
              className="border border-slate-200 rounded-lg rounded-none p-2.5 focus:border-primary-600 focus:ring-0 transition-all font-body text-sm bg-white shadow-inner outline-none cursor-pointer"
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
              className="border border-slate-200 rounded-lg rounded-none p-2.5 focus:border-primary-600 focus:ring-0 transition-all font-body text-sm resize-none bg-white shadow-inner outline-none"
            />
          </div>

          {/* Alamat/Lokasi */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <label className="font-label text-xs text-slate-900 uppercase font-bold tracking-wider" htmlFor="lokasi">
                ALAMAT/LOKASI *
              </label>
              <span className="text-[11px] font-label uppercase text-primary-600 font-bold">
                (Klik peta untuk memilih)
              </span>
            </div>
            <div className="relative">
              <input
                id="lokasi"
                type="text"
                required
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                placeholder="Ketik lokasi atau pilih di peta"
                className="w-full border border-slate-200 rounded-lg rounded-none p-2.5 pl-9 focus:border-primary-600 focus:ring-0 transition-all font-body text-sm bg-white shadow-inner outline-none"
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

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {photoPreview ? (
              <div className="relative border border-slate-200 rounded-lg bg-black h-36 overflow-hidden shadow-sm group">
                <img
                  src={photoPreview}
                  alt="Bukti foto laporan"
                  className="w-full h-full object-cover"
                />
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
                className="border-[3px] border-dashed border-slate-200 rounded-none p-5 flex flex-col items-center justify-center gap-1.5 bg-white hover:bg-slate-100 transition-colors cursor-pointer group"
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
            className="mt-1 bg-primary-600 text-white font-label text-sm sm:text-base py-3 rounded-none border-[4px] border-slate-200 hover:bg-primary-700 transition-colors w-full flex items-center justify-center gap-2 uppercase font-bold shadow-md active:translate-y-1 active:translate-x-1 active:shadow-none cursor-pointer disabled:opacity-50"
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

      {/* RIGHT COLUMN: Map & Filter Section */}
      <section className="w-full lg:flex-1 flex flex-col gap-4">
        {/* Map Header & Filter Bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-wrap gap-3 items-center justify-between shadow-md">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-label text-xs sm:text-sm text-slate-900 flex items-center gap-1 uppercase font-bold tracking-wider">
              <span className="material-symbols-outlined text-[18px]">filter_list</span> FILTER:
            </span>

            <div className="flex gap-1.5 overflow-x-auto pb-0.5">
              <button
                onClick={() => setMapStatusFilter('all')}
                className={`px-3 py-1 border border-slate-200 rounded-lg font-label text-xs whitespace-nowrap uppercase font-bold cursor-pointer transition-all ${
                  mapStatusFilter === 'all'
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-white text-slate-500 hover:bg-slate-100'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setMapStatusFilter('baru')}
                className={`px-3 py-1 border border-slate-200 rounded-lg font-label text-xs whitespace-nowrap uppercase font-bold cursor-pointer transition-all ${
                  mapStatusFilter === 'baru'
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-white text-slate-500 hover:bg-rose-50'
                }`}
              >
                Baru
              </button>
              <button
                onClick={() => setMapStatusFilter('diproses')}
                className={`px-3 py-1 border border-slate-200 rounded-lg font-label text-xs whitespace-nowrap uppercase font-bold cursor-pointer transition-all ${
                  mapStatusFilter === 'diproses'
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-white text-slate-500 hover:bg-primary-100'
                }`}
              >
                Diproses
              </button>
              <button
                onClick={() => setMapStatusFilter('selesai')}
                className={`px-3 py-1 border border-slate-200 rounded-lg font-label text-xs whitespace-nowrap uppercase font-bold cursor-pointer transition-all ${
                  mapStatusFilter === 'selesai'
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'bg-white text-slate-500 hover:bg-green-100'
                }`}
              >
                Selesai
              </button>
            </div>
          </div>

          {/* City Label (locked to Jakarta) */}
          <div className="flex items-center gap-2">
            <span className="font-label text-xs font-medium text-slate-900 hidden sm:inline">
              KOTA:
            </span>
            <span className="border border-slate-200 rounded-lg bg-white px-2 py-1 font-label text-xs font-bold text-slate-900 shadow-sm">
              Jakarta
            </span>
          </div>
        </div>

        {/* Map Canvas View */}
        <div
          ref={mapContainerRef}
          onClick={handleMapClick}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="flex-grow bg-slate-100 border border-slate-200 rounded-xl shadow-lg overflow-hidden relative min-h-[540px] select-none cursor-crosshair touch-pan-y"
          style={{ touchAction: 'pan-y' }}
          title="Klik pada peta untuk menancapkan pin lokasi laporan baru"
        >
          {/* Map Base Image (Desaturated High-Contrast Urban Map) */}
          <div
            className="absolute inset-0 bg-cover bg-center grayscale contrast-125 transition-transform duration-300"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCMcM8sesk3dZJlpwBHowman0QdJSLX68cvdA-rKjlhVQOfzdLnhrh-Lz7AkxpfrpkIHlCgEB38fD3QG4_LjTQbbYpwX1tKLlBxI2xP21NG85nZLJpvM_awWvdzzedsuQ_3H6VlFtKQGfwMkepdI0VD4yPRpF1PCKqOriOtTBJbnbMH3sva1DiTG045U4CC0VeE3uWEPEzxCjMFdjyC0yNWIrAqoqm6sgnzF6ftjCGwx5kR0Ye3FpK1ug')`,
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'center center',
            }}
          />

          {/* Interactive Map Overlay Area */}
          {/* Static Overlay (Guide Bar & Zoom Controls) */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Map Top Guide Bar */}
            <div className="absolute top-3 left-3 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm flex items-center gap-2 pointer-events-none z-10">
              <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse"></span>
              <span className="font-label text-xs font-medium text-slate-900">
                Peta Interaktif {selectedCity} • {visibleMapReports.length} Titik Laporan
              </span>
            </div>

            {/* Zoom Controls */}
            <div className="absolute top-3 right-3 flex flex-col gap-1 z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomLevel((prev) => Math.min(prev + 0.2, 1.8));
                }}
                className="w-8 h-8 bg-white pointer-events-auto border border-slate-200 rounded-lg font-bold text-lg flex items-center justify-center shadow-sm hover:bg-slate-100 active:scale-95 cursor-pointer"
                title="Zoom In"
              >
                +
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomLevel((prev) => Math.max(prev - 0.2, 0.9));
                }}
                className="w-8 h-8 bg-white pointer-events-auto border border-slate-200 rounded-lg font-bold text-lg flex items-center justify-center shadow-sm hover:bg-slate-100 active:scale-95 cursor-pointer"
                title="Zoom Out"
              >
                -
              </button>
            </div>

            </div>
            
            {/* Interactive Markers Overlay Area (Transformed with Map) */}
            <div className="absolute inset-0">
              {/* Click-to-Pin Temporary Marker */}
            {tempMarker && (
              <div
                style={{
                  top: `${tempMarker.topPct}%`,
                  left: `${tempMarker.leftPct}%`,
                  transform: 'translate(-50%, -100%)',
                }}
                className="absolute flex flex-col items-center z-30 pointer-events-none animate-bounce"
              >
                <div className="bg-rose-500 text-white border border-slate-200 rounded-xl px-2 py-1 text-[11px] font-label font-bold uppercase shadow-sm whitespace-nowrap mb-1">
                  Titik Baru Ditentukan!
                </div>
                <div className="bg-primary-600 text-white rounded-full border-2 border-white rounded-lg p-1.5 shadow-sm flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">add_location</span>
                </div>
                <div className="w-[3px] h-6 bg-slate-900 -mt-0.5"></div>
                <div className="w-3 h-3 border border-slate-200 rounded-lg bg-primary-600"></div>
              </div>
            )}

            {/* Render Map Reports Markers */}
            {visibleMapReports.map((report) => {
              const markerStyle = getMarkerStyle(report.category);
              const isHovered = activeHoverReport?.id === report.id;

              return (
                <div
                  key={report.id}
                  style={{
                    top: `${report.mapTopPct}%`,
                    left: `${report.mapLeftPct}%`,
                    transform: 'translate(-50%, -100%)',
                  }}
                  onMouseEnter={() => setActiveHoverReport(report)}
                  onMouseLeave={() => setActiveHoverReport(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectReport(report);
                  }}
                  className="absolute flex flex-col items-center cursor-pointer group z-20"
                >
                  {/* Pin Flag Icon */}
                  <div
                    className={`${markerStyle.bg} border border-slate-200 rounded-lg p-1.5 group-hover:scale-125 transition-transform relative z-10 flex items-center justify-center shadow-md`}
                  >
                    <span className="material-symbols-outlined text-[16px] font-bold">
                      {markerStyle.icon}
                    </span>
                  </div>
                  {/* Pole */}
                  <div className="w-[3px] h-6 bg-slate-900 -mt-1 relative z-0"></div>
                  {/* Base */}
                  <div
                    className={`w-3 h-3 border-[2px] border-slate-200 ${
                      report.category === 'kebersihan'
                        ? 'bg-rose-500'
                        : report.category === 'drainase'
                        ? 'bg-primary-600'
                        : report.category === 'ruang_hijau'
                        ? 'bg-green-600'
                        : 'bg-primary-600'
                    }`}
                  ></div>

                  {/* Hover Popup */}
                  <div
                    className={`absolute bottom-full mb-3 w-[220px] bg-white border border-slate-200 rounded-xl shadow-lg p-2 flex flex-col gap-1.5 z-40 transition-all ${
                      isHovered
                        ? 'opacity-100 scale-100 pointer-events-auto'
                        : 'opacity-0 scale-95 pointer-events-none'
                    }`}
                  >
                    <img
                      src={report.imageUrl}
                      alt={report.title}
                      className="w-full h-[80px] object-cover border-[2px] border-slate-200 grayscale"
                    />
                    <div className="font-label text-xs font-bold text-slate-900 uppercase tracking-tight line-clamp-1">
                      {report.title}
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-body text-slate-500">
                      <span className="truncate">{report.location}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1 pt-1 border-t-2 border-slate-200">
                      <span
                        className={`text-[10px] px-2 py-0.5 font-bold uppercase border border-slate-200 rounded-md shadow-sm ${
                          report.status === 'baru'
                            ? 'bg-primary-600 text-white'
                            : report.status === 'diproses'
                            ? 'bg-primary-600 text-white'
                            : 'bg-green-600 text-white'
                        }`}
                      >
                        {report.status}
                      </span>
                      <span className="font-label text-xs font-bold text-slate-900 flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[14px]">thumb_up</span>
                        {report.upvotes}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            
          {/* Legend Overlay on Map (Bottom Right) */}
            <div className="absolute bottom-3 right-3 bg-slate-50 border border-slate-200 rounded-xl shadow-lg p-3 pointer-events-auto flex flex-col gap-2 z-20">
              <div className="font-label text-xs font-bold text-slate-900 uppercase tracking-wider border-b-[2px] border-slate-200 pb-1">
                KATEGORI
              </div>
              <div className="flex items-center gap-2 font-label text-[11px] text-slate-900 font-bold uppercase">
                <div className="w-3.5 h-3.5 border border-slate-200 rounded-lg bg-rose-500"></div> Sampah
              </div>
              <div className="flex items-center gap-2 font-label text-[11px] text-slate-900 font-bold uppercase">
                <div className="w-3.5 h-3.5 border border-slate-200 rounded-lg bg-primary-600"></div> Drainase
              </div>
              <div className="flex items-center gap-2 font-label text-[11px] text-slate-900 font-bold uppercase">
                <div className="w-3.5 h-3.5 border border-slate-200 rounded-lg bg-primary-600"></div> Infrastruktur
              </div>
              <div className="flex items-center gap-2 font-label text-[11px] text-slate-900 font-bold uppercase">
                <div className="w-3.5 h-3.5 border border-slate-200 rounded-lg bg-green-600"></div> Ruang Hijau
              </div>
            </div></div>
        </div>
      </section>
    </div>
  );
};
