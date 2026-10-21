"use client";

import { useQuery } from "@tanstack/react-query";
import  getSessionOnClient  from "@/server_actions/getSession";

export interface SessionData {
  id: string;
  role: string;
  fname: string;
  lname: string;
  email: string;
}

/**
 * Shared session hook using TanStack Query caching.
 */
export const useSession = () => {
  return useQuery<SessionData | null>({
    queryKey: ["session"],
    queryFn: async () => {
      const data = await getSessionOnClient();
      return data as SessionData | null;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
    retry: 1,
  });
};
