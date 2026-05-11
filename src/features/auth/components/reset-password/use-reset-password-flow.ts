import { useMutation } from '@tanstack/react-query';
import { api } from '@/api/client';

type ResetPasswordParams = {
	accessToken: string;
	newPassword: string;
};

export const useResetPasswordFlow = () => {
	return useMutation({
		mutationFn: (params: ResetPasswordParams) => api.post('/auth/reset-password', params),
	});
};
