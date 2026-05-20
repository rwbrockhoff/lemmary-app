import type { BatchMaterial } from '@/types/api';

export function formatMaterialQuantity(material: BatchMaterial): string {
	const qty = Number(material.quantity);
	if (material.category === 'linear') {
		const feet = Math.ceil(qty / 12);
		return `${feet} ft`;
	}
	return String(qty);
}
