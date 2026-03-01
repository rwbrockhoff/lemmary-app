import { Select } from '@artifact-ui/core';
import { BATCH_STATUSES, getBatchStatusColor } from '../batch-utils';
import styles from '@/styles/shared.module.css';

type BatchStatusSelectProps = {
	value: string;
	onChange: (status: string) => void;
};

const triggerColorClass: Record<string, string> = {
	info: styles.statusInfo,
	success: styles.statusSuccess,
};

export const BatchStatusSelect = ({ value, onChange }: BatchStatusSelectProps) => {
	const colorClass = triggerColorClass[getBatchStatusColor(value)] ?? '';

	return (
		<Select.Root value={value} onValueChange={onChange} size="1">
			<Select.Trigger
				aria-label="Batch status"
				variant="minimal"
				className={colorClass}
			>
				{value}
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					{BATCH_STATUSES.map((status) => (
						<Select.Item key={status} value={status} textValue={status}>
							{status}
						</Select.Item>
					))}
				</Select.Group>
			</Select.Content>
		</Select.Root>
	);
};
