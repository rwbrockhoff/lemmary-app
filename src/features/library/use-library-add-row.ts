import type React from 'react';
import { useState } from 'react';
import { useToast } from '@/providers/toast-context';
import { useCreateMaterial } from './library-queries';
import type { MaterialLibraryItem, BomMaterialType } from '@/types/api';

type Measurement = MaterialLibraryItem['measurement'];

type AddDraft = {
	typeName: string;
	typeId: string | null;
	measurement: Measurement;
	color: string;
	size: string;
	purchaseUrl: string;
};

const EMPTY: AddDraft = {
	typeName: '',
	typeId: null,
	measurement: 'area',
	color: '',
	size: '',
	purchaseUrl: '',
};

export const useLibraryAddRow = (onClose: () => void) => {
	const [form, setForm] = useState<AddDraft>(EMPTY);
	const toast = useToast();
	const create = useCreateMaterial();

	const setField = (field: 'color' | 'size', value: string) =>
		setForm((prev) => ({ ...prev, [field]: value }));

	const handleTypeChange = (name: string) =>
		setForm((prev) => ({ ...prev, typeName: name }));

	const handleTypeMatch = (type: BomMaterialType | null) =>
		setForm((prev) => ({
			...prev,
			typeId: type?.id ?? null,
			measurement: type ? type.measurement : prev.measurement,
		}));

	const handleSelectType = (type: BomMaterialType) =>
		setForm((prev) => ({
			...prev,
			typeName: type.name,
			typeId: type.id,
			measurement: type.measurement,
		}));

	const handleMeasurementChange = (measurement: Measurement) =>
		setForm((prev) => ({ ...prev, measurement }));

	const handleLinkSave = (url: string) =>
		setForm((prev) => ({ ...prev, purchaseUrl: url }));

	const save = () => {
		const name = form.typeName.trim();
		if (!name) {
			onClose();
			return;
		}

		const color = form.color.trim() || null;
		const size = form.size.trim() || null;
		const purchase_url = form.purchaseUrl.trim() || null;

		const payload = form.typeId
			? { material_type_id: form.typeId, color, size, purchase_url }
			: {
					material_type_name: name,
					measurement: form.measurement,
					color,
					size,
					purchase_url,
				};

		create.mutate(payload, {
			onSuccess: () => onClose(),
			onError: (error) => toast.error(error.message, 'Could not add material'),
		});
	};

	const handleRowBlur = (e: React.FocusEvent) => {
		const row = (e.currentTarget as HTMLElement).closest('tr');
		const related = e.relatedTarget as HTMLElement | null;
		if (row && related && row.contains(related)) return;
		if (related?.closest('[data-radix-popper-content-wrapper]')) return;
		save();
	};

	return {
		form,
		setField,
		handleTypeChange,
		handleTypeMatch,
		handleSelectType,
		handleMeasurementChange,
		handleLinkSave,
		handleRowBlur,
	};
};
