import React, { useEffect, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Toaster, toast } from 'sonner';

import { Report, ReportStatus, User, CivicNotification } from './types';
import { INITIAL_REPORTS, INITIAL_NOTIFICATIONS } from './data/initialReports';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { MapView } from './components/MapView';
import { ReportsView } from './components/ReportsView';
import { ForumView } from './components/ForumView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { EcoPulseView } from './components/EcoPulseView';
import { ImpactView } from './components/ImpactView';
import { PortfolioView } from './components/PortfolioView';
import { CreateReportView, ReportLocationPrefill } from './components/CreateReportView';
import { LoginView } from './components/LoginView';
import { SignupView } from './components/SignupView';
import { ReportDetailModal } from './components/ReportDetailModal';
import { NotificationsModal } from './components/NotificationsModal';
import { ProfileModal } from './components/ProfileModal';
import { VolunteerModal } from './components/VolunteerModal';
import { AboutSDGModal, GeneralInfoModal } from './components/AboutSDGModal';
import { PageTransition } from './components/motion/PageTransition';

type GeneralInfoType = 'privacy' | 'contact' | 'opendata' | null;

const App: React.FC = () => {
  // ===================== NAVIGATION =====================
  const [currentTab, setCurrentTab] = useState<string>('home');

  // ===================== AUTH STATE =====================
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [authError, setAuthError] = useState<string | null>(null);

  // ===================== REPORTS STATE =====================
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [createReportPrefill, setCreateReportPrefill] = useState<ReportLocationPrefill | null>(null);
  const [volunteerModalReport, setVolunteerModalReport] = useState<Report | null>(null);

  // ===================== NOTIFICATIONS STATE =====================
  const [notifications, setNotifications] = useState<CivicNotification[]>(INITIAL_NOTIFICATIONS);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // ===================== MISC MODALS =====================
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAboutSDGOpen, setIsAboutSDGOpen] = useState(false);
  const [generalInfoType, setGeneralInfoType] = useState<GeneralInfoType>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // ===================== INIT: AOS & LOAD REPORTS =====================
  useEffect(() => {
    AOS.init({ duration: 700, once: true, offset: 40 });
  }, []);

  useEffect(() => {
    AOS.refresh();
  }, [currentTab, reports]);

  useEffect(() => {
    fetch('/api/reports')
      .then((res) => res.json())
      .then((data) => {
        if (data?.reports) setReports(data.reports);
      })
      .catch((err) => {
        console.error('Gagal memuat laporan dari server, menggunakan data lokal:', err);
      });
  }, []);

  // Kalau tab admin diakses tapi user bukan admin (mis. logout), lempar balik ke home
  useEffect(() => {
    if (currentTab === 'adminDashboard' && (!user || user.role !== 'admin')) {
      setCurrentTab('home');
    }
  }, [currentTab, user]);

  // ===================== AUTH HELPERS =====================
  const authHeaders = (): Record<string, string> =>
    token
      ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
      : { 'Content-Type': 'application/json' };

  const requireLogin = (message?: string): boolean => {
    if (!user) {
      if (message) toast.warning(message);
      setCurrentTab('login');
      return false;
    }
    return true;
  };

  // ===================== AUTH ACTIONS =====================
  const handleLogin = async (email: string, password: string) => {
    setAuthError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Email atau password salah');
        return;
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      toast.success(`Selamat datang kembali, ${data.user.name}!`);
      setCurrentTab('home');
    } catch (err) {
      console.error('Login error:', err);
      setAuthError('Terjadi kesalahan jaringan. Silakan coba lagi.');
    }
  };

  const handleSignup = async (name: string, email: string, password: string, domicile: string) => {
    setAuthError(null);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, domicile }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Gagal mendaftar. Silakan coba lagi.');
        return;
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      toast.success(`Akun berhasil dibuat. Selamat datang, ${data.user.name}!`);
      setCurrentTab('home');
    } catch (err) {
      console.error('Signup error:', err);
      setAuthError('Terjadi kesalahan jaringan. Silakan coba lagi.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setCurrentTab('home');
    toast.success('Anda telah keluar.');
  };

  // ===================== REPORT ACTIONS =====================
  const updateReportInState = (updated: Report) => {
    setReports((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setSelectedReport((prev) => (prev && prev.id === updated.id ? updated : prev));
  };

  const handleToggleUpvote = async (reportId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!requireLogin('Silakan masuk untuk mendukung laporan ini.')) return;
    try {
      const res = await fetch(`/api/reports/${reportId}/upvote`, {
        method: 'POST',
        headers: authHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.report) updateReportInState(data.report);
    } catch (err) {
      console.error('Upvote error:', err);
      toast.error('Gagal memberi dukungan. Coba lagi.');
    }
  };

  const handleUpdateStatus = async (reportId: string, newStatus: ReportStatus, note: string) => {
    try {
      const res = await fetch(`/api/reports/${reportId}/status`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ status: newStatus, note }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Gagal memperbarui status laporan.');
        return;
      }
      updateReportInState(data.report);
      toast.success('Status laporan berhasil diperbarui.');
    } catch (err) {
      console.error('Update status error:', err);
      toast.error('Terjadi kesalahan saat memperbarui status.');
    }
  };

  const handleAddComment = async (reportId: string, commentText: string) => {
    if (!requireLogin('Silakan masuk untuk berkomentar.')) return;
    try {
      const res = await fetch(`/api/reports/${reportId}/comment`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ content: commentText, userName: user?.name }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Gagal mengirim komentar.');
        return;
      }
      updateReportInState(data.report);
    } catch (err) {
      console.error('Add comment error:', err);
      toast.error('Terjadi kesalahan saat mengirim komentar.');
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    try {
      const res = await fetch(`/api/reports/${reportId}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Gagal menghapus laporan.');
        return;
      }
      setReports((prev) => prev.filter((r) => r.id !== reportId));
      setSelectedReport(null);
      toast.success('Laporan berhasil dihapus.');
    } catch (err) {
      console.error('Delete report error:', err);
      toast.error('Terjadi kesalahan saat menghapus laporan.');
    }
  };

  const handleConfirmVolunteer = async (
    reportId: string,
    volunteerData: { name: string; phone: string; role: string }
  ) => {
    try {
      const res = await fetch(`/api/reports/${reportId}/volunteer`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(volunteerData),
      });
      const data = await res.json();
      if (res.ok && data.report) {
        updateReportInState(data.report);
      }
    } catch (err) {
      console.error('Volunteer error:', err);
      toast.error('Gagal mendaftar sebagai relawan.');
    }
  };

  const handleSubmitReport = async (newReport: Partial<Report>) => {
    if (!requireLogin('Silakan masuk untuk membuat laporan.')) return;
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(newReport),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Gagal mengirim laporan.');
        return;
      }
      setReports((prev) => [data.report, ...prev]);
      toast.success('Laporan berhasil dikirim & dipublikasikan!');
    } catch (err) {
      console.error('Submit report error:', err);
      toast.error('Terjadi kesalahan saat mengirim laporan.');
    }
  };

  // ===================== NAVIGATION HELPERS =====================
  const handleOpenReportModal = () => {
    if (!requireLogin('Silakan masuk untuk membuat laporan baru.')) return;
    setCreateReportPrefill(null);
    setCurrentTab('create');
  };

  const handleCreateReportAt = (prefill: ReportLocationPrefill | null) => {
    if (!requireLogin('Silakan masuk untuk membuat laporan baru.')) return;
    setCreateReportPrefill(prefill);
    setCurrentTab('create');
  };

  const handleOpenVolunteerModal = (report: Report) => {
    if (!requireLogin('Silakan masuk untuk mengikuti aksi relawan.')) return;
    setVolunteerModalReport(report);
  };

  const handleOpenProfile = () => {
    if (!requireLogin('Silakan masuk untuk melihat profil Anda.')) return;
    setIsProfileOpen(true);
  };

  const handleSelectNotification = (reportId: string) => {
    setNotifications((prev) => prev.map((n) => (n.reportId === reportId ? { ...n, isRead: true } : n)));
    setIsNotificationsOpen(false);
    const report = reports.find((r) => r.id === reportId);
    if (report) setSelectedReport(report);
  };

  // ===================== RENDER CURRENT TAB =====================
  const renderContent = () => {
    switch (currentTab) {
      case 'home':
        return (
          <HomeView
            reports={reports}
            onSelectReport={setSelectedReport}
            onToggleUpvote={handleToggleUpvote}
            onOpenReportModal={handleOpenReportModal}
            onOpenVolunteerModal={handleOpenVolunteerModal}
            onNavigateToReports={() => setCurrentTab('reports')}
            onNavigateToMap={() => setCurrentTab('map')}
            onNavigateToEcoPulse={() => setCurrentTab('ecopulse')}
            onNavigateToForum={() => setCurrentTab('forum')}
            onNavigateToPortfolio={() => setCurrentTab('portfolio')}
            onNavigateToImpact={() => setCurrentTab('impact')}
            user={user}
          />
        );
      case 'reports':
        return (
          <ReportsView
            reports={reports}
            onSelectReport={setSelectedReport}
            onToggleUpvote={handleToggleUpvote}
            onOpenReportModal={handleOpenReportModal}
            onOpenVolunteerModal={handleOpenVolunteerModal}
            onNavigateToEcoPulse={() => setCurrentTab('ecopulse')}
            onNavigateToForum={() => setCurrentTab('forum')}
            onNavigateToPortfolio={() => setCurrentTab('portfolio')}
            user={user}
          />
        );
      case 'map':
        return (
          <MapView reports={reports} onSelectReport={setSelectedReport} onCreateReportAt={handleCreateReportAt} />
        );
      case 'create':
        return (
          <CreateReportView
            onSubmitReport={handleSubmitReport}
            onCancel={() => setCurrentTab('map')}
            initialLocation={createReportPrefill}
            onClearInitialLocation={() => setCreateReportPrefill(null)}
            onPickOnMap={() => setCurrentTab('map')}
            user={user}
          />
        );
      case 'forum':
        return <ForumView onOpenReportModal={handleOpenReportModal} user={user} />;
      case 'ecopulse':
        return (
          <EcoPulseView
            onOpenReportModal={handleOpenReportModal}
            onNavigateToForum={() => setCurrentTab('forum')}
            onNavigateToPortfolio={() => setCurrentTab('portfolio')}
          />
        );
      case 'portfolio':
        return (
          <PortfolioView onNavigateToEcoPulse={() => setCurrentTab('ecopulse')} user={user} />
        );
      case 'impact':
        return <ImpactView reports={reports} onOpenReportModal={handleOpenReportModal} user={user} />;
      case 'adminDashboard':
        if (!user || user.role !== 'admin') return null;
        return (
          <AdminDashboardView
            user={user}
            reports={reports}
            onNavigateToReports={() => setCurrentTab('reports')}
            onOpenReport={setSelectedReport}
          />
        );
      case 'login':
        return (
          <LoginView
            onLogin={handleLogin}
            onNavigateToSignup={() => {
              setAuthError(null);
              setCurrentTab('signup');
            }}
            errorMsg={authError}
          />
        );
      case 'signup':
        return (
          <SignupView
            onSignup={handleSignup}
            onNavigateToLogin={() => {
              setAuthError(null);
              setCurrentTab('login');
            }}
            errorMsg={authError}
          />
        );
      default:
        return (
          <HomeView
            reports={reports}
            onSelectReport={setSelectedReport}
            onToggleUpvote={handleToggleUpvote}
            onOpenReportModal={handleOpenReportModal}
            onOpenVolunteerModal={handleOpenVolunteerModal}
            onNavigateToReports={() => setCurrentTab('reports')}
            onNavigateToMap={() => setCurrentTab('map')}
            onNavigateToEcoPulse={() => setCurrentTab('ecopulse')}
            onNavigateToForum={() => setCurrentTab('forum')}
            onNavigateToPortfolio={() => setCurrentTab('portfolio')}
            onNavigateToImpact={() => setCurrentTab('impact')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenReportModal={handleOpenReportModal}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenProfile={handleOpenProfile}
        unreadCount={unreadCount}
        user={user}
        onLogout={handleLogout}
      />

      <main className="flex-grow flex flex-col">
        <AnimatePresence mode="wait">
          <PageTransition key={currentTab} className="flex-grow flex flex-col">
            {renderContent()}
          </PageTransition>
        </AnimatePresence>
      </main>

      <Footer
        onOpenAboutSDG={() => setIsAboutSDGOpen(true)}
        onOpenPrivacy={() => setGeneralInfoType('privacy')}
        onOpenContact={() => setGeneralInfoType('contact')}
        onOpenOpenData={() => setGeneralInfoType('opendata')}
      />

      {/* ===================== GLOBAL MODALS ===================== */}
      <ReportDetailModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
        onToggleUpvote={handleToggleUpvote}
        onUpdateStatus={handleUpdateStatus}
        onAddComment={handleAddComment}
        onDeleteReport={handleDeleteReport}
        currentUser={user}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={() => setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))}
        onSelectNotification={handleSelectNotification}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        reports={reports}
        onSelectReport={(report) => {
          setIsProfileOpen(false);
          setSelectedReport(report);
        }}
        user={user}
      />

      <VolunteerModal
        report={volunteerModalReport}
        onClose={() => setVolunteerModalReport(null)}
        onConfirmVolunteer={(reportId, data) => {
          handleConfirmVolunteer(reportId, data);
        }}
      />

      <AboutSDGModal isOpen={isAboutSDGOpen} onClose={() => setIsAboutSDGOpen(false)} />
      <GeneralInfoModal type={generalInfoType} onClose={() => setGeneralInfoType(null)} />

      <Toaster position="top-center" richColors closeButton />
    </div>
  );
};

export default App;
