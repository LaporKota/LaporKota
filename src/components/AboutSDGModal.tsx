import React from 'react';

interface AboutSDGModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutSDGModal: React.FC<AboutSDGModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-xl shadow-xl w-full max-w-xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-primary-600 border-b border-slate-200 p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px] text-slate-900">public</span>
            <h3 className="font-headline text-lg font-semibold tracking-tight">
              TENTANG SDG 11: KOTA &amp; KOMUNITAS BERKELANJUTAN
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 bg-white border border-slate-200 rounded-lg font-bold text-sm flex items-center justify-center hover:bg-rose-500 hover:text-white shadow-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex flex-col gap-4 font-body text-xs sm:text-sm text-slate-900 leading-relaxed">
          <p>
            <strong>SDG 11 (Sustainable Development Goal 11)</strong> adalah tujuan pembangunan berkelanjutan dari PBB yang berfokus untuk <em>“Menjadikan kota dan permukiman manusia inklusif, aman, tangguh, dan berkelanjutan.”</em>
          </p>

          <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col gap-2">
            <h4 className="font-headline text-sm font-semibold text-primary-600">
              Pilar Aksi LaporKota dalam SDG 11:
            </h4>
            <ul className="list-disc pl-5 flex flex-col gap-1.5 text-xs">
              <li>
                <strong>Target 11.2 (Transportasi & Aksesibilitas):</strong> Memperbaiki trotoar, lubang jalan, dan guiding block bagi difabel.
              </li>
              <li>
                <strong>Target 11.6 (Dampak Lingkungan Perkotaan):</strong> Pengurangan sampah liar dan percepatan penanganan limbah drainase.
              </li>
              <li>
                <strong>Target 11.7 (Ruang Publik Hijau & Aman):</strong> Pemeliharaan taman kota, RPTRA, dan penerangan jalan malam hari.
              </li>
              <li>
                <strong>Target 11.3 (Partisipasi Warga):</strong> Menghubungkan partisipasi langsung warga dengan transparansi birokrasi.
              </li>
            </ul>
          </div>

          <p className="text-xs text-slate-500">
            Melalui LaporKota, data pengaduan tidak berakhir di arsip, melainkan menjadi dataset terbuka (Open Data) yang dapat diteliti akademisi, jurnalis, dan pembuat kebijakan publik.
          </p>

          <button
            onClick={onClose}
            className="mt-2 bg-slate-900 text-white border border-slate-200 rounded-lg py-2.5 font-label text-xs font-medium hover:bg-slate-100 hover:text-slate-900 shadow-sm cursor-pointer"
          >
            Mengerti &amp; Kembali
          </button>
        </div>
      </div>
    </div>
  );
};

interface GeneralInfoModalProps {
  type: 'privacy' | 'contact' | 'opendata' | null;
  onClose: () => void;
}

export const GeneralInfoModal: React.FC<GeneralInfoModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center">
          <h3 className="font-headline text-lg font-semibold tracking-tight">
            {type === 'privacy' && 'KEBIJAKAN PRIVASI & DATA WARGA'}
            {type === 'contact' && 'HUBUNGI TIM LAPORKOTA'}
            {type === 'opendata' && 'PORTAL DATA TERBUKA (OPEN DATA)'}
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 bg-white border border-slate-200 rounded-lg font-bold text-sm flex items-center justify-center hover:bg-rose-500 hover:text-white shadow-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex flex-col gap-4 font-body text-xs sm:text-sm text-slate-900 leading-relaxed">
          {type === 'privacy' && (
            <>
              <p>
                LaporKota berkomitmen melindungi privasi data warga. Identitas pribadi (nomor telepon, NIK, dan email pribadi) dienkripsi dan tidak dipublikasikan ke feed umum.
              </p>
              <div className="bg-white border border-slate-200 rounded-lg p-3 text-xs">
                <strong>Prinsip Kerahasiaan:</strong> Laporan dapat diunggah dengan opsi anonim atau nama samaran warga tanpa mengurangi bobot prioritas tindak lanjut dinas.
              </div>
            </>
          )}

          {type === 'contact' && (
            <>
              <p>
                Punya pertanyaan, usulan integrasi sistem API daerah, atau kerjasama riset kebijakan publik?
              </p>
              <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col gap-2 text-xs">
                <div><strong>Email:</strong> kontak@laporkota.id</div>
                <div><strong>Sekretariat:</strong> Gd. Inovasi Tata Kota, Jakarta Pusat</div>
                <div><strong>Hotline Pengaduan Darurat:</strong> 112 (Siaga Kota)</div>
              </div>
            </>
          )}

          {type === 'opendata' && (
            <>
              <p>
                LaporKota berkomitmen untuk membuka data agregat laporan publik, kecepatan respon dinas, serta status penyelesaian secara terbuka di masa mendatang, dengan lisensi Creative Commons (CC-BY 4.0).
              </p>
              <div className="bg-white border border-slate-200 rounded-lg p-3 text-xs font-mono">
                Status: Dalam pengembangan (Roadmap Fase 3)<br/>
                Format yang direncanakan: JSON, GeoJSON, CSV
              </div>
            </>
          )}

          <button
            onClick={onClose}
            className="mt-2 bg-slate-900 text-white border border-slate-200 rounded-lg py-2 font-label text-xs font-medium hover:bg-slate-100 hover:text-slate-900 shadow-sm cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
