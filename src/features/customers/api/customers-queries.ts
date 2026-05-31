import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import { customerKeys } from './customers-keys';
import type { CustomerDetail } from '@/types/api';

export const useCustomer = (email: string) => {
	return useQuery({
		queryKey: customerKeys.detail(email),
		queryFn: () => api.get<CustomerDetail>(`/customers/${encodeURIComponent(email)}`),
		enabled: Boolean(email),
	});
};
