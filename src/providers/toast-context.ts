import { createContext, useContext } from 'react';

export type ToastVariant = 'default' | 'info' | 'success' | 'warning' | 'error';

export type ToastItem = {
	id: string;
	variant: ToastVariant;
	title?: string;
	description: string;
};

export type ToastApi = {
	success: (description: string, title?: string) => void;
	error: (description: string, title?: string) => void;
	info: (description: string, title?: string) => void;
	warning: (description: string, title?: string) => void;
};

export const ToastContext = createContext<ToastApi | null>(null);

export const useToast = () => {
	const ctx = useContext(ToastContext);
	if (!ctx) {
		throw new Error('useToast must be used within ToastContextProvider');
	}
	return ctx;
};
