import React from "react";
import type { FileObject } from "@supabase/storage-js";
import type { Enums, Tables } from "@/supabase.types";

// Re-export Supabase types with more convenient names
export type User = Tables<"users">;
export type _RawTableEvent = Tables<"events">;
export type EventSignup = Tables<"event_signups">;
export type VolunteerHours = Tables<"volunteer_hours">;
export type WebsiteDetails = Tables<"website_details">;

// Re-export enums
export type UserRole = Enums<"user_role">;
export type ApprovalStatus = Enums<"approval_status">;

// Export image
export type Event = _RawTableEvent & {
  image: FileObject | null;
  image_url: string | null;
  waiver_url: string | null;
};

// Type for the featured event data we actually fetch and use
export interface FeaturedEvent {
  id: string;
  title: string;
  description: string;
  date: string;
}

// Extended types for application use
export interface VolunteerHoursWithEvent extends VolunteerHours {
  event?: Event;
}

// Leadership data structure
export interface Leader {
  name: string;
  role: string;
  image_url: string;
}

export interface HoursUser {
  id: string;
  full_name: string;
  email: string;
}

export interface VolunteerHoursModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
  users: HoursUser[];
  onSave: (hoursData: { [userId: string]: number }) => Promise<void>;
  isLoading?: boolean;
}

export interface SignedUpUser {
  id: string;
  status: string | null;
  user_id: string | null;
  event_id: string | null;
  created_at: string | null;
  user: User | null;
}

export interface UserCardAction {
  label: string;
  onClick: () => void;
  className: string;
  ariaLabel: string;
  title: string;
}

export interface UserCardProps {
  user: UserWithStudentInfo;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  actions?: UserCardAction[];
  showStatus?: boolean;
  showLeadId?: boolean;
  className?: string;
}

// Legacy alias for WebsiteDetails (for backward compatibility)
export type WebsiteStats = WebsiteDetails;

// For handling parents
export type UserWithStudentInfo = User & {
  student_name?: string;
  student_email?: string;
  student_phone?: string;
};

// Component prop types
export interface AllUsersTabProps {
  allUsers: UserWithStudentInfo[];
  userRoleFilter: string;
  setUserRoleFilter: (filter: string) => void;
  userStatusFilter: string;
  setUserStatusFilter: (filter: string) => void;
  roles: string[];
  statusOptions: string[];
  filterUsers: (
    users: UserWithStudentInfo[],
    roleFilter: string,
    statusFilter: string,
  ) => UserWithStudentInfo[];
  expandedUserId: string | null;
  toggleExpand: (id: string) => void;
  copyToClipboard: (text: string) => void;
  generateBulkList: (type: "email" | "phone") => string;
}

export interface PendingUsersTabProps {
  pendingUsers: UserWithStudentInfo[];
  pendingRoleFilter: string;
  setPendingRoleFilter: (filter: string) => void;
  pendingStatusFilter: string;
  setPendingStatusFilter: (filter: string) => void;
  roles: string[];
  statusOptions: string[];
  filterUsers: (
    users: UserWithStudentInfo[],
    roleFilter: string,
    statusFilter: string,
  ) => UserWithStudentInfo[];
  expandedUserId: string | null;
  toggleExpand: (id: string) => void;
  updateUserStatus: (
    id: string,
    status: "APPROVED" | "REJECTED",
  ) => Promise<void>;
}

export interface CreateEventTabProps {
  eventForm: Event;
  handleEventChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  saveEvent: (
    e: React.FormEvent,
    waiverFile?: File,
    imageFile?: File,
  ) => Promise<void>;
  setEventForm: (form: Event) => void;
}

export interface ManageEventsTabProps {
  events: Event[];
  startEditEvent: (event: Event) => void;
  deleteEvent: (id: string) => Promise<void>;
}

export interface WebsiteDetailsTabProps {
  stats: WebsiteStats;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: (e: React.FormEvent) => Promise<void>;
  events: Event[];
  featuredEventId: string;
  setFeaturedEventId: (id: string) => void;
  handleFeaturedEventSave: () => Promise<void>;
}

export interface EventModalProps {
  selectedEvent: Event;
  setShowEventModal: React.Dispatch<React.SetStateAction<boolean>>;
  formatDate: (dateStr: string) => string;
}

export interface UserFormData {
  role: UserRole;
  full_name: string;
  phone: string;
  lead_id: string;
  email: string;
  password: string;

  // Student-specific fields
  parent_1_name?: string;
  parent_1_email?: string;
  parent_1_phone?: string;
  parent_2_name?: string;
  parent_2_email?: string;
  parent_2_phone?: string;

  // Parent-specific fields
  student_name?: string;
  student_email?: string;
  student_phone?: string;
}

// Utility types
export type UserStatus = ApprovalStatus;
export type GraphPeriod = "week" | "month" | "year";

// Chart data types
export interface ChartDataPoint {
  name: string;
  hours: number;
  date?: string;
}

// API response types
export interface SupabaseResponse<T> {
  data: T | null;
  error: Error | null;
}
