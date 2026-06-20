import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router';
import { useToast } from '@/providers/toast-context';

export const useStoreConnectionToast = () => {
	const toast = useToast();

	const [searchParams, setSearchParams] = useSearchParams();
	const toastedRef = useRef(false);

	useEffect(() => {
		const platform = searchParams.get('connected');
		if (!platform || toastedRef.current) return;
		toastedRef.current = true;
		const label = platform.charAt(0).toUpperCase() + platform.slice(1);
		toast.success(`Connected to ${label}`);
		const next = new URLSearchParams(searchParams);
		next.delete('connected');
		setSearchParams(next, { replace: true });
	}, [searchParams, setSearchParams, toast]);
};
