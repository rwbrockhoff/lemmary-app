import { Controller, useFormContext } from 'react-hook-form';
import { DatePicker } from '@artifact-ui/core';
import { parseDateValue, formatDateValue } from '@/utils/date';
import { LabeledField } from './labeled-field';

type DateForm = { orderDate?: string; dueDate?: string };

type DateFieldProps = {
	name: keyof DateForm;
	label: string;
};

export const DateField = ({ name, label }: DateFieldProps) => {
	const { control } = useFormContext<DateForm>();

	return (
		<LabeledField label={label} className="flex-1">
			<Controller
				control={control}
				name={name}
				render={({ field }) => (
					<DatePicker
						selected={parseDateValue(field.value)}
						onSelect={(date) => field.onChange(date ? formatDateValue(date) : '')}
						placeholder="Select date"
						className="w-full"
					/>
				)}
			/>
		</LabeledField>
	);
};
