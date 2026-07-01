const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

const DEMO_READONLY_CODE = 'DEMO_READ_ONLY';
export const DEMO_READONLY_MESSAGE = 'Demo mode is read-only. Sign up to make changes.';

export class ApiError extends Error {
	status: number;
	code?: string;
	details?: unknown;

	constructor(status: number, message: string, code?: string, details?: unknown) {
		super(message);
		this.name = 'ApiError';
		this.status = status;
		this.code = code;
		this.details = details;
	}
}

type RequestOptions = RequestInit & {
	params?: Record<string, string>;
};

interface ApiResponse<T> {
	data: T;
	message?: string;
}

async function request<T>(endpoint: string, options?: RequestOptions): Promise<T> {
	const { params, ...init } = options ?? {};

	let url = `${BASE_URL}${endpoint}`;
	if (params) {
		const searchParams = new URLSearchParams(params);
		url += `?${searchParams.toString()}`;
	}

	const headers: Record<string, string> = {
		...(init?.headers as Record<string, string>),
	};
	if (init?.body) {
		headers['Content-Type'] = 'application/json';
	}

	const response = await fetch(url, {
		credentials: 'include',
		headers,
		...init,
	});

	await throwIfError(response);

	return response.json() as Promise<T>;
}

async function throwIfError(response: Response): Promise<void> {
	if (response.ok) return;

	const body = await response.json().catch(() => ({}));
	const data = body as {
		error?: string | { message?: string; code?: string; details?: unknown };
		message?: string;
		code?: string;
	};

	const errorObject = typeof data.error === 'object' ? data.error : null;
	const code = data.code ?? errorObject?.code;

	if (code === DEMO_READONLY_CODE) {
		throw new ApiError(response.status, DEMO_READONLY_MESSAGE, code);
	}

	const message =
		(typeof data.error === 'string' ? data.error : errorObject?.message) ??
		data.message ??
		response.statusText;
	throw new ApiError(response.status, message, code, errorObject?.details);
}

async function requestBlob(endpoint: string, options?: RequestOptions): Promise<Blob> {
	const { params, ...init } = options ?? {};

	let url = `${BASE_URL}${endpoint}`;
	if (params) {
		const searchParams = new URLSearchParams(params);
		url += `?${searchParams.toString()}`;
	}

	const headers: Record<string, string> = {
		...(init?.headers as Record<string, string>),
	};
	if (init?.body) {
		headers['Content-Type'] = 'application/json';
	}

	const response = await fetch(url, {
		credentials: 'include',
		headers,
		...init,
	});

	await throwIfError(response);

	return response.blob();
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

	patch: <T = void>(endpoint: string, body?: unknown) =>
		request<ApiResponse<T>>(endpoint, {
			method: 'PATCH',
			body: body ? JSON.stringify(body) : undefined,
		}).then((r) => r.data),

	del: <T = void>(endpoint: string, params?: Record<string, string>) =>
		request<ApiResponse<T>>(endpoint, { method: 'DELETE', params }).then((r) => r.data),

	download: (endpoint: string, options?: RequestOptions) =>
		requestBlob(endpoint, options),
};
