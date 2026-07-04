import { Select } from '@artifact-ui/core';
import { getTintStyle } from '../border-tint';

type BorderSelectOption = {
	value: string;
	label: string;
};

type BorderSelectProps = {
	value: string | null;
	onChange: (value: string) => void;
	options: BorderSelectOption[];
	ariaLabel: string;
	color?: string | null;
	placeholder?: string;
};

export const BorderSelect = ({
	value,
	onChange,
	options,
	ariaLabel,
	color,
	placeholder,
}: BorderSelectProps) => {
	const selected = options.find((option) => option.value === value);

	// Minimal trigger has no border, so add width/style for the tint color to show
	const triggerStyle = color
		? { ...getTintStyle(color), borderWidth: 1, borderStyle: 'solid' as const }
		: undefined;

	return (
		<Select.Root value={value ?? undefined} onValueChange={onChange} size="1">
			<Select.Trigger aria-label={ariaLabel} variant="minimal" style={triggerStyle}>
				{selected?.label ?? placeholder}
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					{options.map((option) => (
						<Select.Item key={option.value} value={option.value} textValue={option.label}>
							{option.label}
						</Select.Item>
					))}
				</Select.Group>
			</Select.Content>
		</Select.Root>
	);
};
