import { z } from "zod";

export const AuthSignInSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export type AuthSignInSchemaType = z.infer<typeof AuthSignInSchema>;

export const AuthSignUpSchema = z
  .object({
    name: z.string().min(3, "write at least 3 characters"),
    email: z.string().email(),
    password: z.string().min(6, "write at least 6 characters"),
    confirmPassword: z.optional(z.string()),
  })
  .refine(
    (data) => {
      if (data.confirmPassword === undefined) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

export type AuthSignUpSchemaType = z.infer<typeof AuthSignUpSchema>;

export type RegisterType = "signIn" | "signUp";
