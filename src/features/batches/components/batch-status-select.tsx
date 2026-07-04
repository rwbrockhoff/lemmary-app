import { BATCH_STATUSES, getBatchStatusColor } from '../utils/batch-utils';
import { BorderSelect } from '@/components/border-select/border-select';

type BatchStatusSelectProps = {
	value: string;
	onChange: (status: string) => void;
};

export const BatchStatusSelect = ({ value, onChange }: BatchStatusSelectProps) => {
	const color = getBatchStatusColor(value);
	const options = BATCH_STATUSES.map((status) => ({ value: status, label: status }));

	return (
		<BorderSelect
			value={value}
			onChange={onChange}
			options={options}
			ariaLabel="Batch status"
			color={color === 'neutral' ? undefined : color}
		/>
	);
};
