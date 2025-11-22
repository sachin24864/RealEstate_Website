import { z } from "zod";


export const UserCreationSchema = z.object({
  role: z
    .union([
      z.number().int(),
      z.string().regex(/^\d+$/, "Role must be a valid integer"),
    ])
    .transform((val) => Number(val))
    .refine((n) => n > 0, { message: "Role must be a positive integer" }),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .optional(), 

  name: z
    .string({ required_error: "Name is required" })
    .min(1, "Name cannot be empty")
    .trim(),

  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format"),

  status: z
    .union([
      z.number().int(),
      z.string().regex(/^\d+$/, "Status must be a number"),
    ])
    .transform((val) => Number(val))
    .default(1),

  subject: z
    .string()
    .optional(),

  Message: z
    .string()
    .optional(),

  createdBy: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "createdBy must be a valid ObjectId")
    .optional(),
});
