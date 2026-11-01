import {z} from "zod";

export const registrationSchema = z.object({
  userId: z.string().trim().min(1, "User ID is required"),
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1).trim(),
  lastName: z.string().min(1).trim(),

  role: z.enum(["STUDENT", "ADMIN", "STAFF", "SUPER_STAFF"]),

  centerId: z.string().trim().min(1, "Center is required"),
  regNumber: z
    .string()
    .regex(/^\d{9}$/, "Registration number must be exactly 9 digits")
    .optional(),

  stNumber: z.string().trim().min(9).toUpperCase().optional(),

  intake: z
    .string()
    .regex(
      /^(?:\d{2}[/-]\d{2}|\d{4}-\d{4})$/,
      "Intake must be in the format 21/22, 21-22, or 2021-2022",
    )
    .optional(),
});

export type RegisterInput = z.infer<typeof registrationSchema>;