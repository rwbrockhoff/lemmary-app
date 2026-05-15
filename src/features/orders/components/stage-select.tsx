import { Select } from '@artifact-ui/core';
import type { WorkflowStage } from '@/types/api';
import { StageBadge } from './stage-badge';

type StageSelectProps = {
	stages: WorkflowStage[];
	value: string | null;
	onChange: (stageId: string) => void;
};

export const StageSelect = ({ stages, value, onChange }: StageSelectProps) => {
	const currentStage = stages.find((s) => s.id === value);

	return (
		<Select.Root value={value ?? undefined} onValueChange={onChange} size="1">
			<Select.Trigger aria-label="Workflow stage" variant="minimal">
				<StageBadge
					name={currentStage?.name ?? null}
					color={currentStage?.color ?? null}
				/>
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
