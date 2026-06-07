import { Select } from '@artifact-ui/core';
import type { Product } from '@/types/api';
import { variantLabel } from './variant-utils';

type VariantSelectProps = {
	products: Product[];
	value: string | undefined;
	onChange: (variantId: string) => void;
	className?: string;
};

export const VariantSelect = ({
	products,
	value,
	onChange,
	className,
}: VariantSelectProps) => {
	return (
		<Select.Root value={value || undefined} onValueChange={onChange}>
			<Select.Trigger
				aria-label="Product"
				variant="minimal"
				placeholder="Choose item from store..."
				className={className}
			/>
			<Select.Content>
				{products.map((product) => (
					<Select.Group key={product.id}>
						{product.variants.map((variant) => (
							<Select.Item
								key={variant.id}
								value={variant.id}
								textValue={variantLabel(product.name, variant.name)}>
								{variantLabel(product.name, variant.name)}
							</Select.Item>
						))}
					</Select.Group>
				))}
			</Select.Content>
		</Select.Root>
	);
};
