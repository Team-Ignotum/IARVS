import { z } from "zod";

export const userListQuerySchema = z.object({
  role: z.enum(["STUDENT", "STAFF", "ADMIN", "SUPER_STAFF"]).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  center: z.string().trim().min(1).optional(),
  intake: z.string().trim().min(1).optional(),
  search: z.string().trim().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
});

export const updateUserStatusSchema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export type UserListQuery = z.infer<typeof userListQuerySchema>;
