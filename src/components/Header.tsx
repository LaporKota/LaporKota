import React, { useState } from 'react';
import { User } from '../types';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenReportModal: () => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  unreadCount: number;
  user: User | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  onOpenReportModal,
  onOpenNotifications,
  onOpenProfile,
  unreadCount,
  user,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Grouped Navigation Items
  const navItems = [
    { id: 'reports', label: 'Laporan', icon: 'list_alt' },
    { id: 'map', label: 'Peta Kota', icon: 'map' },
    { id: 'ecopulse', label: 'Eco-Pulse', icon: 'compost', badge: 'LIVE' },
    { id: 'forum', label: 'Forum', icon: 'forum' },
    { id: 'portfolio', label: 'Portofolio', icon: 'folder_open' },
    { id: 'impact', label: 'Impact', icon: 'public' },
    ...(user?.role === 'admin' ? [{ id: 'adminDashboard', label: 'Admin', icon: 'dashboard' }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <button
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="bg-primary-600 text-white w-8 h-8 flex items-center justify-center rounded-lg shadow-sm group-hover:bg-primary-700 transition-colors">
              <span className="material-symbols-outlined text-[20px]">policy</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="font-headline text-lg font-bold leading-none tracking-tight text-slate-900 group-hover:text-primary-600 transition-colors">
                LaporKota
              </span>
              <span className="text-[9px] font-label font-semibold text-slate-500 uppercase tracking-widest hidden sm:block">
                Sistem Pengaduan Publik
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1" aria-label="Navigasi Utama">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`font-label text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? 'text-primary-700 bg-primary-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                  title={item.label}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="bg-primary-100 text-primary-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Action Buttons & Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notification Button */}
          <button
            onClick={onOpenNotifications}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors relative cursor-pointer"
            title="Pemberitahuan"
            aria-label="Pemberitahuan"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {user ? (
            <>
              {/* Account Profile Button */}
              <button
                onClick={onOpenProfile}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                title="Profil Warga"
                aria-label="Profil Warga"
              >
                <span className="material-symbols-outlined text-[20px]">account_circle</span>
              </button>
              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="hidden sm:flex p-2 rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                title="Keluar"
                aria-label="Keluar"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setCurrentTab('login')}
              className="px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer flex items-center gap-1.5 text-sm font-medium"
              title="Masuk"
            >
              <span className="hidden sm:inline">Masuk</span>
            </button>
          )}

          {/* Report Issue CTA Button */}
          <button
            onClick={onOpenReportModal}
            className="bg-primary-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary-700 transition-all shadow-sm active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <span className="hidden sm:inline">Buat Laporan</span>
            <span className="sm:hidden">Lapor</span>
            <span className="material-symbols-outlined text-[18px]">add</span>
          </button>

          {/* Mobile Hamburger Toggle (< 1280px due to xl breakpoint above) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 xl:hidden transition-colors cursor-pointer"
            aria-label="Buka Menu Navigasi"
            aria-expanded={mobileMenuOpen}
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 py-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left text-sm font-medium px-4 py-3 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                  currentTab === item.id
                    ? 'text-primary-700 bg-primary-50'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-primary-100 text-primary-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
            {!user && (
              <button
                onClick={() => {
                  setCurrentTab('login');
                  setMobileMenuOpen(false);
                }}
                className="text-left text-sm font-medium px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-3 transition-colors cursor-pointer mt-2"
              >
                <span className="material-symbols-outlined text-[20px]">login</span>
                <span>Masuk / Daftar</span>
              </button>
            )}
            {user && (
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="text-left text-sm font-medium px-4 py-3 rounded-lg text-rose-600 hover:bg-rose-50 flex items-center gap-3 transition-colors cursor-pointer mt-2"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
                <span>Keluar</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
