import { useMutation } from '@tanstack/react-query';
import { api } from '@/api/client';
import { useToast } from '@/providers/toast-context';

export const usePrintBatchSlips = () => {
	const toast = useToast();

	const mutation = useMutation({
		mutationFn: async (batchId: string) => {
			const blob = await api.download(`/batches/${batchId}/packing-slips`);
			return URL.createObjectURL(blob);
		},
	});

	const print = (batchId: string) => {
		// Open the tab on the click itself so Safari doesn't block the popup
		const tab = window.open('', '_blank');
		mutation.mutate(batchId, {
			onSuccess: (url) => {
				if (tab) tab.location.href = url;
				else window.open(url, '_blank');
			},
			onError: (error) => {
				tab?.close();
				toast.error(error.message, 'Could not open packing slips');
			},
		});
	};

	return { print, isPending: mutation.isPending };
};
