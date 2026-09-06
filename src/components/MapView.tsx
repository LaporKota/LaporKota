import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Report, ReportCategory, ReportStatus } from '../types';
import { CITIES, findNearestCity } from '../data/cities';
import { ReportLocationPrefill } from './CreateReportView';

interface MapViewProps {
  reports: Report[];
  onSelectReport: (report: Report) => void;
  onCreateReportAt: (prefill: ReportLocationPrefill | null) => void;
}

// Style & ikon marker per kategori laporan (dipakai bareng untuk legenda & pin di peta)
const CATEGORY_STYLE: Record<string, { color: string; icon: string; label: string }> = {
  kebersihan: { color: '#e11d48', icon: 'delete', label: 'Sampah' },
  drainase: { color: '#0d9488', icon: 'water_drop', label: 'Drainase' },
  infrastruktur: { color: '#0d9488', icon: 'construction', label: 'Infrastruktur' },
  penerangan: { color: '#0d9488', icon: 'lightbulb', label: 'Infrastruktur' },
  ruang_hijau: { color: '#16a34a', icon: 'park', label: 'Ruang Hijau' },
  fasilitas: { color: '#0d9488', icon: 'directions_walk', label: 'Fasilitas Umum' },
  lainnya: { color: '#64748b', icon: 'info', label: 'Lainnya' },
};

function getCategoryStyle(cat: ReportCategory) {
  return CATEGORY_STYLE[cat] || CATEGORY_STYLE.lainnya;
}

