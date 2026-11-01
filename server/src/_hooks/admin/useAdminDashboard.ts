"use client";

import { useQuery } from "@tanstack/react-query";

export interface AdminStats {
  totalUsers: number;
  totalStudents: number;
  totalStaff: number;
  totalAdmins: number;
  totalSuperStaff: number;
  totalCenters: number;
  activeUsers: number;
  inactiveUsers: number;
  activeStudents: number;
  inactiveStudents: number;
  activeStaff: number;
  inactiveStaff: number;
}

const EMPTY_STATS: AdminStats = {
  totalUsers: 0,
  totalStudents: 0,
  totalStaff: 0,
  totalAdmins: 0,
  totalSuperStaff: 0,
  totalCenters: 0,
  activeUsers: 0,
  inactiveUsers: 0,
  activeStudents: 0,
  inactiveStudents: 0,
  activeStaff: 0,
  inactiveStaff: 0,
};

async function fetchStats(): Promise<AdminStats> {
  const response = await fetch("/api/admin/stats");

  if (!response.ok) {
    throw new Error(
      response.status === 401 || response.status === 403
        ? "You do not have access to dashboard statistics."
        : "Failed to load dashboard statistics.",
    );
  }

  return response.json();
}

export function useAdminStats() {
  const query = useQuery({
    queryKey: ["admin-stats"],
    queryFn: fetchStats,
  });

  return {
    // Zeroed values keep the cards renderable while the request is in flight.
    stats: query.data ?? EMPTY_STATS,
    isLoading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
  };
}
