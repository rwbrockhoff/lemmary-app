import { useMutation } from '@tanstack/react-query';
import { api } from '@/api/client';
import type { ForgotPasswordFormData } from '@/features/auth/schemas/auth-schemas';

export const useForgotPasswordFlow = () => {
	return useMutation({
		mutationFn: (data: ForgotPasswordFormData) => api.post('/auth/forgot-password', data),
	});
};
