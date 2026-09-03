import React from 'react';

interface FooterProps {
  onOpenAboutSDG: () => void;
  onOpenPrivacy: () => void;
  onOpenContact: () => void;
  onOpenOpenData: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAboutSDG,
  onOpenPrivacy,
  onOpenContact,
  onOpenOpenData,
}) => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 mt-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 sm:px-6 py-8 max-w-[1280px] mx-auto items-center">
        <div className="flex flex-col gap-2">
          <div className="font-headline text-xl font-bold text-slate-900 uppercase tracking-wider">
            LAPORKOTA
          </div>
          <p className="font-body text-sm text-slate-500 max-w-md">
            © {new Date().getFullYear()} LaporKota. Advancing SDG 11 through transparent civic governance.
          </p>
        </div>

        <nav className="flex flex-wrap md:justify-end items-center gap-3 font-label text-sm font-medium">
          <button
            onClick={onOpenAboutSDG}
            className="text-slate-900 hover:bg-slate-100 hover:text-primary-600 rounded-lg hover:shadow-sm px-2.5 py-1 transition-all cursor-pointer"
          >
            About SDG 11
          </button>
          <button
            onClick={onOpenPrivacy}
            className="text-slate-900 hover:bg-slate-100 hover:text-primary-600 rounded-lg hover:shadow-sm px-2.5 py-1 transition-all cursor-pointer"
          >
            Privacy Policy
          </button>
          <button
            onClick={onOpenContact}
            className="text-slate-900 hover:bg-slate-100 hover:text-primary-600 rounded-lg hover:shadow-sm px-2.5 py-1 transition-all cursor-pointer"
          >
            Contact Us
          </button>
          <button
            onClick={onOpenOpenData}
            className="text-slate-900 hover:bg-slate-100 hover:text-primary-600 rounded-lg hover:shadow-sm px-2.5 py-1 transition-all cursor-pointer"
          >
            Open Data
          </button>
        </nav>
      </div>
    </footer>
  );
};
