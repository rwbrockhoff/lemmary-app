import { Select } from '@artifact-ui/core';
import type { ProductionType } from '@/types/api';
import { PRODUCTION_TYPES, isProductionType } from '../production-type';

type ProductionTypeSelectProps = {
	value: ProductionType | undefined;
	onChange: (value: ProductionType) => void;
	disabled?: boolean;
};

export const ProductionTypeSelect = ({
	value,
	onChange,
	disabled,
}: ProductionTypeSelectProps) => (
	<Select.Root
		value={value}
		onValueChange={(v) => isProductionType(v) && onChange(v)}
		size="1"
		disabled={disabled}>
		<Select.Trigger aria-label="Production type" variant="minimal" placeholder="Mixed" />
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
