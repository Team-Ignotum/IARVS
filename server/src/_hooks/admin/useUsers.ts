"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type {
  DbRole,
  DbStatus,
  UserListResponse,
} from "@/components/admin/users/types";

export interface UseUsersParams {
  role?: DbRole;
  status?: DbStatus;
  center?: string;
  search?: string;
  page: number;
  pageSize: number;
  enabled?: boolean;
}

function buildSearchParams({
  role,
  status,
  center,
  search,
  page,
  pageSize,
}: UseUsersParams) {
  const params = new URLSearchParams();

  if (role) params.set("role", role);
  if (status) params.set("status", status);
  if (center) params.set("center", center);
  if (search) params.set("search", search);
  params.set("page", String(page));
  params.set("pageSize", String(pageSize));

  return params;
}

async function fetchUsers(params: UseUsersParams): Promise<UserListResponse> {
  const response = await fetch(`/api/admin/users?${buildSearchParams(params)}`);

  if (!response.ok) {
    throw new Error(
      response.status === 401 || response.status === 403
        ? "You do not have access to the user list."
        : "Failed to load users.",
    );
  }

  return response.json();
}

export function useUsers(params: UseUsersParams) {
  const query = useQuery({
    queryKey: ["admin-users", params],
    queryFn: () => fetchUsers(params),
    // Keeps the current page visible while the next one loads.
    placeholderData: keepPreviousData,
    enabled: params.enabled ?? true,
  });

  return {
    users: query.data?.users ?? [],
    total: query.data?.total ?? 0,
    totalPages: query.data?.totalPages ?? 1,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error instanceof Error ? query.error.message : null,
  };
}
