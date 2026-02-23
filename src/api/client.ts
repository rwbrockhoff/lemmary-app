const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

type RequestOptions = RequestInit & {
	params?: Record<string, string>;
};

export const api = async <T>(
	endpoint: string,
	options?: RequestOptions,
): Promise<T> => {
	const { params, ...init } = options ?? {};

	let url = `${BASE_URL}${endpoint}`;
	if (params) {
		const searchParams = new URLSearchParams(params);
		url += `?${searchParams.toString()}`;
	}

	const headers: Record<string, string> = { ...init?.headers as Record<string, string> };
	if (init?.body) {
		headers['Content-Type'] = 'application/json';
	}

	const response = await fetch(url, {
		credentials: 'include',
		headers,
		...init,
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(
			(error as { message?: string }).message ?? response.statusText,
		);
	}

	return response.json() as Promise<T>;
};
