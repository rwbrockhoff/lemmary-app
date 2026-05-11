import { z } from 'zod';

export const loginSchema = z.object({
	email: z.string().trim().toLowerCase().pipe(z.email()),
	password: z.string().min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
	firstName: z.string().trim().min(1, 'First name is required').max(100),
	lastName: z.string().trim().min(1, 'Last name is required').max(100),
	email: z.string().trim().toLowerCase().pipe(z.email()),
	password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
	email: z.string().trim().toLowerCase().pipe(z.email()),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
	newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
