import { Combobox, type ComboboxOption } from '@artifact-ui/core';
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
	const options: ComboboxOption[] = products.flatMap((product) =>
		product.variants.map((variant) => ({
			label: variantLabel(product.name, variant.name),
			value: variant.id,
		})),
	);

	return (
		<Combobox
			options={options}
			value={value}
			onValueChange={(selected) => onChange(selected ?? '')}
			placeholder="Choose item from store..."
			searchPlaceholder="Search products..."
			emptyMessage="No matching products"
			width="100%"
			className={className}
		/>
	);
};