// Bikin divIcon custom (bukan icon default Leaflet) supaya konsisten dengan gaya visual LaporKota
function buildMarkerIcon(cat: ReportCategory) {
  const style = getCategoryStyle(cat);
  return L.divIcon({
    className: 'laporkota-marker',
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;">
        <div style="background:${style.color};border:2px solid white;border-radius:8px;width:30px;height:30px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,0.4);">
          <span class="material-symbols-outlined" style="color:white;font-size:16px;">${style.icon}</span>
        </div>
        <div style="width:2px;height:10px;background:#1a1a1a;"></div>
      </div>
    `,
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -40],
  });
}

const tempMarkerIcon = L.divIcon({
  className: 'laporkota-temp-marker',
  html: `
    <div style="display:flex;flex-direction:column;align-items:center;">
      <div style="background:#e11d48;color:white;border-radius:8px;padding:2px 6px;font-size:10px;font-weight:700;white-space:nowrap;margin-bottom:2px;box-shadow:0 2px 6px rgba(0,0,0,0.3);">TITIK DIPILIH</div>
      <div style="background:#0d9488;border:2px solid white;border-radius:50%;width:20px;height:20px;box-shadow:0 2px 6px rgba(0,0,0,0.4);"></div>
    </div>
  `,
  iconSize: [90, 50],
  iconAnchor: [45, 30],
});

// Batas wilayah Indonesia — peta tidak akan bisa digeser/di-zoom keluar dari area ini
const INDONESIA_BOUNDS = L.latLngBounds([-11.5, 94.0], [6.5, 141.5]);

// Reposisi & zoom ulang peta setiap kali kota yang dipilih berubah.
// Kalau `bounds` diisi (mode "Semua Kota"), peta akan fit ke seluruh wilayah Indonesia.
const FlyToCity: React.FC<{ center: [number, number]; zoom: number; bounds?: L.LatLngBounds }> = ({
  center,
  zoom,
  bounds,
}) => {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.flyToBounds(bounds, { duration: 0.8 });
    } else {
      map.flyTo(center, zoom, { duration: 0.8 });
    }
  }, [center[0], center[1], zoom, bounds]);
  return null;
};

// Tangkap klik pada area kosong peta untuk memulai laporan baru di titik tersebut
const ClickToReport: React.FC<{ onPick: (lat: number, lng: number) => void }> = ({ onPick }) => {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

export const MapView: React.FC<MapViewProps> = ({ reports, onSelectReport, onCreateReportAt }) => {
  const [mapStatusFilter, setMapStatusFilter] = useState<'all' | ReportStatus>('all');
  const [selectedCityName, setSelectedCityName] = useState<string>('all');
  const [tempMarker, setTempMarker] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const selectedCity = CITIES.find((c) => c.name === selectedCityName) || null;

  // Titik tengah gabungan Indonesia dipakai saat tab "Semua Kota" aktif
  const overviewCenter: [number, number] = [-2.5, 117.5];
  const overviewZoom = 5;

  const visibleReports = useMemo(() => {
    return reports.filter((r) => {
      if (mapStatusFilter !== 'all' && r.status !== mapStatusFilter) return false;
      if (selectedCityName !== 'all' && r.city !== selectedCityName) return false;
      if (typeof r.lat !== 'number' || typeof r.lng !== 'number') return false;
      return true;
    });
  }, [reports, mapStatusFilter, selectedCityName]);

  const handlePickPoint = async (lat: number, lng: number) => {
    setTempMarker({ lat, lng });
    const city = selectedCity ? selectedCity.name : findNearestCity(lat, lng).name;

    setIsLocating(true);
    let address = `Titik terpilih (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
    try {
      // Reverse geocoding gratis via Nominatim (OpenStreetMap) — berjalan di browser pengguna
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=17&addressdetails=1`
      );
      if (res.ok) {
        const data = await res.json();
        if (data?.display_name) address = data.display_name;
      }
    } catch {
      // Diamkan saja kalau reverse geocoding gagal — fallback ke koordinat sudah cukup
    } finally {
      setIsLocating(false);
    }

    onCreateReportAt({ lat, lng, city, address });
  };

  const center: [number, number] = selectedCity ? selectedCity.center : overviewCenter;
  const zoom = selectedCity ? selectedCity.zoom : overviewZoom;

  return (
    <div className="flex-grow w-full flex flex-col">
      {/* Toolbar: filter status, pilih kota, & CTA buat laporan */}
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 py-4 flex flex-col gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-wrap gap-3 items-center justify-between shadow-md">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-label text-xs sm:text-sm text-slate-900 flex items-center gap-1 uppercase font-bold tracking-wider">
              <span className="material-symbols-outlined text-[18px]">filter_list</span> FILTER:
            </span>
            <div className="flex gap-1.5 overflow-x-auto pb-0.5">
              {(['all', 'baru', 'diproses', 'selesai'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setMapStatusFilter(f)}
                  className={`px-3 py-1 border border-slate-200 rounded-lg font-label text-xs whitespace-nowrap uppercase font-bold cursor-pointer transition-all ${
                    mapStatusFilter === f
                      ? f === 'selesai'
                        ? 'bg-green-600 text-white shadow-sm'
                        : 'bg-primary-600 text-white shadow-sm'
                      : 'bg-white text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {f === 'all' ? 'Semua' : f}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => onCreateReportAt(null)}
            className="px-4 py-2 bg-primary-600 text-white border border-slate-200 rounded-lg font-label text-xs sm:text-sm font-bold uppercase shadow-md hover:bg-primary-700 flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add_location_alt</span>
            Buat Laporan
          </button>
        </div>

        {/* City Tabs — 5 kota + tampilan gabungan */}
        <div className="bg-white border border-slate-200 rounded-xl p-2 flex flex-wrap gap-1.5 shadow-md overflow-x-auto">
          <button
            onClick={() => setSelectedCityName('all')}
            className={`px-3 py-1.5 rounded-lg font-label text-xs whitespace-nowrap uppercase font-bold cursor-pointer transition-all ${
              selectedCityName === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            🇮🇩 Semua Kota
          </button>
          {CITIES.map((c) => (
            <button
              key={c.name}
              onClick={() => setSelectedCityName(c.name)}
              className={`px-3 py-1.5 rounded-lg font-label text-xs whitespace-nowrap uppercase font-bold cursor-pointer transition-all ${
                selectedCityName === c.name
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Full Map */}
      <div className="w-full flex-grow relative isolate" style={{ minHeight: '640px' }}>
        <div className="absolute top-3 left-3 z-[1000] bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 shadow-md flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse"></span>
          <span className="font-label text-xs font-medium text-slate-900">
            Peta Interaktif {selectedCityName === 'all' ? 'Indonesia' : selectedCityName} • {visibleReports.length} Titik Laporan
          </span>
        </div>

        <div className="absolute top-3 right-3 z-[1000] bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-md max-w-[220px] hidden sm:block">
          <p className="font-label text-[11px] font-bold text-slate-900 uppercase mb-0.5">
            {isLocating ? 'Mencari alamat...' : 'Klik di peta'}
          </p>
          <p className="font-body text-[11px] text-slate-500">
            Klik titik mana pun di peta untuk langsung membuat laporan di lokasi itu.
          </p>
        </div>

        {/* Legend */}
        <div className="absolute bottom-3 right-3 z-[1000] bg-slate-50 border border-slate-200 rounded-xl shadow-lg p-3 flex flex-col gap-1.5">
          <div className="font-label text-xs font-bold text-slate-900 uppercase tracking-wider border-b-2 border-slate-200 pb-1">
            KATEGORI
          </div>
          <div className="flex items-center gap-2 font-label text-[11px] text-slate-900 font-bold uppercase">
            <div className="w-3.5 h-3.5 rounded border-2 border-white shadow" style={{ background: '#e11d48' }}></div> Sampah
          </div>
          <div className="flex items-center gap-2 font-label text-[11px] text-slate-900 font-bold uppercase">
            <div className="w-3.5 h-3.5 rounded border-2 border-white shadow" style={{ background: '#0d9488' }}></div> Drainase / Infrastruktur
          </div>
          <div className="flex items-center gap-2 font-label text-[11px] text-slate-900 font-bold uppercase">
            <div className="w-3.5 h-3.5 rounded border-2 border-white shadow" style={{ background: '#16a34a' }}></div> Ruang Hijau
          </div>
        </div>

        <MapContainer
          center={center}
          zoom={zoom}
          minZoom={5}
          maxBounds={INDONESIA_BOUNDS}
          maxBoundsViscosity={1.0}
          worldCopyJump={false}
          scrollWheelZoom
          style={{ width: '100%', height: '100%', minHeight: '640px' }}
          className="cursor-crosshair"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            noWrap
          />

          <FlyToCity
            center={center}
            zoom={zoom}
            bounds={selectedCityName === 'all' ? INDONESIA_BOUNDS : undefined}
          />
          <ClickToReport onPick={handlePickPoint} />

          {tempMarker && <Marker position={[tempMarker.lat, tempMarker.lng]} icon={tempMarkerIcon} />}

          {visibleReports.map((report) => (
            <Marker
              key={report.id}
              position={[report.lat, report.lng]}
              icon={buildMarkerIcon(report.category)}
              eventHandlers={{ click: () => onSelectReport(report) }}
            >
              <Popup>
                <div className="flex flex-col gap-1 w-[180px]">
                  <img src={report.imageUrl} alt={report.title} className="w-full h-20 object-cover rounded mb-1" />
                  <span className="font-bold text-xs">{report.title}</span>
                  <span className="text-[11px] text-slate-500">{report.location}</span>
                  <button
                    onClick={() => onSelectReport(report)}
                    className="mt-1 bg-primary-600 text-white text-[11px] font-bold uppercase rounded px-2 py-1"
                  >
                    Lihat Detail
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};
