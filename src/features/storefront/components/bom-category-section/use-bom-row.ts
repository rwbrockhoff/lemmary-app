import React, { useState, useRef, useCallback } from 'react';
import { useUpdateBomItem, useDeleteBomItem } from '../../api/bom-queries';
import type { BomItem, MaterialCatalogEntry } from '@/types/api';

type RowData = {
	materialTypeId: string;
	materialTypeName: string;
	piece: string;
	color: string;
	size: string;
	length: string;
	quantity: string;
	purchaseUrl: string;
};

const itemToRowData = (item: BomItem): RowData => ({
	materialTypeId: item.material_type_id ?? '',
	materialTypeName: item.material_type_name ?? '',
	piece: item.piece,
	color: item.color ?? '',
	size: item.size ?? '',
	length: item.length ?? '',
	quantity: String(item.quantity),
	purchaseUrl: item.purchase_url ?? '',
});

type UseBomRowParams = {
	item: BomItem;
	measurement: string;
	variantId: string;
	isNew?: boolean;
};

export const useBomRow = ({ item, measurement, variantId, isNew }: UseBomRowParams) => {
	const [form, setForm] = useState<RowData>(() => {
		const data = itemToRowData(item);
		if (isNew) return { ...data, materialTypeName: '' };
		return data;
	});
	const savedRef = useRef<RowData>(itemToRowData(item));
	const updateMutation = useUpdateBomItem(variantId);
	const deleteMutation = useDeleteBomItem(variantId);

	const handleFieldChange = (field: keyof RowData, value: string) => {
		setForm((prev) => ({ ...prev, [field]: value }));
	};

	const setMaterialTypeId = (id: string | null) => {
		setForm((prev) => ({ ...prev, materialTypeId: id ?? '' }));
	};

	const handleLinkSave = (url: string) => {
		const updated = { ...form, purchaseUrl: url };
		setForm(updated);
		savedRef.current = { ...updated };
		updateMutation.mutate({
			bomItemId: item.id,
			piece: updated.piece.trim(),
			length: updated.length || null,
			quantity: Number(updated.quantity) || 1,
			measurement,
			material_type_id: updated.materialTypeId || null,
			material_type_name: updated.materialTypeName || null,
			color: updated.color || null,
			size: updated.size || null,
			purchase_url: updated.purchaseUrl || null,
		});
	};

	const handleTypeSelect = (entry: MaterialCatalogEntry) => {
		setForm((prev) => ({
			...prev,
			materialTypeId: entry.material_type_id,
			materialTypeName: entry.material_type_name,
			color: entry.color ?? prev.color,
			size: entry.size ?? prev.size,
			purchaseUrl: entry.purchase_url ?? prev.purchaseUrl,
		}));
	};

	const saveChanges = useCallback(() => {
		const current = form;
		const saved = savedRef.current;

		const hasChanges =
			current.materialTypeId !== saved.materialTypeId ||
			current.materialTypeName !== saved.materialTypeName ||
			current.piece !== saved.piece ||
			current.color !== saved.color ||
			current.size !== saved.size ||
			current.length !== saved.length ||
			current.quantity !== saved.quantity ||
			current.purchaseUrl !== saved.purchaseUrl;

		if (!hasChanges) return;

		savedRef.current = { ...current };
		updateMutation.mutate({
			bomItemId: item.id,
			piece: current.piece.trim(),
			length: current.length || null,
			quantity: Number(current.quantity) || 1,
			measurement,
			material_type_id: current.materialTypeId || null,
			material_type_name: current.materialTypeName || null,
			color: current.color || null,
			size: current.size || null,
			purchase_url: current.purchaseUrl || null,
		});
	}, [form, item.id, measurement, updateMutation]);

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

	const deleteItem = () => deleteMutation.mutate(item.id);

	return {
		form,
		handleFieldChange,
		setMaterialTypeId,
		handleLinkSave,
		handleTypeSelect,
		handleRowBlur,
		deleteItem,
	};
};
