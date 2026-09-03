import { motion } from 'motion/react';
import { CountUpStat } from './motion/CountUpStat';
import { customEasing, springConfig } from './motion/PageTransition';
import React, { useState } from 'react';
import {
  SMART_ENERGY_DATA,
  IOT_SMART_BINS,
  AQI_SENSORS,
  GREEN_TECH_GUIDES,
} from '../data/greenEcoData';
import { GreenTechGuide } from '../types';
import { Lightbulb } from 'lucide-react';

interface EcoPulseViewProps {
  onOpenReportModal?: () => void;
  onNavigateToForum?: () => void;
  onNavigateToPortfolio?: () => void;
}

export const EcoPulseView: React.FC<EcoPulseViewProps> = ({
  onNavigateToForum,
  onNavigateToPortfolio,
}) => {
  // Eco-Pulse Active Sub-tab
  const [activeModule, setActiveModule] = useState<'all' | 'energy' | 'waste' | 'aqi' | 'education'>('all');

  // Solar Calculator State
  const [roofAreaM2, setRoofAreaM2] = useState<number>(36);
  const [sunHoursPerDay, setSunHoursPerDay] = useState<number>(4.5);

  // IoT Smart Bin Filter & AI Route Simulation State
  const [binCityFilter, setBinCityFilter] = useState<string>('all');
  const [simulatingRoute, setSimulatingRoute] = useState<boolean>(false);
  const [routeOptimizationResult, setRouteOptimizationResult] = useState<string | null>(null);

  // Selected Education Guide for Modal / Expanded View
  const [selectedGuide, setSelectedGuide] = useState<GreenTechGuide | null>(null);

  // Selected City for AQI
  const [selectedAQICity, setSelectedAQICity] = useState<string>('Jakarta');

  // Solar calculation formulas
  // ~1 kWp per 6 m2, 1 kWp generates ~4 kWh/day in Indonesia
  const estimatedKwp = Math.round((roofAreaM2 / 6) * 10) / 10;
  const estimatedMonthlyKwh = Math.round(estimatedKwp * sunHoursPerDay * 30);
  const estimatedMonthlySavingsIdr = Math.round(estimatedMonthlyKwh * 1444.7); // standard PLN tarif R-1/TR
  const estimatedCo2OffsetKg = Math.round(estimatedMonthlyKwh * 0.85);

  // Filter IoT Bins
  const filteredBins = IOT_SMART_BINS.filter((b) => {
    if (binCityFilter !== 'all' && b.city !== binCityFilter) return false;
    return true;
  });

  // Active AQI sensor
  const currentAQI = AQI_SENSORS.find((s) => s.city === selectedAQICity) || AQI_SENSORS[0];

  const handleSimulateAIRoute = () => {
    setSimulatingRoute(true);
    setRouteOptimizationResult(null);
    setTimeout(() => {
      setSimulatingRoute(false);
      setRouteOptimizationResult(
        'Rute Teroptimasi AI Selesai: 3 armada truk dialihkan ke 2 titik kritis (Thamrin 04 & Pasar Baru St.). Efisiensi solar: +32%, waktu tempuh berkurang 26 menit.'
      );
    }, 1200);
  };

  return (
    <div className="flex-grow w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
      {/* Hero Header */}
      <section className="flex flex-col gap-3 border-b border-slate-200 pb-6">
        <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary-600 text-white border border-slate-200 rounded-lg px-3 py-1 font-label text-xs font-medium shadow-sm mb-2">
              <span className="material-symbols-outlined text-[16px]">eco</span>
              ECO-CONNECT &amp; IOT/AI METRICS
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-slate-900 font-bold uppercase tracking-tight">
              PEMANTAUAN KOTA HIJAU &amp; TELEMETRI IOT
            </h1>
            <p className="font-body text-base sm:text-lg text-slate-500 max-w-3xl mt-1">
              Pantau sistem telemetri energi surya mandiri, sensor ultrasonik pengelolaan sampah perkotaan, serta analisis kualitas udara real-time berbasis kecerdasan buatan.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {onNavigateToPortfolio && (
              <button
                onClick={onNavigateToPortfolio}
                className="bg-white text-slate-800 border border-slate-200 rounded-xl px-4 py-2 font-label text-xs font-medium shadow-sm hover:bg-slate-100 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">rocket_launch</span>
                Portfolio Inovasi
              </button>
            )}
            {onNavigateToForum && (
              <button
                onClick={onNavigateToForum}
                className="bg-primary-600 text-white border border-slate-200 rounded-xl px-4 py-2 font-label text-xs font-medium shadow-sm hover:bg-primary-700 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">forum</span>
                Forum Komunitas
              </button>
            )}
          </div>
        </div>

        {/* Module Sub-navigation Filter Bar */}
        <div className="flex flex-wrap gap-2 pt-4">
          {[
            { id: 'all', label: 'Semua Modul', icon: 'grid_view' },
            { id: 'energy', label: 'Energi Pintar (Solar Grid)', icon: 'solar_power' },
            { id: 'waste', label: 'Pengelolaan Sampah IoT', icon: 'delete_sweep' },
            { id: 'aqi', label: 'Kualitas Udara & AI', icon: 'air' },
            { id: 'education', label: 'Edukasi Teknologi Hijau', icon: 'school' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveModule(tab.id as any)}
              className={`px-3.5 py-2 border border-slate-200 rounded-lg font-label text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                activeModule === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-800 hover:bg-white shadow-sm'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 1. SMART ENERGY & SOLAR MICRO-GRID MONITORING                             */}
      {/* ========================================================================= */}
      {(activeModule === 'all' || activeModule === 'energy') && (
        <section className="flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
            <h2 className="font-headline text-2xl font-semibold tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-600 text-[28px] bg-slate-900 p-1">solar_power</span>
              PEMANTAUAN ENERGI PINTAR &amp; SOLAR GRID KOTA
            </h2>
            <span className="bg-primary-600 text-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-label font-bold uppercase shadow-sm">
              Live Telemetri (148 Node)
            </span>
          </div>

          {/* Energy Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-primary-600 border border-slate-200 rounded-xl p-5 shadow-md hover:shadow-lg">
              <div className="font-label text-xs font-medium text-slate-900">PRODUKSI SURYA HARI INI</div>
              <div className="font-headline text-3xl sm:text-4xl font-bold text-slate-900 mt-2">
                {SMART_ENERGY_DATA.solarKwhToday.toLocaleString('id-ID')} kWh
              </div>
              <p className="font-body text-xs text-slate-900 mt-1 font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">trending_up</span>
                +{SMART_ENERGY_DATA.solarKwhTrend}% vs rata-rata harian
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-md hover:shadow-lg">
              <div className="font-label text-xs font-medium text-slate-500">BEBAN PLN BERKURANG</div>
              <div className="font-headline text-3xl sm:text-4xl font-bold text-primary-600 mt-2">
                {SMART_ENERGY_DATA.gridLoadReducedPct}%
              </div>
              <p className="font-body text-xs text-slate-500 mt-1 font-semibold">
                Beban puncak tereduksi di 12 kelurahan percontohan
              </p>
            </div>

            <div className="bg-primary-600 border border-slate-200 rounded-xl p-5 shadow-md hover:shadow-lg">
              <div className="font-label text-xs font-medium text-slate-900">EMISI CO2 TERCEGAH</div>
              <div className="font-headline text-3xl sm:text-4xl font-bold text-slate-900 mt-2">
                {SMART_ENERGY_DATA.co2AvoidedKg.toLocaleString('id-ID')} kg
              </div>
              <p className="font-body text-xs text-slate-900 mt-1 font-semibold">
                Setara menanam 156 pohon trembesi dewasa
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-md hover:shadow-lg">
              <div className="font-label text-xs font-medium text-slate-500">KESEHATAN BATERAI (BMS)</div>
              <div className="font-headline text-3xl sm:text-4xl font-bold text-slate-900 mt-2">
                {SMART_ENERGY_DATA.batteryHealthPct}%
              </div>
              <p className="font-body text-xs text-slate-500 mt-1 font-semibold">
                148 unit LiFePO4 pack beroperasi optimal
              </p>
            </div>
          </div>

          {/* Energy Distribution & Solar Interactive Calculator */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Generation Hourly Bars */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-headline text-lg font-semibold">
                    PROFIL GENERASI LISTRIK SURYA VS JARINGAN PLN (HARI INI)
                  </h3>
                  <span className="text-xs font-label text-slate-500">Interval 2 Jam</span>
                </div>
                <p className="font-body text-xs text-slate-500 mb-4">
                  Perbandingan daya yang disuplai oleh modul fotovoltaik mikro (kuning) vs pasokan jaringan konvensional PLN (biru).
                </p>

                <div className="grid grid-cols-7 gap-2 items-end h-44 pt-4 border-b-2 border-l-2 border-slate-200 px-2">
                  {SMART_ENERGY_DATA.hourlyGeneration.map((g) => (
                    <div key={g.time} className="flex flex-col items-center gap-1 h-full justify-end">
                      <div className="w-full flex gap-1 items-end justify-center h-32">
                        {/* Solar Bar */}
                        <div
                          style={{ height: `${(g.solarKwh / 900) * 100}%` }}
                          className="w-1/2 bg-primary-600 border border-slate-200 rounded-lg transition-all hover:opacity-80"
                          title={`Surya: ${g.solarKwh} kWh`}
                        />
                        {/* Grid Bar */}
                        <div
                          style={{ height: `${(g.gridDrawKwh / 900) * 100}%` }}
                          className="w-1/2 bg-primary-600 border border-slate-200 rounded-lg transition-all hover:opacity-80"
                          title={`PLN: ${g.gridDrawKwh} kWh`}
                        />
                      </div>
                      <span className="font-label text-[10px] font-bold text-slate-900">{g.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-4 text-xs font-label font-bold pt-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-primary-600 border border-slate-200"></div>
                  <span>Generasi Tenaga Surya (Solar PV)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-primary-600 border border-slate-200"></div>
                  <span>Konsumsi Jaringan PLN</span>
                </div>
              </div>
            </div>

            {/* Interactive Solar Rooftop Simulator */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-lg flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-primary-600 text-[22px]">calculate</span>
                  <h3 className="font-headline text-lg font-semibold">
                    SIMULATOR SOLAR ROOFTOP WARGA
                  </h3>
                </div>
                <p className="font-body text-xs text-slate-500">
                  Hitung potensi penghematan listrik dan pengurangan emisi jika atap rumah/balai warga Anda dipasang panel surya:
                </p>

                {/* Slider 1: Roof Area */}
                <div className="mt-4 flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs font-label font-bold">
                    <span>Luas Area Atap:</span>
                    <span className="text-primary-600">{roofAreaM2} m²</span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="150"
                    step="6"
                    value={roofAreaM2}
                    onChange={(e) => setRoofAreaM2(Number(e.target.value))}
                    className="accent-primary-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>12 m² (Rumah Kecil)</span>
                    <span>150 m² (Balai RW/Ruko)</span>
                  </div>
                </div>

                {/* Slider 2: Sun Hours */}
                <div className="mt-3 flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs font-label font-bold">
                    <span>Penyinaran Efektif Harian:</span>
                    <span className="text-primary-600">{sunHoursPerDay} Jam</span>
                  </div>
                  <input
                    type="range"
                    min="3.0"
                    max="6.0"
                    step="0.5"
                    value={sunHoursPerDay}
                    onChange={(e) => setSunHoursPerDay(Number(e.target.value))}
                    className="accent-[#ffcc00] cursor-pointer"
                  />
                </div>

                {/* Calculation Results Card */}
                <div className="mt-4 bg-white border border-slate-200 rounded-lg p-3 flex flex-col gap-2 font-label text-xs">
                  <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span className="text-slate-500">Kapasitas Terpasang:</span>
                    <span className="font-bold">{estimatedKwp} kWp (~{Math.round(estimatedKwp * 2.2)} Panel)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span className="text-slate-500">Estimasi Produksi:</span>
                    <span className="font-bold text-primary-600">{estimatedMonthlyKwh} kWh / bulan</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span className="text-slate-500">Hemat Tagihan PLN:</span>
                    <span className="font-bold text-primary-600">
                      Rp {estimatedMonthlySavingsIdr.toLocaleString('id-ID')} / bln
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Reduksi Emisi CO2:</span>
                    <span className="font-bold text-slate-900">{estimatedCo2OffsetKg} kg CO2 / bln</span>
                  </div>
                </div>
              </div>

              <div className="bg-rose-50 border border-slate-200 rounded-lg p-2.5 text-[11px] font-body text-slate-900 flex gap-2 items-start">
                <Lightbulb size={16} className="shrink-0 mt-0.5" />
                <span><strong>Dukungan LaporKota:</strong> Unduh blueprint teknis dan ajukan program hibah panel surya komunal di halaman Portfolio &amp; Forum.</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 2. IOT SMART WASTE MANAGEMENT & DYNAMIC DISPATCH                          */}
      {/* ========================================================================= */}
      {(activeModule === 'all' || activeModule === 'waste') && (
        <section className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-200 pb-2">
            <div>
              <h2 className="font-headline text-2xl font-semibold tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-600 text-[28px] bg-slate-900 p-1">delete_sweep</span>
                PENGELOLAAN SAMPAH BERBASIS IOT (SMART BINS)
              </h2>
              <p className="font-body text-xs text-slate-500">
                Sensor ultrasonik mikro memantau volume tempat sampah komunal secara real-time dan mengarahkan truk pengangkut ke titik kritis.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={binCityFilter}
                onChange={(e) => setBinCityFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-label font-bold uppercase"
              >
                <option value="all">Semua Kota</option>
                <option value="Jakarta">Jakarta</option>
                <option value="Bandung">Bandung</option>
                <option value="Yogyakarta">Yogyakarta</option>
                <option value="Surabaya">Surabaya</option>
              </select>

              <button
                onClick={handleSimulateAIRoute}
                disabled={simulatingRoute}
                className="bg-primary-600 text-white border border-slate-200 rounded-lg px-3 py-1.5 font-label text-xs font-medium shadow-sm hover:bg-primary-700 active:scale-95 cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {simulatingRoute ? 'autorenew' : 'route'}
                </span>
                {simulatingRoute ? 'Mengoptimasi Rute...' : 'Simulasi Rute Truk AI'}
              </button>
            </div>
          </div>

          {routeOptimizationResult && (
            <div className="bg-green-100 border border-slate-200 rounded-xl p-3.5 shadow-md font-label text-xs font-bold text-slate-900 flex items-center gap-2 animate-fadeIn">
              <span className="material-symbols-outlined text-green-600 text-[20px]">check_circle</span>
              {routeOptimizationResult}
            </div>
          )}

          {/* Smart Bins Telemetry Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBins.map((bin) => {
              const isCritical = bin.fillLevelPct >= 90;
              const isReady = bin.fillLevelPct >= 70 && bin.fillLevelPct < 90;
              return (
                <div
                  key={bin.id}
                  className={`border border-slate-200 rounded-xl p-5 shadow-md hover:shadow-lg flex flex-col justify-between gap-4 transition-all ${
                    isCritical
                      ? 'bg-rose-50'
                      : isReady
                      ? 'bg-yellow-50'
                      : 'bg-white'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-mono text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5">
                          {bin.id}
                        </span>
                        <h4 className="font-headline text-base font-semibold mt-1 text-slate-900">
                          {bin.name}
                        </h4>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 font-label font-bold uppercase border border-slate-200 ${
                          isCritical
                            ? 'bg-rose-500 text-white'
                            : isReady
                            ? 'bg-primary-600 text-white'
                            : 'bg-primary-600 text-white'
                        }`}
                      >
                        {isCritical ? 'Kritis (>90%)' : isReady ? 'Siap Angkut' : 'Optimal'}
                      </span>
                    </div>

                    <p className="font-body text-xs text-slate-500 mt-2 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      {bin.location}
                    </p>

                    {/* Ultrasonic Fill Meter Gauge */}
                    <div className="mt-4 flex flex-col gap-1.5">
                      <div className="flex justify-between text-xs font-label font-bold">
                        <span>Kapasitas Keterisian (Sensor Sonar):</span>
                        <span className={isCritical ? 'text-rose-500' : 'text-slate-900'}>
                          {bin.fillLevelPct}%
                        </span>
                      </div>
                      <div className="w-full h-4 bg-white border border-slate-200 rounded-lg overflow-hidden">
                        <div
                          style={{ width: `${bin.fillLevelPct}%` }}
                          className={`h-full transition-all ${
                            isCritical
                              ? 'bg-rose-500'
                              : isReady
                              ? 'bg-primary-600'
                              : 'bg-primary-600'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Specs & Hardware Attributes */}
                  <div className="border-t-2 border-slate-200 pt-3 flex justify-between items-center text-xs font-label">
                    <div className="flex items-center gap-1 text-slate-500">
                      <span className="material-symbols-outlined text-[16px]">battery_charging_full</span>
                      <span>{bin.batteryPct}%</span>
                    </div>

                    <div className="flex items-center gap-1 text-slate-900 font-bold">
                      <span className="material-symbols-outlined text-[16px]">category</span>
                      <span>{bin.wasteType}</span>
                    </div>

                    <span className="text-[10px] text-slate-500">{bin.lastPing}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 3. AIR QUALITY INDEX (AQI) & AI PREDICTIVE FORECAST                       */}
      {/* ========================================================================= */}
      {(activeModule === 'all' || activeModule === 'aqi') && (
        <section className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-200 pb-2">
            <div>
              <h2 className="font-headline text-2xl font-semibold tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-600 text-[28px] bg-slate-900 p-1">air</span>
                KUALITAS UDARA PERKOTAAN &amp; PREDIKSI AI (AQI)
              </h2>
              <p className="font-body text-xs text-slate-500">
                Stasiun pemantauan mikro PM2.5, PM10, dan CO2 dengan model prediktif cuaca untuk mitigasi paparan polusi warga.
              </p>
            </div>

            {/* City Selector for AQI */}
            <div className="flex gap-2">
              {['Jakarta', 'Bandung', 'Yogyakarta', 'Surabaya'].map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedAQICity(city)}
                  className={`px-3 py-1 border border-slate-200 rounded-lg font-label text-xs font-medium cursor-pointer ${
                    selectedAQICity === city
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'bg-white text-slate-800 hover:bg-white'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* AQI Main Dial & Score Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-label text-xs font-bold text-slate-500 uppercase">
                      STASIUN PEMANTAU
                    </span>
                    <h3 className="font-headline text-xl font-semibold text-slate-900">
                      {currentAQI.stationName}
                    </h3>
                  </div>
                  <span
                    className={`px-3 py-1 border border-slate-200 rounded-lg font-label text-xs font-medium shadow-sm ${
                      currentAQI.status === 'Sangat Baik'
                        ? 'bg-primary-600 text-white'
                        : currentAQI.status === 'Sedang'
                        ? 'bg-primary-600 text-white'
                        : 'bg-rose-500 text-white'
                    }`}
                  >
                    {currentAQI.status}
                  </span>
                </div>

                <div className="my-6 text-center">
                  <div className="font-headline text-6xl font-bold text-slate-900">
                    {currentAQI.aqiScore}
                  </div>
                  <span className="font-label text-xs font-medium text-slate-500">
                    INDONESIA AQI INDEX
                  </span>
                </div>

                {/* Sub-parameters */}
                <div className="grid grid-cols-3 gap-2 border-t-2 border-slate-200 pt-4 text-center font-label text-xs">
                  <div className="bg-white p-2 border border-slate-200">
                    <div className="text-[10px] text-slate-500">PM2.5</div>
                    <div className="font-bold text-slate-900">{currentAQI.pm25} µg/m³</div>
                  </div>
                  <div className="bg-white p-2 border border-slate-200">
                    <div className="text-[10px] text-slate-500">PM10</div>
                    <div className="font-bold text-slate-900">{currentAQI.pm10} µg/m³</div>
                  </div>
                  <div className="bg-white p-2 border border-slate-200">
                    <div className="text-[10px] text-slate-500">CO2</div>
                    <div className="font-bold text-slate-900">{currentAQI.co2Ppm} ppm</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs font-label text-slate-500 mt-4 pt-2 border-t border-slate-200">
                <span>Suhu: {currentAQI.temperatureC}°C</span>
                <span>Kelembapan: {currentAQI.humidityPct}%</span>
              </div>
            </div>

            {/* AI Predictive Model & Health Recommendations */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-lg flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-primary-600 text-[24px]">neurology</span>
                  <h3 className="font-headline text-lg font-semibold">
                    PROYEKSI PREDIKTIF AI &amp; REKOMENDASI KESEHATAN WARGA
                  </h3>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm mb-4">
                  <div className="font-label text-xs font-medium text-primary-600 mb-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">insights</span>
                    Analisis Tren Kecerdasan Buatan (Next 12 Hours):
                  </div>
                  <p className="font-body text-xs text-slate-900 leading-relaxed">
                    {currentAQI.aiTrendForecast}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="font-label text-xs font-medium text-slate-900">
                    Tindakan &amp; Mitigasi yang Direkomendasikan:
                  </span>
                  <ul className="flex flex-col gap-2 font-body text-xs text-slate-900">
                    {currentAQI.aiRecommendations.map((rec, idx) => (
                      <li
                        key={idx}
                        className="bg-white border border-slate-200 p-2.5 flex items-start gap-2"
                      >
                        <span className="material-symbols-outlined text-primary-600 text-[18px] shrink-0">
                          check_circle
                        </span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t-2 border-slate-200 pt-3 flex flex-wrap justify-between items-center gap-2 text-xs font-label text-slate-500">
                <span>Sensor Node: LoRaWAN AirProbe v2.4</span>
                <span className="text-primary-600 font-bold">Sinkronisasi Cloud Tiap 60 Detik</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 4. GREEN TECHNOLOGY EDUCATION & KNOWLEDGE PORTAL                         */}
      {/* ========================================================================= */}
      {(activeModule === 'all' || activeModule === 'education') && (
        <section className="flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
            <div>
              <h2 className="font-headline text-2xl font-semibold tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-600 text-[28px] bg-slate-900 p-1">school</span>
                PORTAL EDUKASI TEKNOLOGI BERKELANJUTAN
              </h2>
              <p className="font-body text-xs text-slate-500">
                Panduan komprehensif bagi warga, pengurus RW, dan komunitas untuk menerapkan teknologi hijau secara mandiri.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {GREEN_TECH_GUIDES.map((guide) => (
              <div
                key={guide.id}
                onClick={() => setSelectedGuide(guide)}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-md hover:shadow-lg hover:translate-y-[-2px] hover:shadow-lg transition-all flex flex-col justify-between gap-4 cursor-pointer group"
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="bg-rose-50 text-slate-900 border border-slate-200 px-2 py-0.5 text-[10px] font-label font-bold uppercase">
                      {guide.category}
                    </span>
                    <span className="text-[10px] font-label text-slate-500">{guide.readTime}</span>
                  </div>

                  <div className="flex items-center gap-2 my-2">
                    <div className="w-10 h-10 bg-primary-600 border border-slate-200 rounded-lg flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[22px]">{guide.icon}</span>
                    </div>
                    <h3 className="font-headline text-base font-semibold group-hover:text-primary-600 leading-tight">
                      {guide.title}
                    </h3>
                  </div>

                  <p className="font-body text-xs text-slate-500 line-clamp-3 mt-2">
                    {guide.summary}
                  </p>
                </div>

                <div className="border-t-2 border-slate-200 pt-3 flex justify-between items-center text-xs font-label font-bold text-primary-600">
                  <span>Baca Panduan Lengkap</span>
                  <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Guide Detail Modal */}
      {selectedGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
            <div className="bg-primary-600 border-b border-slate-200 p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[24px] text-slate-900">
                  {selectedGuide.icon}
                </span>
                <span className="font-label text-xs font-medium">
                  {selectedGuide.category} • {selectedGuide.readTime}
                </span>
              </div>
              <button
                onClick={() => setSelectedGuide(null)}
                className="w-7 h-7 bg-white border border-slate-200 rounded-lg font-bold text-sm flex items-center justify-center hover:bg-rose-500 hover:text-white shadow-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex flex-col gap-4 font-body text-xs sm:text-sm leading-relaxed">
              <h2 className="font-headline text-xl sm:text-2xl font-bold uppercase tracking-tight text-slate-900">
                {selectedGuide.title}
              </h2>

              <p className="text-slate-900 font-semibold">{selectedGuide.summary}</p>

              <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col gap-2">
                <h4 className="font-headline text-xs font-semibold text-primary-600">
                  POIN KUNCI CARA KERJA SISTEM:
                </h4>
                <ul className="list-disc pl-5 flex flex-col gap-1.5 text-xs">
                  {selectedGuide.keyTakeaways.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-1">
                <h4 className="font-headline text-xs font-semibold text-slate-900">
                  KOMPONEN HARDWARE &amp; TEKNOLOGI PENDUKUNG:
                </h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedGuide.techStackHighlights.map((tech, idx) => (
                    <span
                      key={idx}
                      className="bg-white border border-slate-200 px-2.5 py-1 text-[11px] font-label font-bold uppercase shadow-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-500 border-t-2 border-slate-200 pt-3">
                {selectedGuide.fullGuide}
              </p>

              <button
                onClick={() => setSelectedGuide(null)}
                className="mt-2 bg-slate-900 text-white border border-slate-200 rounded-lg py-2.5 font-label text-xs font-medium hover:bg-slate-100 hover:text-slate-900 shadow-sm cursor-pointer"
              >
                Selesai Membaca
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
