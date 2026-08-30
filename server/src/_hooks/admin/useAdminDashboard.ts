"use client";

export interface AdminStats {
  totalStaff: number;
  centers: number;
  activeStaff: number;
  inactiveStaff: number;
}

export interface AdminStudentStats {
  totalStudents: number;
  approvedStudents: number;
  pendingStudents: number;
}

export interface UseAdminDashboardResult {
  stats: AdminStats;
  recentProjects: [];
  isLoading: boolean;
  error: string | null;
}

export interface UseStudentDashboardResult {
  stats: AdminStudentStats;
  recentProjects: [];
  isLoading: boolean;
  error: string | null;
}

// Temporary mock data used for the staff dashboard until the real admin data source is connected.
const mockStats: AdminStats = {
  totalStaff: 1248,
  centers: 842,
  activeStaff: 34,
  inactiveStaff: 18,
};

const mockStudentStats: AdminStudentStats = {
  totalStudents: 2000,
  approvedStudents: 843,
  pendingStudents: 1157,
};

export function useAdminDashboard(): UseAdminDashboardResult {
  return {
    stats: mockStats,
    recentProjects: [],
    isLoading: false,
    error: null,
  };
}

export function useStudentDashboard(): UseStudentDashboardResult {
  return {
    stats: mockStudentStats,
    recentProjects: [],
    isLoading: false,
    error: null,
  };
}