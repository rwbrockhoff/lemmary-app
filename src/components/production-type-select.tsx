import { Select } from '@artifact-ui/core';
import type { ProductionType } from '@/types/api';
import { PRODUCTION_TYPES, isProductionType } from '@/utils/production-type';

type ProductionTypeSelectProps = {
	value: ProductionType | undefined;
	onChange: (value: ProductionType) => void;
	disabled?: boolean;
	variant?: 'default' | 'minimal';
	size?: '1' | '2' | '3' | '4';
};

export const ProductionTypeSelect = ({
	value,
	onChange,
	disabled,
	variant = 'minimal',
	size = '1',
}: ProductionTypeSelectProps) => (
	<Select.Root
		value={value}
		onValueChange={(v) => isProductionType(v) && onChange(v)}
		size={size}
		disabled={disabled}>
		<Select.Trigger aria-label="Production type" variant={variant} placeholder="Mixed" />
		<Select.Content>
			<Select.Group>
				{PRODUCTION_TYPES.map((type) => (
					<Select.Item key={type.value} value={type.value} textValue={type.label}>
						{type.label}
					</Select.Item>
				))}
			</Select.Group>
		</Select.Content>
	</Select.Root>
);
