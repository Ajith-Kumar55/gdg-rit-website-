import axios from 'axios';
import type {
  EventItem,
  MemberItem,
  GalleryImageItem,
  CertificateVerifyResult,
  CertificateItem,
  ActivityItem,
  AchievementItem,
  AnnouncementItem,
  RegistrationItem,
  MembershipApplicationItem,
  ContactMessageItem,
  AdminUser,
  DashboardStats,
  PublicStats,
} from '../types';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
export const BACKEND_SERVER_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to all requests if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gdg_admin_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper to format image URLs
export function getAssetUrl(path?: string | null): string {
  if (!path) return '/assets/gdg-logo.jpeg';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  if (path.startsWith('/uploads')) {
    return `${BACKEND_SERVER_URL}${path}`;
  }
  return path;
}

// Public & Admin API Methods
export const apiService = {
  // Auth
  login: async (credentials: { username: string; password: string }) => {
    const res = await api.post<{ access_token: string; admin: AdminUser }>('/auth/login', credentials);
    return res.data;
  },
  logout: async () => {
    const res = await api.post('/auth/logout');
    return res.data;
  },
  getMe: async () => {
    const res = await api.get<AdminUser>('/auth/me');
    return res.data;
  },
  changePassword: async (passwords: { current_password: string; new_password: string }) => {
    const res = await api.post('/auth/change-password', passwords);
    return res.data;
  },

  // Events
  getEvents: async (category?: string, allEvents: boolean = false) => {
    const res = await api.get<EventItem[]>('/events/', { params: { category, all_events: allEvents } });
    return res.data;
  },
  getEvent: async (idOrSlug: string) => {
    const res = await api.get<EventItem>(`/events/${idOrSlug}`);
    return res.data;
  },
  createEvent: async (eventData: Partial<EventItem>) => {
    const res = await api.post<EventItem>('/events/', eventData);
    return res.data;
  },
  updateEvent: async (id: number, eventData: Partial<EventItem>) => {
    const res = await api.put<EventItem>(`/events/${id}`, eventData);
    return res.data;
  },
  deleteEvent: async (id: number) => {
    const res = await api.delete(`/events/${id}`);
    return res.data;
  },
  uploadPoster: async (formData: FormData) => {
    const res = await api.post<{ url: string }>('/events/upload-poster', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  // Registrations
  registerForEvent: async (regData: any) => {
    const res = await api.post<RegistrationItem>('/registrations/', regData);
    return res.data;
  },
  getRegistrations: async (eventId?: number, department?: string, search?: string) => {
    const res = await api.get<RegistrationItem[]>('/registrations/', {
      params: { event_id: eventId, department, search },
    });
    return res.data;
  },
  updateRegistrationStatus: async (id: number, status: string) => {
    const res = await api.put(`/registrations/${id}/status`, { status });
    return res.data;
  },
  deleteRegistration: async (id: number) => {
    const res = await api.delete(`/registrations/${id}`);
    return res.data;
  },
  exportRegistrationsCsvUrl: (eventId?: number) => {
    return `${API_BASE_URL}/registrations/export-csv${eventId ? `?event_id=${eventId}` : ''}`;
  },
  downloadRegistrationsCsv: async (eventId?: number) => {
    const res = await api.get('/registrations/export-csv', {
      params: eventId ? { event_id: eventId } : undefined,
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([res.data], { type: 'text/csv' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `gdg_rit_registrations${eventId ? `_evt${eventId}` : ''}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  // Team Members
  getMembers: async (category?: string) => {
    const res = await api.get<MemberItem[]>('/members/', { params: { category } });
    return res.data;
  },
  getAdminMembers: async () => {
    const res = await api.get<MemberItem[]>('/members/admin-all');
    return res.data;
  },
  createMember: async (data: Partial<MemberItem>) => {
    const res = await api.post<MemberItem>('/members/', data);
    return res.data;
  },
  updateMember: async (id: number, data: Partial<MemberItem>) => {
    const res = await api.put<MemberItem>(`/members/${id}`, data);
    return res.data;
  },
  deleteMember: async (id: number) => {
    const res = await api.delete(`/members/${id}`);
    return res.data;
  },
  uploadMemberPhoto: async (formData: FormData) => {
    const res = await api.post<{ url: string }>('/members/upload-photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  // Gallery
  getGallery: async (category?: string, search?: string) => {
    const res = await api.get<GalleryImageItem[]>('/gallery/', { params: { category, search } });
    return res.data;
  },
  uploadGalleryImage: async (formData: FormData) => {
    const res = await api.post<GalleryImageItem>('/gallery/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  createGalleryItem: async (data: Partial<GalleryImageItem>) => {
    const res = await api.post<GalleryImageItem>('/gallery/', data);
    return res.data;
  },
  updateGalleryItem: async (id: number, data: Partial<GalleryImageItem>) => {
    const res = await api.put<GalleryImageItem>(`/gallery/${id}`, data);
    return res.data;
  },
  deleteGalleryItem: async (id: number) => {
    const res = await api.delete(`/gallery/${id}`);
    return res.data;
  },

  // Certificates
  verifyCertificate: async (query: string) => {
    const res = await api.get<CertificateVerifyResult>('/certificates/verify', { params: { q: query } });
    return res.data;
  },
  getCertificates: async (search?: string) => {
    const res = await api.get<CertificateItem[]>('/certificates/', { params: { search } });
    return res.data;
  },
  createCertificate: async (data: Partial<CertificateItem>) => {
    const res = await api.post<CertificateItem>('/certificates/', data);
    return res.data;
  },
  updateCertificate: async (id: number, data: Partial<CertificateItem>) => {
    const res = await api.put<CertificateItem>(`/certificates/${id}`, data);
    return res.data;
  },
  deleteCertificate: async (id: number) => {
    const res = await api.delete(`/certificates/${id}`);
    return res.data;
  },

  // Activities & Achievements
  getActivities: async (category?: string) => {
    const res = await api.get<ActivityItem[]>('/activities/', { params: { category } });
    return res.data;
  },
  createActivity: async (data: Partial<ActivityItem>) => {
    const res = await api.post<ActivityItem>('/activities/', data);
    return res.data;
  },
  deleteActivity: async (id: number) => {
    const res = await api.delete(`/activities/${id}`);
    return res.data;
  },
  getAchievements: async () => {
    const res = await api.get<AchievementItem[]>('/activities/achievements');
    return res.data;
  },
  createAchievement: async (data: Partial<AchievementItem>) => {
    const res = await api.post<AchievementItem>('/activities/achievements', data);
    return res.data;
  },
  deleteAchievement: async (id: number) => {
    const res = await api.delete(`/activities/achievements/${id}`);
    return res.data;
  },

  // Membership Applications
  applyMembership: async (data: any) => {
    const res = await api.post<MembershipApplicationItem>('/membership/', data);
    return res.data;
  },
  getMembershipApplications: async (status?: string) => {
    const res = await api.get<MembershipApplicationItem[]>('/membership/', { params: { status } });
    return res.data;
  },
  updateMembershipStatus: async (id: number, status: string) => {
    const res = await api.put(`/membership/${id}/status`, { status });
    return res.data;
  },
  deleteMembershipApplication: async (id: number) => {
    const res = await api.delete(`/membership/${id}`);
    return res.data;
  },

  // Contact
  sendContactMessage: async (data: any) => {
    const res = await api.post<ContactMessageItem>('/contact/', data);
    return res.data;
  },
  getContactMessages: async () => {
    const res = await api.get<ContactMessageItem[]>('/contact/');
    return res.data;
  },
  markMessageRead: async (id: number) => {
    const res = await api.put(`/contact/${id}/read`);
    return res.data;
  },
  deleteContactMessage: async (id: number) => {
    const res = await api.delete(`/contact/${id}`);
    return res.data;
  },

  // Stats
  getDashboardStats: async () => {
    const res = await api.get<DashboardStats>('/stats/dashboard');
    return res.data;
  },
  getPublicStats: async () => {
    const res = await api.get<PublicStats>('/stats/public');
    return res.data;
  },

  // Announcements & Settings
  getAnnouncements: async () => {
    const res = await api.get<AnnouncementItem[]>('/settings/announcements');
    return res.data;
  },
  getAdminAnnouncements: async () => {
    const res = await api.get<AnnouncementItem[]>('/settings/announcements/admin');
    return res.data;
  },
  createAnnouncement: async (data: Partial<AnnouncementItem>) => {
    const res = await api.post<AnnouncementItem>('/settings/announcements', data);
    return res.data;
  },
  toggleAnnouncement: async (id: number) => {
    const res = await api.put<AnnouncementItem>(`/settings/announcements/${id}`);
    return res.data;
  },
  deleteAnnouncement: async (id: number) => {
    const res = await api.delete(`/settings/announcements/${id}`);
    return res.data;
  },
  getContentSettings: async () => {
    const res = await api.get<Record<string, string>>('/settings/content');
    return res.data;
  },
  setContentSetting: async (key: string, value: string, description?: string) => {
    const res = await api.post(`/settings/content/${key}`, { value, description });
    return res.data;
  },
};

export default api;
