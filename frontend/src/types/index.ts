export interface EventItem {
  id: number;
  title: string;
  slug: string;
  category: string;
  description: string;
  event_date: string;
  event_time: string;
  venue: string;
  registration_deadline?: string;
  max_participants: number;
  current_participants: number;
  agenda?: string;
  speakers?: string;
  coordinators?: string;
  eligibility?: string;
  rules?: string;
  faqs?: string;
  poster_url?: string;
  is_published: boolean;
  registration_open: boolean;
  created_at: string;
}

export interface MemberItem {
  id: number;
  name: string;
  role: string;
  category: 'FACULTY' | 'LEADERSHIP' | 'STUDENT' | string;
  department: string;
  academic_year?: string;
  bio?: string;
  photo_url?: string;
  email?: string;
  linkedin_url?: string;
  github_url?: string;
  sort_order: number;
  is_active: boolean;
}

export interface GalleryImageItem {
  id: number;
  title: string;
  description?: string;
  category: string;
  event_id?: number;
  image_url: string;
  thumbnail_url?: string;
  upload_date?: string;
}

export interface CertificateItem {
  id: number;
  certificate_code: string;
  student_name: string;
  usn?: string;
  event_id?: number;
  event_name: string;
  issue_date: string;
  status: string;
  pdf_url?: string;
  verification_count: number;
  created_at: string;
}

export interface CertificateVerifyResult {
  is_valid: boolean;
  certificate?: CertificateItem;
  message: string;
}

export interface ActivityItem {
  id: number;
  title: string;
  category: string;
  description: string;
  date: string;
  highlights?: string;
  image_url?: string;
}

export interface AchievementItem {
  id: number;
  title: string;
  category: string;
  recipient_name?: string;
  date: string;
  description: string;
  proof_url?: string;
}

export interface AnnouncementItem {
  id: number;
  title: string;
  content: string;
  badge: string;
  link_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface RegistrationItem {
  id: number;
  registration_code: string;
  event_id: number;
  event_title?: string;
  full_name: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  usn?: string;
  year: string;
  semester?: string;
  is_team: boolean;
  team_name?: string;
  team_members?: string;
  status: string;
  created_at: string;
}

export interface MembershipApplicationItem {
  id: number;
  application_code: string;
  full_name: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  year: string;
  tech_interests: string;
  reason_for_joining: string;
  status: string;
  created_at: string;
}

export interface ContactMessageItem {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  reply_status: string;
  created_at: string;
}

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: string;
}

export interface DashboardStats {
  total_events: number;
  upcoming_events: number;
  completed_events: number;
  total_registrations: number;
  total_members: number;
  gallery_images: number;
  certificates: number;
  membership_applications: number;
  pending_applications: number;
  unread_messages: number;
  recent_registrations: Array<{
    id: number;
    name: string;
    code: string;
    email: string;
    department: string;
    date: string;
  }>;
  recent_messages: Array<{
    id: number;
    name: string;
    subject: string;
    is_read: boolean;
    date: string;
  }>;
}

export interface PublicStats {
  community_members: number;
  events_conducted: number;
  activities_count: number;
  certificates_verified: number;
  technology_domains: number;
}
