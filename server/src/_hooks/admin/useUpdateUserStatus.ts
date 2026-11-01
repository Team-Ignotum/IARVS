"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AdminUser, DbStatus } from "@/components/admin/users/types";

interface UpdateUserStatusInput {
  userId: string;
  status: DbStatus;
}

async function updateUserStatus({
  userId,
  status,
}: UpdateUserStatusInput): Promise<AdminUser> {
  const response = await fetch(
    `/api/admin/users/${encodeURIComponent(userId)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    },
  );

  const data = (await response.json().catch(() => null)) as
    | { user?: AdminUser; error?: string }
    | null;

  if (!response.ok) {
    throw new Error(data?.error ?? "Unable to update user status");
  }

  if (!data?.user) {
    throw new Error("Unable to update user status");
  }

  return data.user;
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserStatus,
    onSuccess: () => {
      // Status feeds both the table and the dashboard counters.
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });
}
