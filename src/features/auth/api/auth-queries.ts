import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/api/client';
import type { AuthIdentity } from '../types/auth-types';
import type {
	ChangePasswordFormData,
	ChangeEmailFormData,
} from '../schemas/auth-schemas';

export const identityKey = ['auth', 'identity'] as const;

export const useIdentity = () => {
	return useQuery({
		queryKey: identityKey,
		queryFn: () => api.get<AuthIdentity>('/auth/identity'),
		staleTime: 5 * 60 * 1000,
		retry: false,
	});
};

export const useChangePassword = () => {
	return useMutation({
		mutationFn: (data: ChangePasswordFormData) => api.put('/auth/password', data),
	});
};

export const useChangeEmail = () => {
	return useMutation({
		mutationFn: (data: ChangeEmailFormData) => api.put('/auth/email', data),
	});
};
