import {z} from "zod";

export const registrationSchema = z.object ({
    email:z.string().email(),
    password:z.string().min(8),
    firstName:z.string().min(1).trim(),
    lastName:z.string().min(1).trim,
    role:z.enum([
        "STUDENT",
        "ADMIN",
        "STAFF",
        "SUPER_STAFF",
    ]),
});

export type RegisterInput = z.infer<typeof registrationSchema>;