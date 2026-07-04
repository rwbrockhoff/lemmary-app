import type { MaterialLibraryItem } from '@/types/api';
import {
	MEASUREMENT_LABELS,
	MEASUREMENT_COLOR_SLUG,
	MEASUREMENT_ICON,
} from './measurement';
import { BorderBadge } from '@/components/border-badge/border-badge';

type Measurement = MaterialLibraryItem['measurement'];

export const CategoryBadge = ({ measurement }: { measurement: Measurement }) => {
	const Icon = MEASUREMENT_ICON[measurement];

	return (
		<BorderBadge color={MEASUREMENT_COLOR_SLUG[measurement]} icon={<Icon size={12} />}>
			{MEASUREMENT_LABELS[measurement]}
		</BorderBadge>
	);
};
