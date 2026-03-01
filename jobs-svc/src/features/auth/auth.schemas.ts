import { z } from 'zod';

export const statusEnum = z.enum(['ACTIVE', 'BLOCK']);

export const signupSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
  tenantName: z.string().min(2, { message: "Tenant name must be at least 2 characters long" }).max(255),
  role: z.enum(['USER']).optional(),
  email: z.string().email(),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
  status: statusEnum.optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const verifyEmailSchema = z.object({
  token: z.string(),
});
 

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(6),
});


export const updatePasswordSchema = z.object({
  token: z.string().min(10),
  newPassword: z.string().min(6),
});

export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;


export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>; 

export const  AuthValidation = {
  signupSchema
}