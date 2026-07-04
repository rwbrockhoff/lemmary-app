import type { WorkflowStage } from '@/types/api';
import { BorderSelect } from '@/components/border-select/border-select';

type StageSelectProps = {
	stages: WorkflowStage[];
	value: string | null;
	onChange: (stageId: string) => void;
};

export const StageSelect = ({ stages, value, onChange }: StageSelectProps) => {
	const currentStage = stages.find((s) => s.id === value);
	const options = stages.map((stage) => ({ value: stage.id, label: stage.name }));

	return (
		<BorderSelect
			value={value}
			onChange={onChange}
			options={options}
			ariaLabel="Workflow stage"
			color={currentStage?.color ?? 'slate'}
			placeholder="No status"
		/>
	);
};
