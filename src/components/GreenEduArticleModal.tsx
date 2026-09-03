import React from 'react';
import { GreenEduArticle } from '../types';
import { User, Calendar, MapPin } from 'lucide-react';

interface GreenEduArticleModalProps {
  article: GreenEduArticle | null;
  onClose: () => void;
  onNavigateToForum?: () => void;
}

export const GreenEduArticleModal: React.FC<GreenEduArticleModalProps> = ({
  article,
  onClose,
  onNavigateToForum,
}) => {
  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-slate-50 border border-slate-200 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col my-auto relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-primary-600 border-b border-slate-200 p-4 sm:p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 bg-slate-900 inline-block"></span>
            <span className="font-label text-xs sm:text-sm font-bold uppercase text-slate-900 tracking-wider">
              {article.badge}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 border border-slate-200 rounded-lg bg-white hover:bg-rose-50 text-slate-900 font-bold text-lg flex items-center justify-center shadow-sm active:scale-95 cursor-pointer"
            aria-label="Tutup Modal"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-7 overflow-y-auto flex flex-col gap-6">
          {/* Article Image Banner */}
          <div className="relative h-56 sm:h-72 w-full border border-slate-200 rounded-xl bg-slate-900 overflow-hidden shadow-md">
            <img 
              src={article.imageUrl} 
              alt={article.title}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=900&auto=format&fit=crop';
              }}
              className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute bottom-3 left-3 bg-slate-900 text-white border border-[#ffcc00] px-3 py-1 font-label text-xs font-medium">
              {article.category} • {article.readTime}
            </div>
          </div>

          {/* Title and Meta */}
          <div className="flex flex-col gap-2">
            <h2 className="font-headline text-2xl sm:text-3xl font-bold uppercase text-slate-900 leading-tight">
              {article.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-label font-semibold text-slate-500 border-y border-slate-200 py-2.5">
              <span className="flex items-center gap-1"><User size={14} className="shrink-0" /> {article.author}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Calendar size={14} className="shrink-0" /> {article.publishedDate}</span>
              <span>•</span>
              <span className="text-primary-600 font-bold">SDG 11 &amp; 13 Focus</span>
            </div>
          </div>

          {/* Summary Callout */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-md">
            <div className="font-label text-xs font-medium text-primary-600 mb-1.5 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">info</span>
              Ringkasan Eksekutif
            </div>
            <p className="font-body text-sm sm:text-base text-slate-900 leading-relaxed">
              {article.summary}
            </p>
          </div>

          {/* Key Tech Pillars */}
          <div className="flex flex-col gap-3">
            <h3 className="font-headline text-lg sm:text-xl font-bold uppercase text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-green-600">check_circle</span>
              Poin Kunci &amp; Keunggulan Sistem
            </h3>
            <div className="grid grid-cols-1 gap-2.5">
              {article.keyPillars.map((pillar, idx) => (
                <div 
                  key={idx}
                  className="bg-green-50 border border-slate-200 rounded-lg p-3.5 flex items-start gap-3 shadow-sm"
                >
                  <span className="bg-primary-50 text-primary-700 font-headline font-bold text-xs w-6 h-6 flex items-center justify-center shrink-0 border border-slate-200">
                    0{idx + 1}
                  </span>
                  <span className="font-body text-xs sm:text-sm text-slate-900 font-medium leading-normal">
                    {pillar}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* IoT Hardware & Sensor Stack */}
          <div className="flex flex-col gap-3">
            <h3 className="font-headline text-lg sm:text-xl font-bold uppercase text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-600">memory</span>
              Arsitektur Sensor IoT &amp; Model AI
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {article.iotTechDetails.map((item, idx) => (
                <div 
                  key={idx}
                  className="bg-white border border-slate-200 rounded-lg p-3 flex flex-col gap-1.5 shadow-sm"
                >
                  <div className="font-headline text-xs font-bold text-primary-600 uppercase">
                    {item.tech}
                  </div>
                  <div className="font-body text-xs text-slate-500 leading-relaxed">
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Article Full Narrative */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 font-body text-sm text-slate-900 leading-relaxed flex flex-col gap-3">
            <h4 className="font-headline text-base font-semibold text-slate-900 border-b border-slate-200 pb-2">
              Analisis Mendalam &amp; Dampak Lapangan
            </h4>
            <div className="whitespace-pre-line text-sm text-[#2a2a2a] leading-relaxed">
              {article.fullContent.trim()}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="bg-slate-100 border-t border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="font-label text-xs text-slate-500 font-bold">
            Pusat Edukasi &amp; Inovasi Hijau • LAPORKOTA
          </div>
          <div className="flex items-center gap-2">
            {onNavigateToForum && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToForum();
                }}
                className="bg-primary-600 text-white border border-slate-200 rounded-lg px-3.5 py-1.5 font-label text-xs font-medium hover:bg-primary-700 shadow-sm active:scale-95 cursor-pointer"
              >
                Diskusikan di Forum
              </button>
            )}
            <button
              onClick={onClose}
              className="bg-slate-900 text-white border border-slate-200 rounded-lg px-4 py-1.5 font-label text-xs font-medium hover:bg-slate-800 shadow-sm active:scale-95 cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
