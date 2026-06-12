import { Select } from '@artifact-ui/core';
import type { WorkflowStage } from '@/types/api';
import { getStageColorStyle } from './stage-colors';

type StageSelectProps = {
	stages: WorkflowStage[];
	value: string | null;
	onChange: (stageId: string) => void;
};

export const StageSelect = ({ stages, value, onChange }: StageSelectProps) => {
	const currentStage = stages.find((s) => s.id === value);

	// The minimal trigger has no border, so add width/style for the stage color to show
	const triggerStyle = {
		...getStageColorStyle(currentStage?.color ?? null),
		borderWidth: 1,
		borderStyle: 'solid',
	};

	return (
		<Select.Root value={value ?? undefined} onValueChange={onChange} size="1">
			<Select.Trigger aria-label="Workflow stage" variant="minimal" style={triggerStyle}>
				{currentStage?.name ?? 'No status'}
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					{stages.map((stage) => (
						<Select.Item key={stage.id} value={stage.id} textValue={stage.name}>
							{stage.name}
						</Select.Item>
					))}
				</Select.Group>
			</Select.Content>
		</Select.Root>
	);
};
