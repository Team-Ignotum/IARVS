import {z} from "zod";

export const registrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1).trim(),
  lastName: z.string().min(1).trim(),

  role: z.enum(["STUDENT", "ADMIN", "STAFF", "SUPER_STAFF"]),

  center: z.string(),
  regNumber: z
    .string()
    .regex(/^\d{8}$/, "Registration number must be exactly 9 digits"),

  stNumber: z.string().min(9).trim(),
  
  intake: z
    .string()
    .regex(
      /^(?:\d{2}[/-]\d{2}|\d{4}-\d{4})$/,
      "Intake must be in the format 21/22, 21-22, or 2021-2022",
    ),
});

export type RegisterInput = z.infer<typeof registrationSchema>;