import { useMutation } from '@tanstack/react-query';
import { api } from '@/api/client';
import type { RegisterFormData } from '@/features/auth/schemas/auth-schemas';
import type { RegisterResponse } from '@/features/auth/types/auth-types';

export const useRegisterFlow = () => {
	return useMutation({
		mutationFn: (data: RegisterFormData) =>
			api.post<RegisterResponse>('/auth/register', data),
	});
};
