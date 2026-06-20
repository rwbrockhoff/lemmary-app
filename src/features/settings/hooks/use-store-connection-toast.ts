import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router';
import { useToast } from '@/providers/toast-context';

export const useStoreConnectionToast = () => {
	const toast = useToast();

	const [searchParams, setSearchParams] = useSearchParams();
	const toastedRef = useRef(false);

	useEffect(() => {
		const platform = searchParams.get('connected');
		const error = searchParams.get('error');

		if ((!platform && !error) || toastedRef.current) return;
		toastedRef.current = true;

		if (platform) {
			const label = platform.charAt(0).toUpperCase() + platform.slice(1);
			toast.success(`Connected to ${label}`);
		} else {
			toast.error('Please try again.', 'Could not connect store');
		}

		const next = new URLSearchParams(searchParams);
		next.delete('connected');
		next.delete('error');
		setSearchParams(next, { replace: true });
	}, [searchParams, setSearchParams, toast]);
};
