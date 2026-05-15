import { useCallback, useState } from 'react';
import type { ReactNode } from 'react';
import { Toast, ToastProvider } from '@artifact-ui/core';
import {
	ToastContext,
	type ToastApi,
	type ToastItem,
	type ToastVariant,
} from './toast-context';

type ToastContextProviderProps = {
	children: ReactNode;
};

export const ToastContextProvider = ({ children }: ToastContextProviderProps) => {
	const [toasts, setToasts] = useState<ToastItem[]>([]);

	const pushToast = useCallback(
		(variant: ToastVariant, description: string, title?: string) => {
			const id = crypto.randomUUID();
			setToasts((prev) => [...prev, { id, variant, description, title }]);
		},
		[],
	);

	const dismiss = useCallback((id: string) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	}, []);

	const api: ToastApi = {
		success: (description, title) => pushToast('success', description, title),
		error: (description, title) => pushToast('error', description, title),
		info: (description, title) => pushToast('info', description, title),
		warning: (description, title) => pushToast('warning', description, title),
	};

	return (
		<ToastContext.Provider value={api}>
			<ToastProvider position="bottom-right" duration={3000}>
				{children}
				{toasts.map((t) => (
					<Toast
						key={t.id}
						variant={t.variant}
						title={t.title}
						description={t.description}
						onClose={() => dismiss(t.id)}
					/>
				))}
			</ToastProvider>
		</ToastContext.Provider>
	);
};
