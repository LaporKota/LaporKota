/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Toaster, toast } from 'sonner';
import { Report, ReportStatus, CivicNotification, User } from './types';
import { INITIAL_NOTIFICATIONS } from './data/initialReports';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AnimatePresence } from 'motion/react';
import { PageTransition } from './components/motion/PageTransition';
import { HomeView } from './components/HomeView';
import { ReportsView } from './components/ReportsView';
import { MapView } from './components/MapView';
import { ExploreView } from './components/ExploreView';
import { ImpactView } from './components/ImpactView';
import { EcoPulseView } from './components/EcoPulseView';
import { ForumView } from './components/ForumView';
import { PortfolioView } from './components/PortfolioView';
import { ReportDetailModal } from './components/ReportDetailModal';
import { VolunteerModal } from './components/VolunteerModal';
import { NotificationsModal } from './components/NotificationsModal';
import { ProfileModal } from './components/ProfileModal';
import { AboutSDGModal, GeneralInfoModal } from './components/AboutSDGModal';
import { LoginView } from './components/LoginView';
import { SignupView } from './components/SignupView';
import { AdminDashboardView } from './components/AdminDashboardView';

export default function App() {
  // Navigation State - Default to 'home' (Beranda)
  const [currentTab, setCurrentTab] = useState<string>('home');

  // Initialize AnimateOnScroll (AOS v2.3.2)
  useEffect(() => {
    AOS.init({
      duration: 700,
      once: false,
      offset: 40,
      easing: 'ease-out-cubic',
    });
  }, []);

  // Refresh AOS animations on tab changes or dynamic DOM updates
  useEffect(() => {
    const timer = setTimeout(() => {
      AOS.refresh();
    }, 150);
    return () => clearTimeout(timer);
  }, [currentTab]);

  // Reports Data State — di-fetch dari server (Turso DB), bukan localStorage lagi
  const [reports, setReports] = useState<Report[]>([]);
  const [isReportsLoading, setIsReportsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/reports')
      .then((res) => res.json())
      .then((data) => {
        if (data.reports) setReports(data.reports);
      })
      .catch((err) => console.error('Gagal memuat laporan:', err))
      .finally(() => setIsReportsLoading(false));
  }, []);

  // Helper: pasang header Authorization dari token yang tersimpan
  const authHeaders = (): Record<string, string> => {
    const token = localStorage.getItem('token');
    return token
      ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
      : { 'Content-Type': 'application/json' };
  };

  // Notifications State
  const [notifications, setNotifications] = useState<CivicNotification[]>(() => {
    try {
      const saved = localStorage.getItem('laporkota_notifs');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Modals State
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedVolunteerReport, setSelectedVolunteerReport] = useState<Report | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAboutSDGOpen, setIsAboutSDGOpen] = useState(false);
  const [generalInfoType, setGeneralInfoType] = useState<'privacy' | 'contact' | 'opendata' | null>(null);

  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('laporkota_current_user');
      if (saved) return JSON.parse(saved);
    } catch { }
    return null;
  });

  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('laporkota_users');
      if (saved) return JSON.parse(saved);
    } catch { }
    return [{
      id: 'admin-1',
      name: 'Admin Kota',
      email: 'admin@laporkota.com',
      password: 'password123',
      role: 'admin'
    }];
  });

  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('laporkota_current_user', JSON.stringify(currentUser));
    } catch { }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('laporkota_users', JSON.stringify(users));
    } catch { }
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem('laporkota_notifs', JSON.stringify(notifications));
    } catch {
      // ignore
    }
  }, [notifications]);

  // Auto-buka laporan kalau URL mengandung ?report=<id> (dari link hasil "Bagikan")
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedReportId = params.get('report');
    if (sharedReportId && reports.length > 0) {
      const found = reports.find((r) => r.id === sharedReportId);
      if (found) {
        setSelectedReport(found);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reports]);

  // Handle Toggle Upvote
  // Helper: replace 1 report di state `reports` & `selectedReport` dengan versi terbaru dari server
  const applyUpdatedReport = (updated: Report) => {
    setReports((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setSelectedReport((prev) => (prev && prev.id === updated.id ? updated : prev));
  };

  const handleToggleUpvote = (reportId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) {
      alert('Silakan Masuk atau Daftar untuk mendukung laporan.');
      setCurrentTab('login');
      return;
    }

    fetch(`/api/reports/${reportId}/upvote`, { method: 'POST', headers: authHeaders() })
      .then((res) => res.json())
      .then((data) => {
        if (data.report) applyUpdatedReport(data.report);
        else toast.error(data.error || 'Gagal memproses dukungan');
      })
      .catch(() => toast.error('Terjadi kesalahan jaringan'));
  };

  // Handle Volunteer Sign Up Confirmation
  const handleConfirmVolunteer = (reportId: string, volunteerData: { name: string; phone: string; role: string }) => {
    fetch(`/api/reports/${reportId}/volunteer`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ name: volunteerData.name, role: volunteerData.role }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.report) {
          toast.error(data.error || 'Gagal mendaftar relawan');
          return;
        }
        applyUpdatedReport(data.report);
        const notif: CivicNotification = {
          id: `notif-${Date.now()}`,
          title: 'Konfirmasi Aksi Relawan',
          message: `Terima kasih ${volunteerData.name}! Anda telah terdaftar dalam aksi gotong royong "${data.report.title}".`,
          timeAgo: 'Baru saja',
          isRead: false,
          reportId: data.report.id,
          type: 'system',
        };
        setNotifications((prev) => [notif, ...prev]);
      })
      .catch(() => toast.error('Terjadi kesalahan jaringan'));
  };

  // Handle Add New Report from Form
  // Cek login dulu sebelum buka form daftar relawan
  const handleOpenVolunteerModal = (report: Report) => {
    if (!currentUser) {
      alert('Silakan Masuk atau Daftar untuk mengikuti aksi relawan.');
      setCurrentTab('login');
      return;
    }
    setSelectedVolunteerReport(report);
  };

  const handleCreateReport = (newReportData: Partial<Report>) => {
    if (!currentUser) {
      alert('Silakan Masuk atau Daftar untuk membuat laporan.');
      setCurrentTab('login');
      return;
    }

    const draftReport: Partial<Report> = {
      title: newReportData.title || 'Laporan Warga Baru',
      category: newReportData.category || 'fasilitas',
      categoryLabel: newReportData.categoryLabel || 'Fasilitas Umum',
      categoryIcon: newReportData.categoryIcon || 'report',
      description: newReportData.description || '',
      location: newReportData.location || 'Lokasi Terpilih',
      city: newReportData.city || (currentUser.domicile ? currentUser.domicile.split(',')[0] : 'Jakarta'),
      lat: newReportData.lat || -6.2,
      lng: newReportData.lng || 106.8,
      mapTopPct: newReportData.mapTopPct || 40,
      mapLeftPct: newReportData.mapLeftPct || 50,
      timeAgo: 'Baru saja',
      timestamp: Date.now(),
      status: 'baru',
      upvotes: 1,
      hasUpvoted: true,
      upvotedBy: [currentUser.id],
      volunteerCount: 1,
      userJoinedVolunteer: false,
      volunteerActionDate: 'Sabtu Mendatang (07:30 WIB)',
      imageUrl:
        newReportData.imageUrl ||
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCWr_lkpfQCI44JNAXYqVGOligdK6hKpa2qXvASY05dcYN1CuURLlcUnFmmexUoZNL1WR18HuYH97K4vYIPYyMgVlDEEmKAhGudGDu_O2e0D1fysBrtk7Q0JA9obSrTY2uTT8-khG8Cs_4t2B60wEMSLQGflPbV0kUVY06PUNY8ieDKTuSaS8_eYKyXIiP2RA_whGxHmUM88yCSFPM-R3giOEPjuIImwxerYR6wOASYEZWLm1Mfe5G_XQ',
      reporterName: currentUser.name,
      departmentAssigned: 'Dinas Terkait (Disposisi Otomatis)',
      priority: 'Tinggi',
      updates: [
        {
          id: `upd-${Date.now()}`,
          date: 'Baru saja',
          author: 'Sistem LaporKota',
          role: 'Smart Dispatch',
          message: 'Laporan berhasil dicatat, dipetakan ke koordinat publik, dan diteruskan ke posko dinas terkait.',
          statusChange: 'baru',
        },
      ],
      comments: [],
    };

    fetch('/api/reports', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(draftReport),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.report) {
          toast.error(data.error || 'Gagal membuat laporan');
          return;
        }
        setReports((prev) => [data.report, ...prev]);
        const newNotif: CivicNotification = {
          id: `notif-${Date.now()}`,
          title: 'Laporan Baru Terkirim',
          message: `Laporan "${data.report.title}" telah dipublikasikan di peta LaporKota.`,
          timeAgo: 'Baru saja',
          isRead: false,
          reportId: data.report.id,
          type: 'system',
        };
        setNotifications((prev) => [newNotif, ...prev]);
      })
      .catch(() => toast.error('Terjadi kesalahan jaringan'));
  };

  // Handle Status Update (e.g. Petugas mode) — hanya admin, divalidasi juga di server
  const handleUpdateStatus = (reportId: string, newStatus: ReportStatus, note: string) => {
    fetch(`/api/reports/${reportId}/status`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ status: newStatus, note }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.report) {
          toast.error(data.error || 'Gagal memperbarui status');
          return;
        }
        applyUpdatedReport(data.report);
        const notif: CivicNotification = {
          id: `notif-${Date.now()}`,
          title: `Status Laporan Diperbarui: ${newStatus.toUpperCase()}`,
          message: `Laporan "${data.report.title}" telah diperbarui menjadi ${newStatus.toUpperCase()}. Catatan: "${note}"`,
          timeAgo: 'Baru saja',
          isRead: false,
          reportId: data.report.id,
          type: 'status',
        };
        setNotifications((prev) => [notif, ...prev]);
      })
      .catch(() => toast.error('Terjadi kesalahan jaringan'));
  };

  // Handle Add Comment
  const handleAddComment = (reportId: string, commentText: string) => {
    if (!currentUser) {
      alert('Silakan Masuk atau Daftar untuk berkomentar.');
      setCurrentTab('login');
      return;
    }

    fetch(`/api/reports/${reportId}/comment`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ content: commentText, userName: currentUser.name }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.report) applyUpdatedReport(data.report);
        else toast.error(data.error || 'Gagal mengirim komentar');
      })
      .catch(() => toast.error('Terjadi kesalahan jaringan'));
  };

  const handleSelectNotification = (reportId: string) => {
    const rep = reports.find((r) => r.id === reportId);
    if (rep) {
      setSelectedReport(rep);
    }
  };

  const handleMarkAllNotifsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;

  // Auth Handlers
  const handleLogin = async (email: string, pass: string) => {
    setAuthError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Email atau password salah.');
        toast.error(data.error || 'Gagal login');
        return;
      }
      localStorage.setItem('token', data.token);
      setCurrentUser(data.user);
      toast.success('Berhasil masuk!');
      if (data.user.role === 'admin') {
        setCurrentTab('adminDashboard');
      } else {
        setCurrentTab('home');
      }
    } catch (err) {
      setAuthError('Koneksi ke server gagal.');
      toast.error('Koneksi ke server gagal.');
    }
  };

  const handleSignup = async (name: string, email: string, pass: string, domicile: string) => {
    setAuthError(null);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: pass, domicile }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Gagal mendaftar.');
        toast.error(data.error || 'Gagal mendaftar.');
        return;
      }
      localStorage.setItem('token', data.token);
      setCurrentUser(data.user);
      toast.success('Pendaftaran berhasil!');
      if (data.user.role === 'admin') {
        setCurrentTab('adminDashboard');
      } else {
        setCurrentTab('home');
      }
    } catch (err) {
      setAuthError('Koneksi ke server gagal.');
      toast.error('Koneksi ke server gagal.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setCurrentTab('home');
    setIsProfileOpen(false);
    toast.success('Berhasil keluar!');
  };

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen flex flex-col font-body selection:bg-primary-600 selection:text-slate-900">
      <Toaster position="top-center" richColors />
      {/* Top Navbar */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenReportModal={() => setCurrentTab('map')}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        unreadCount={unreadNotifsCount}
        user={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Views */}
      <main className="flex-grow flex flex-col">
        <AnimatePresence mode="wait">
          <PageTransition key={currentTab} className="flex-grow flex flex-col">
    
        {currentTab === 'login' && (
          <LoginView 
            onLogin={handleLogin} 
            onNavigateToSignup={() => { setAuthError(null); setCurrentTab('signup'); }} 
            errorMsg={authError} 
          />
        )}
        
        {currentTab === 'signup' && (
          <SignupView 
            onSignup={handleSignup} 
            onNavigateToLogin={() => { setAuthError(null); setCurrentTab('login'); }} 
            errorMsg={authError} 
          />
        )}

        {currentTab === 'adminDashboard' && currentUser?.role === 'admin' && (
          <AdminDashboardView 
            user={currentUser} 
            reports={reports} 
            onNavigateToReports={() => setCurrentTab('reports')} 
          />
        )}

        {currentTab === 'adminDashboard' && currentUser?.role !== 'admin' && (
          <div className="flex-grow flex items-center justify-center p-8 text-center">
            <h2 className="font-headline text-2xl text-rose-500 font-bold uppercase bg-rose-50 border-4 border-rose-200 p-6 shadow-lg">
              Akses Ditolak. Anda bukan Admin.
            </h2>
          </div>
        )}

        {currentTab === 'home' && (
          <HomeView
            reports={reports}
            onSelectReport={(report) => setSelectedReport(report)}
            onToggleUpvote={handleToggleUpvote}
            onOpenReportModal={() => setCurrentTab('map')}
            onOpenVolunteerModal={handleOpenVolunteerModal}
            onNavigateToReports={() => setCurrentTab('reports')}
            onNavigateToMap={() => setCurrentTab('map')}
            onNavigateToEcoPulse={() => setCurrentTab('ecopulse')}
            onNavigateToForum={() => setCurrentTab('forum')}
            onNavigateToPortfolio={() => setCurrentTab('portfolio')}
            onNavigateToImpact={() => setCurrentTab('impact')}
          />
        )}

        {currentTab === 'reports' && (
          <ReportsView
            reports={reports}
            onSelectReport={(report) => setSelectedReport(report)}
            onToggleUpvote={handleToggleUpvote}
            onOpenReportModal={() => setCurrentTab('map')}
            onOpenVolunteerModal={handleOpenVolunteerModal}
            onNavigateToEcoPulse={() => setCurrentTab('ecopulse')}
            onNavigateToForum={() => setCurrentTab('forum')}
            onNavigateToPortfolio={() => setCurrentTab('portfolio')}
          />
        )}

        {currentTab === 'ecopulse' && (
          <EcoPulseView
            onOpenReportModal={() => setCurrentTab('map')}
            onNavigateToForum={() => setCurrentTab('forum')}
            onNavigateToPortfolio={() => setCurrentTab('portfolio')}
          />
        )}

        {currentTab === 'forum' && (
          <ForumView
            onOpenReportModal={() => setCurrentTab('map')}
            user={currentUser}
          />
        )}

        {currentTab === 'portfolio' && (
          <PortfolioView
            onOpenReportModal={() => setCurrentTab('map')}
            onNavigateToEcoPulse={() => setCurrentTab('ecopulse')}
            user={currentUser}
          />
        )}

        {currentTab === 'map' && (
          <MapView
            reports={reports}
            onSelectReport={(report) => setSelectedReport(report)}
            onSubmitReport={handleCreateReport}
          />
        )}

        {currentTab === 'explore' && (
          <ExploreView
            reports={reports}
            onSelectReport={(report) => setSelectedReport(report)}
            onToggleUpvote={handleToggleUpvote}
            onNavigateToMap={() => setCurrentTab('map')}
          />
        )}

        {currentTab === 'impact' && (
          <ImpactView
            reports={reports}
            onOpenReportModal={() => setCurrentTab('map')}
            user={currentUser}
          />
        )}
      
          </PageTransition>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer
        onOpenAboutSDG={() => setIsAboutSDGOpen(true)}
        onOpenPrivacy={() => setGeneralInfoType('privacy')}
        onOpenContact={() => setGeneralInfoType('contact')}
        onOpenOpenData={() => setGeneralInfoType('opendata')}
      />

      {/* Modals */}
      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onToggleUpvote={handleToggleUpvote}
          onUpdateStatus={handleUpdateStatus}
          onAddComment={handleAddComment}
          currentUser={currentUser}
        />
      )}

      {selectedVolunteerReport && (
        <VolunteerModal
          report={selectedVolunteerReport}
          onClose={() => setSelectedVolunteerReport(null)}
          onConfirmVolunteer={handleConfirmVolunteer}
        />
      )}

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllNotifsRead}
        onSelectNotification={handleSelectNotification}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        reports={reports}
        onSelectReport={(report) => setSelectedReport(report)}
        user={currentUser}
      />

      <AboutSDGModal
        isOpen={isAboutSDGOpen}
        onClose={() => setIsAboutSDGOpen(false)}
      />

      <GeneralInfoModal
        type={generalInfoType}
        onClose={() => setGeneralInfoType(null)}
      />
    </div>
  );
}
