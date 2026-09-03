import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { GREEN_EDU_ARTICLES } from '../data/greenEduArticles';
import { GreenEduArticle } from '../types';
import { GreenEduArticleModal } from './GreenEduArticleModal';
import { Clock, Check, Zap, Folder } from 'lucide-react';

// Swiper core & module styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface GreenEduSectionProps {
  onNavigateToForum?: () => void;
  onNavigateToEcoPulse?: () => void;
  onNavigateToPortfolio?: () => void;
}

export const GreenEduSection: React.FC<GreenEduSectionProps> = ({
  onNavigateToForum,
  onNavigateToEcoPulse,
  onNavigateToPortfolio,
}) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<GreenEduArticle | null>(null);

  return (
    <section 
      className="w-full bg-white border border-slate-200 rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg flex flex-col gap-6 relative overflow-hidden"
      data-aos="fade-up"
    >
      {/* Section Header & Navigation Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-primary-500 border border-slate-200 inline-block"></span>
            <span className="font-label text-xs font-medium text-primary-600 tracking-wider">
              TEKNOLOGI HIJAU, IOT &amp; AI
            </span>
          </div>
          <h2 className="font-headline text-2xl sm:text-3xl lg:text-4xl font-bold uppercase text-slate-900 tracking-tight">
            Pusat Edukasi &amp; Inovasi Hijau
          </h2>
          <p className="font-body text-xs sm:text-sm text-slate-500 max-w-2xl">
            Pelajari bagaimana rekayasa IoT, sensor cerdas, dan model AI diterapkan untuk memecahkan isu sampah, energi surya, dan resiliensi iklim perkotaan.
          </p>
        </div>

        {/* Custom Neo-Brutalist Slider Controls */}
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="w-10 h-10 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-900 font-bold flex items-center justify-center shadow-sm active:scale-95 transition-all cursor-pointer"
            title="Artikel Sebelumnya"
            aria-label="Artikel Sebelumnya"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="w-10 h-10 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-900 font-bold flex items-center justify-center shadow-sm active:scale-95 transition-all cursor-pointer"
            title="Artikel Selanjutnya"
            aria-label="Artikel Selanjutnya"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Swiper Slider Carousel Container */}
      <div className="w-full relative py-1">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
          spaceBetween={20}
          slidesPerView={1}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            clickable: true,
            bulletClass: 'swiper-pagination-bullet !w-3 !h-3 !bg-slate-900 !opacity-30 !rounded-none !border !border-slate-200 !m-1',
            bulletActiveClass: '!opacity-100 !bg-primary-600 !border-2 !border-slate-200',
          }}
          breakpoints={{
            640: {
              slidesPerView: 1.5,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
          }}
          className="pb-12"
        >
          {GREEN_EDU_ARTICLES.map((article) => (
            <SwiperSlide key={article.id} className="h-auto">
              <article 
                onClick={() => setSelectedArticle(article)}
                className="bg-white border border-slate-200 rounded-xl shadow-md hover:-translate-y-1 hover:shadow-lg transition-all duration-200 flex flex-col h-full cursor-pointer group"
              >
                {/* Image Cover with Badge */}
                <div className="relative h-48 w-full overflow-hidden border-b border-slate-200 bg-slate-900">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=900&auto=format&fit=crop';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-primary-600 text-white border border-slate-200 rounded-lg px-2.5 py-0.5 font-label text-[11px] font-medium shadow-sm">
                    {article.badge}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-slate-900 text-white border border-white/40 px-2 py-0.5 font-label text-[10px] font-bold flex items-center gap-1">
                    <Clock size={12} /> {article.readTime}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 sm:p-5 flex flex-col flex-grow gap-3 justify-between">
                  <div className="flex flex-col gap-2">
                    <div className="font-label text-[11px] font-medium text-primary-600 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">science</span>
                      {article.category}
                    </div>

                    <h3 className="font-headline text-base sm:text-lg font-bold text-slate-900 uppercase leading-snug group-hover:text-primary-600 transition-colors line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="font-body text-xs text-slate-500 leading-relaxed line-clamp-3">
                      {article.summary}
                    </p>
                  </div>

                  {/* Tech stack pill tags */}
                  <div className="pt-3 border-t-2 border-slate-200 flex flex-col gap-3">
                    <div className="flex flex-wrap gap-1.5">
                      {article.keyPillars.slice(0, 2).map((p, idx) => (
                        <span 
                          key={idx}
                          className="bg-slate-50 border border-slate-200 px-2 py-0.5 font-label text-[10px] text-slate-900 font-bold truncate max-w-full flex items-center gap-1"
                        >
                          <Check size={10} /> {p.split(' ')[0]} {p.split(' ')[1] || ''}
                        </span>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <button
                      type="button"
                      className="w-full bg-primary-50 text-primary-700 border border-slate-200 rounded-lg py-2 px-3 font-label text-xs font-medium group-hover:bg-slate-100 group-hover:text-slate-900 transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Baca Panduan Lengkap</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Bottom Quick Links to Related Hubs */}
      <div className="bg-slate-100 border border-slate-200 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-label">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <span className="material-symbols-outlined text-primary-600 text-[18px]">hub</span>
          <span>Eksplorasi modul live telemetri &amp; blueprint proyek kota:</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {onNavigateToEcoPulse && (
            <button
              onClick={onNavigateToEcoPulse}
              className="bg-white border border-slate-200 rounded-lg px-3 py-1 font-bold text-slate-900 hover:bg-slate-100 shadow-sm active:scale-95 transition-all cursor-pointer flex items-center gap-1"
            >
              Eco-Pulse Live (IoT) <Zap size={14} />
            </button>
          )}
          {onNavigateToPortfolio && (
            <button
              onClick={onNavigateToPortfolio}
              className="bg-primary-600 text-white border border-slate-200 rounded-lg px-3 py-1 font-bold hover:bg-primary-700 shadow-sm active:scale-95 transition-all cursor-pointer flex items-center gap-1"
            >
              Portfolio Hijau &amp; Blueprint <Folder size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <GreenEduArticleModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
          onNavigateToForum={onNavigateToForum}
        />
      )}
    </section>
  );
};
