import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { api } from '@/api/client';

export type SearchResults = {
	orders: {
		id: string;
		order_number: string;
		customer_name: string | null;
		order_type: string;
	}[];
	products: {
		id: string;
		name: string;
		image_url: string | null;
	}[];
	customers: {
		email: string;
		name: string;
	}[];
};

export const useSearch = (query: string) => {
	return useQuery({
		queryKey: ['search', query],
		queryFn: () => api.get<SearchResults>('/search', { q: query }),
		enabled: query.trim().length > 0,
		placeholderData: keepPreviousData,
	});
};
