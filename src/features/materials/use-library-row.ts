import React, { useState, useRef, useCallback } from 'react';
import { useToast } from '@/providers/toast-context';
import { useUpdateMaterial } from './materials-queries';
import type { MaterialLibraryItem } from '@/types/api';

type RowData = {
	color: string;
	size: string;
	purchaseUrl: string;
};

const toRowData = (material: MaterialLibraryItem): RowData => ({
	color: material.color ?? '',
	size: material.size ?? '',
	purchaseUrl: material.purchase_url ?? '',
});

export const useLibraryRow = (material: MaterialLibraryItem) => {
	const [form, setForm] = useState<RowData>(() => toRowData(material));
	const savedRef = useRef<RowData>(toRowData(material));
	const toast = useToast();
	const updateMutation = useUpdateMaterial();

	const handleFieldChange = (field: keyof RowData, value: string) => {
		setForm((prev) => ({ ...prev, [field]: value }));
	};

	const save = useCallback(
		(next: RowData) => {
			const previous = savedRef.current;
			savedRef.current = { ...next };

			updateMutation.mutate(
				{
					materialId: material.id,
					color: next.color.trim() || null,
					size: next.size.trim() || null,
					purchase_url: next.purchaseUrl.trim() || null,
				},
				{
					onError: (error) => {
						savedRef.current = previous;
						setForm(previous);
						toast.error(error.message, 'Could not update material');
					},
				},
			);
		},
		[material.id, updateMutation, toast],
	);

	const handleLinkSave = (url: string) => {
		const next = { ...form, purchaseUrl: url };
		setForm(next);
		save(next);
	};

	const saveChanges = useCallback(() => {
		const current = form;
		const saved = savedRef.current;

		const hasChanges =
			current.color !== saved.color ||
			current.size !== saved.size ||
			current.purchaseUrl !== saved.purchaseUrl;

		if (!hasChanges) return;
		save(current);
	}, [form, save]);

	const handleRowBlur = useCallback(
		(e: React.FocusEvent) => {
			const row = (e.currentTarget as HTMLElement).closest('tr');
			const relatedTarget = e.relatedTarget as HTMLElement | null;
			if (row && relatedTarget && row.contains(relatedTarget)) return;

			const isPortalElement = relatedTarget?.closest(
				'[data-radix-popper-content-wrapper]',
			);
			if (isPortalElement) return;

			saveChanges();
		},
		[saveChanges],
	);

	return { form, handleFieldChange, handleLinkSave, handleRowBlur };
};
