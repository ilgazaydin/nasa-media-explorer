/**
 * @file authValidation.ts
 * @description Zod schemas and types for login and registration forms.
 */

import { z } from "zod";

// Schema for registration form
export const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  email: z
    .string()
    .nonempty("Email is required.")
    .email("Invalid email address."),
  password: z
    .string()
    .min(1, "Password is required.")
    .refine(
      (val) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(val),
      {
        message:
          "Password must be at least 8 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
      }
    ),
});

// Schema for login form
export const loginSchema = z.object({
  email: z
    .string()
    .nonempty("Email is required.")
    .email("Invalid email address."),
  password: z.string().min(1, "Password is required."),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
