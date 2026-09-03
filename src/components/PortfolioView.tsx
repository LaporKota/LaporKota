import { motion } from 'motion/react';
import { CountUpStat } from './motion/CountUpStat';
import { customEasing, springConfig } from './motion/PageTransition';
import React, { useState } from 'react';
import { PORTFOLIO_PROJECTS } from '../data/greenEcoData';
import { PortfolioCaseStudy } from '../types';

interface PortfolioViewProps {
  onOpenReportModal?: () => void;
  onNavigateToEcoPulse?: () => void;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({ onNavigateToEcoPulse }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [activeProjectModal, setActiveProjectModal] = useState<PortfolioCaseStudy | null>(null);
  const [downloadNotification, setDownloadNotification] = useState<string | null>(null);

  const categories = [
    'Semua',
    'Smart Solar & Energy',
    'IoT & Sensor Grid',
    'AI Early Warning',
  ];

  const filteredProjects = PORTFOLIO_PROJECTS.filter((p) => {
    if (selectedCategory !== 'Semua' && p.category !== selectedCategory) return false;
    return true;
  });

  const handleDownloadBlueprint = (project: PortfolioCaseStudy) => {
    const blueprintData = {
      project_id: project.id,
      title: project.title,
      category: project.category,
      lead_partner: project.leadPartner,
      hardware_specifications: project.hardwareSpecs,
      architecture_flow: project.solutionArchitecture,
      impact_metrics: project.impactMetrics,
      open_source_license: 'MIT / Open Hardware Commons',
      generated_at: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(blueprintData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blueprint-${project.id}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setDownloadNotification(`Blueprint teknis ${project.title} berhasil diunduh!`);
    setTimeout(() => setDownloadNotification(null), 3500);
  };

  return (
    <div className="flex-grow w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
      {/* Header */}
      <section className="flex flex-col gap-3 border-b border-slate-200 pb-6">
        <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-rose-50 text-slate-900 border border-slate-200 rounded-lg px-3 py-1 font-label text-xs font-medium shadow-sm mb-2">
              <span className="material-symbols-outlined text-[16px]">folder_special</span>
              PORTFOLIO INOVASI &amp; STUDI KASUS HIJAU
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-slate-900 font-bold uppercase tracking-tight">
              PROYEK TEKNOLOGI HIJAU PERKOTAAN
            </h1>
            <p className="font-body text-base sm:text-lg text-slate-500 max-w-3xl mt-1">
              Dokumentasi proyek rekayasa cerdas, telemetri mikro, dan studi kasus keberhasilan kolaborasi warga dengan instansi pemerintah kota.
            </p>
          </div>

          {onNavigateToEcoPulse && (
            <button
              onClick={onNavigateToEcoPulse}
              className="bg-primary-600 text-white border border-slate-200 rounded-xl px-4 py-2 font-label text-xs font-medium shadow-sm hover:bg-primary-700 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <span className="material-symbols-outlined text-[16px]">eco</span>
              Lihat Live Telemetri IoT
            </button>
          )}
        </div>

        {/* Download Notification Toast */}
        {downloadNotification && (
          <div className="mt-2 bg-green-100 border border-slate-200 rounded-xl p-3 text-xs font-label font-bold text-slate-900 shadow-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-green-600 text-[18px]">check_circle</span>
            {downloadNotification}
          </div>
        )}

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 pt-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 border border-slate-200 rounded-lg font-label text-xs font-medium cursor-pointer transition-all ${
                selectedCategory === cat
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white text-slate-800 hover:bg-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Projects Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white border border-slate-200 rounded-xl shadow-lg flex flex-col justify-between overflow-hidden group"
          >
            <div>
              {/* Image & Header Overlay */}
              <div className="relative h-56 sm:h-64 border-b border-slate-200 overflow-hidden bg-white">
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  <span className="bg-primary-600 text-white border border-slate-200 rounded-lg px-2.5 py-0.5 text-xs font-label font-bold uppercase shadow-sm">
                    {project.badge}
                  </span>
                  <span className="bg-white text-slate-800 border border-slate-200 rounded-lg px-2 py-0.5 text-[10px] font-label font-bold uppercase shadow-sm">
                    {project.status}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 bg-slate-900 text-white border border-white px-2.5 py-0.5 text-[10px] font-mono font-bold">
                  {project.location}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col gap-4">
                <div>
                  <span className="font-label text-xs font-bold text-primary-600 uppercase">
                    {project.category} • {project.year}
                  </span>
                  <h3 className="font-headline text-xl sm:text-2xl font-bold uppercase tracking-tight text-slate-900 mt-1">
                    {project.title}
                  </h3>
                  <p className="font-body text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                    {project.summary}
                  </p>
                </div>

                {/* Key Impact Stats Bar */}
                <div className="grid grid-cols-3 gap-2 bg-white border border-slate-200 rounded-lg p-3 text-center">
                  {project.impactMetrics.map((m, idx) => (
                    <div key={idx} className="flex flex-col">
                      <span className="font-headline text-base sm:text-lg font-bold text-slate-900">
                        {m.value}
                      </span>
                      <span className="font-label text-[9px] font-medium text-slate-500 truncate">
                        {m.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="p-6 pt-0 border-t-2 border-slate-200 mt-2 flex flex-wrap justify-between items-center gap-3">
              <span className="text-[11px] font-body text-slate-500 italic">
                Mitra: {project.partner}
              </span>

              <div className="flex gap-2">
                {project.blueprintAvailable && (
                  <button
                    onClick={() => handleDownloadBlueprint(project)}
                    className="bg-white hover:bg-rose-50 text-slate-900 border border-slate-200 rounded-lg px-3 py-1.5 font-label text-xs font-medium shadow-sm cursor-pointer flex items-center gap-1"
                    title="Unduh Blueprint JSON"
                  >
                    <span className="material-symbols-outlined text-[16px]">download</span>
                    Blueprint
                  </button>
                )}
                <button
                  onClick={() => setActiveProjectModal(project)}
                  className="bg-primary-600 hover:bg-primary-700 text-slate-900 border border-slate-200 rounded-lg px-4 py-1.5 font-label text-xs font-medium shadow-sm active:scale-95 cursor-pointer flex items-center gap-1"
                >
                  Studi Kasus Detail
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Case Study Detail Modal */}
      {activeProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-primary-600 border-b border-slate-200 p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[24px]">verified</span>
                <div>
                  <span className="font-label text-xs font-medium text-slate-900">
                    STUDI KASUS INOVASI TEKNIK • {activeProjectModal.category}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveProjectModal(null)}
                className="w-7 h-7 bg-white border border-slate-200 rounded-lg font-bold text-sm flex items-center justify-center hover:bg-rose-500 hover:text-white shadow-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto flex flex-col gap-6 font-body text-xs sm:text-sm">
              <div>
                <h2 className="font-headline text-2xl sm:text-3xl font-bold uppercase tracking-tight text-slate-900">
                  {activeProjectModal.title}
                </h2>
                <div className="flex flex-wrap gap-2 text-xs font-label text-slate-500 mt-1">
                  <span>Lokasi: {activeProjectModal.location}</span>
                  <span>•</span>
                  <span>Mitra Utama: {activeProjectModal.partner}</span>
                  <span>•</span>
                  <span className="text-green-600 font-bold">{activeProjectModal.status}</span>
                </div>
              </div>

              {/* Problem Statement Box */}
              <div className="bg-rose-50 border border-slate-200 rounded-lg p-4 flex flex-col gap-1">
                <h4 className="font-headline text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">report_problem</span>
                  TANTANGAN PERKOTAAN (PROBLEM STATEMENT):
                </h4>
                <p className="font-body text-xs text-slate-900 leading-relaxed">
                  {activeProjectModal.problemStatement}
                </p>
              </div>

              {/* Solution Architecture Flow */}
              <div className="flex flex-col gap-2">
                <h4 className="font-headline text-xs font-semibold text-primary-600 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">account_tree</span>
                  ARSITEKTUR SOLUSI &amp; ALUR SISTEM TEKNOLOGI:
                </h4>
                <div className="flex flex-col gap-2">
                  {activeProjectModal.solutionArchitecture.map((step, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-slate-200 p-3 flex items-start gap-3"
                    >
                      <div className="w-6 h-6 bg-slate-900 text-white flex items-center justify-center font-headline text-xs font-bold shrink-0">
                        0{idx + 1}
                      </div>
                      <span className="text-xs font-body text-slate-900">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hardware Specifications Table */}
              <div className="flex flex-col gap-2">
                <h4 className="font-headline text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">memory</span>
                  SPESIFIKASI HARDWARE &amp; SENSOR:
                </h4>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left font-label text-xs">
                    <thead className="bg-slate-900 text-white">
                      <tr>
                        <th className="p-2 border-r border-gray-700">Komponen</th>
                        <th className="p-2">Spesifikasi Teknis</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1a1a1a] bg-white">
                      {activeProjectModal.hardwareSpecs.map((spec, idx) => (
                        <tr key={idx}>
                          <td className="p-2.5 font-bold border-r border-slate-200 bg-white w-1/3">
                            {spec.component}
                          </td>
                          <td className="p-2.5 font-mono text-[11px]">{spec.detail}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Impact Metrics Breakdown */}
              <div className="flex flex-col gap-2">
                <h4 className="font-headline text-xs font-semibold text-primary-600 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">speed</span>
                  DAMPAK TERVERIFIKASI (VERIFIED IMPACT METRICS):
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {activeProjectModal.impactMetrics.map((metric, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <span className="font-headline text-xl font-bold text-primary-600">
                          {metric.value}
                        </span>
                        <div className="font-label text-[10px] font-medium text-slate-900 mt-0.5">
                          {metric.label}
                        </div>
                      </div>
                      <p className="font-body text-[11px] text-slate-500 mt-2 border-t border-slate-200 pt-1.5">
                        {metric.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Footer */}
              <div className="border-t-2 border-slate-200 pt-4 flex flex-wrap justify-between items-center gap-3">
                <span className="text-xs font-label font-bold text-slate-500">
                  Lead Partner: {activeProjectModal.leadPartner}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownloadBlueprint(activeProjectModal)}
                    className="bg-primary-600 text-white border border-slate-200 rounded-lg px-4 py-2 font-label text-xs font-medium shadow-sm hover:bg-primary-700 cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">download</span>
                    Unduh Skema Blueprint
                  </button>
                  <button
                    onClick={() => setActiveProjectModal(null)}
                    className="bg-white text-slate-800 border border-slate-200 rounded-lg px-4 py-2 font-label text-xs font-medium hover:bg-white cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
