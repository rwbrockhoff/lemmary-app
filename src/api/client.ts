const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

const AUTH_TOKEN_KEY = 'auth_token';

export function getAuthToken(): string | null {
	return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string) {
	localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken() {
	localStorage.removeItem(AUTH_TOKEN_KEY);
}

type RequestOptions = RequestInit & {
	params?: Record<string, string>;
};

interface ApiResponse<T> {
	data: T;
	message?: string;
}

async function request<T>(
	endpoint: string,
	options?: RequestOptions,
): Promise<T> {
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

	const token = getAuthToken();
	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}

	const response = await fetch(url, {
		credentials: 'include',
		headers,
		...init,
	});

	if (response.status === 401) {
		clearAuthToken();
		window.location.href = '/login';
		throw new Error('Unauthorized');
	}

	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(
			(error as { message?: string }).message ?? response.statusText,
		);
	}

	return response.json() as Promise<T>;
}

export const api = {
	get: <T>(endpoint: string, params?: Record<string, string>) =>
		request<ApiResponse<T>>(endpoint, { params }).then((r) => r.data),

	post: <T = void>(endpoint: string, body?: unknown) =>
		request<ApiResponse<T>>(endpoint, {
			method: 'POST',
			body: body ? JSON.stringify(body) : undefined,
		}).then((r) => r.data),

	put: <T = void>(endpoint: string, body?: unknown) =>
		request<ApiResponse<T>>(endpoint, {
			method: 'PUT',
			body: body ? JSON.stringify(body) : undefined,
		}).then((r) => r.data),

	del: <T = void>(endpoint: string) =>
		request<ApiResponse<T>>(endpoint, { method: 'DELETE' }).then((r) => r.data),
};
