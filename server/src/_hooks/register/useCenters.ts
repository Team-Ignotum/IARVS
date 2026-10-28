"use client";

import { useQuery } from "@tanstack/react-query";

export interface CenterOption {
  centerId: string;
  centerName: string;
}

async function fetchCenters(): Promise<CenterOption[]> {
  const response = await fetch("/api/centers");

  if (!response.ok) {
    throw new Error("Failed to load centers");
  }

  const data = (await response.json()) as { centers: CenterOption[] };

  return data.centers;
}

export function useCenters() {
  return useQuery({
    queryKey: ["centers"],
    queryFn: fetchCenters,
    // Centers are reference data that rarely change, so avoid refetching them often.
    staleTime: 60 * 60 * 1000,
  });
}
