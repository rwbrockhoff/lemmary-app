import type { MaterialLibraryItem } from '@/types/api';

type Measurement = MaterialLibraryItem['measurement'];

export const MEASUREMENT_LABELS: Record<Measurement, string> = {
	area: 'Fabric',
	linear: 'Linear',
	count: 'Hardware',
};

export const MEASUREMENT_COLOR_SLUG: Record<Measurement, string> = {
	area: 'cobalt',
	linear: 'pine',
	count: 'marigold',
};

export const MEASUREMENT_OPTIONS: { value: Measurement; label: string }[] = [
	{ value: 'area', label: 'Fabric' },
	{ value: 'linear', label: 'Linear' },
	{ value: 'count', label: 'Hardware' },
];
