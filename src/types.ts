export type ReportStatus = 'baru' | 'diproses' | 'selesai';

export type ReportCategory = 
  | 'kebersihan'
  | 'infrastruktur'
  | 'fasilitas'
  | 'ruang_hijau'
  | 'drainase'
  | 'penerangan'
  | 'lainnya';

export interface ReportUpdate {
  id: string;
  date: string;
  author: string;
  role: string;
  message: string;
  statusChange?: ReportStatus;
  photoUrl?: string;
}

export interface ReportComment {
  id: string;
  userName: string;
  userAvatar?: string;
  timestamp: string;
  content: string;
  isOfficial?: boolean;
}

export interface Report {
  id: string;
  title: string;
  category: ReportCategory;
  categoryLabel: string;
  categoryIcon: string;
  description: string;
  location: string;
  city: string;
  lat: number;
  lng: number;
  mapTopPct: number; // percentage from top on custom map (0-100)
  mapLeftPct: number; // percentage from left on custom map (0-100)
  timeAgo: string;
  timestamp: number;
  status: ReportStatus;
  upvotes: number;
  hasUpvoted?: boolean;
  upvotedBy?: string[];
  userId?: string;
  imageUrl: string;
  imageAlt?: string;
  beforeAfterImageUrl?: string;
  reporterName: string;
  departmentAssigned?: string;
  priority: 'Tinggi' | 'Sedang' | 'Rendah';
  volunteerCount?: number;
  userJoinedVolunteer?: boolean;
  volunteerActionDate?: string;
  updates: ReportUpdate[];
  comments: ReportComment[];
}

export interface GreenEduArticle {
  id: string;
  title: string;
  category: string;
  badge: string;
  author: string;
  readTime: string;
  imageUrl: string;
  summary: string;
  keyPillars: string[];
  fullContent: string;
  publishedDate: string;
  iotTechDetails: { tech: string; desc: string }[];
}

export interface FilterOptions {
  status: 'all' | ReportStatus;
  category: 'all' | ReportCategory;
  sortBy: 'terbaru' | 'upvote';
  searchQuery: string;
  city: 'all' | string;
}

export interface CivicNotification {
  id: string;
  title: string;
  message: string;
  timeAgo: string;
  isRead: boolean;
  reportId: string;
  type: 'status' | 'official_reply' | 'upvote' | 'system';
}

export interface CityStat {
  city: string;
  totalReports: number;
  resolved: number;
  inProgress: number;
  newReports: number;
  avgResponseHours: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  password?: string;
  domicile?: string;
}

// =======================
// ECO-CONNECT & GREEN IOT/AI TYPES
// =======================

export interface SmartEnergyMetric {
  solarKwhToday: number;
  solarKwhTrend: number;
  gridLoadReducedPct: number;
  co2AvoidedKg: number;
  activeSolarNodes: number;
  batteryHealthPct: number;
  hourlyGeneration: { time: string; solarKwh: number; gridDrawKwh: number }[];
}

export interface IoTWasteBin {
  id: string;
  name: string;
  location: string;
  city: string;
  fillLevelPct: number;
  status: 'optimal' | 'siap_angkut' | 'kritis';
  batteryPct: number;
  wasteType: 'Organik' | 'Anorganik / Plastik' | 'Limbah B3' | 'Kertas';
  lastPing: string;
  smartCompactorActive: boolean;
}

export interface AQISensor {
  id: string;
  stationName: string;
  city: string;
  aqiScore: number;
  status: 'Sangat Baik' | 'Sedang' | 'Tidak Sehat' | 'Kritis';
  pm25: number;
  pm10: number;
  co2Ppm: number;
  temperatureC: number;
  humidityPct: number;
  aiTrendForecast: string;
  aiRecommendations: string[];
}

export interface GreenTechGuide {
  id: string;
  title: string;
  category: 'IoT & Smart Sensors' | 'Solar & Clean Energy' | 'AI Climate Resilience' | 'Circular Waste';
  readTime: string;
  icon: string;
  summary: string;
  keyTakeaways: string[];
  techStackHighlights: string[];
  fullGuide: string;
}

// =======================
// FORUM & COMMUNITY TYPES
// =======================

export type ForumCategory = 
  | 'Semua'
  | 'Energi Terbarukan'
  | 'Zero Waste & IoT'
  | 'Urban Farming & Hijau'
  | 'Mobilitas Bersih'
  | 'Advokasi & Kebijakan';

export interface ForumReply {
  id: string;
  author: string;
  role: string;
  isChampion?: boolean;
  avatarInitials: string;
  timestamp: string;
  content: string;
  upvotes: number;
  hasUpvoted?: boolean;
}

export interface ForumTopic {
  id: string;
  title: string;
  category: ForumCategory;
  author: string;
  authorRole: string;
  isChampion?: boolean;
  avatarInitials: string;
  content: string;
  tags: string[];
  createdAt: string;
  upvotes: number;
  hasUpvoted?: boolean;
  repliesCount: number;
  replies: ForumReply[];
  isPinned?: boolean;
  sdgGoal: string;
}

// =======================
// PORTFOLIO INNOVATION TYPES
// =======================

export interface PortfolioCaseStudy {
  id: string;
  title: string;
  badge: string;
  category: 'IoT & Sensor Grid' | 'Smart Solar & Energy' | 'AI Early Warning' | 'Eco-Restoration';
  location: string;
  city: string;
  partner: string;
  year: string;
  status: 'Aktif Beroperasi' | 'Pilot Terverifikasi' | 'Ekspansi Skala Kota';
  coverImage: string;
  summary: string;
  problemStatement: string;
  solutionArchitecture: string[];
  hardwareSpecs: { component: string; detail: string }[];
  impactMetrics: { label: string; value: string; desc: string }[];
  blueprintAvailable: boolean;
  leadPartner: string;
}
