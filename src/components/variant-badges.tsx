import { Badge } from '@artifact-ui/core';
import type { VariantOption } from '@/types/api';

type VariantBadgesProps = {
	variants: VariantOption[] | null;
};

const MAX_LENGTH = 20;

function truncate(text: string): string {
	if (text.length <= MAX_LENGTH) return text;
	return text.slice(0, MAX_LENGTH) + '…';
}

export const VariantBadges = ({ variants }: VariantBadgesProps) => {
	if (!variants || variants.length === 0) return <>—</>;

	return (
		<div className="flex flex-wrap gap-1">
			{variants.map((variant, index) => (
				<Badge key={`${variant.value}-${index}`} variant="outline" color="neutral" size="1" title={`${variant.name}: ${variant.value}`}>
					{truncate(variant.value)}
				</Badge>
			))}
		</div>
	);
};
