import { Select, Badge } from '@artifact-ui/core';
import type { WorkflowStage } from '@/types/api';
import styles from '@/styles/shared.module.css';

type StageSelectProps = {
	stages: WorkflowStage[];
	value: string | null;
	onChange: (stageId: string) => void;
};

const colorMap: Record<string, 'neutral' | 'info' | 'success' | 'danger' | 'primary'> = {
	gray: 'neutral',
	blue: 'info',
	orange: 'primary',
	green: 'success',
	red: 'danger',
};

export const getBadgeColor = (color: string) => colorMap[color] ?? 'neutral';

export const StageSelect = ({ stages, value, onChange }: StageSelectProps) => {
	const currentStage = stages.find((s) => s.id === value);
	const badgeColor = currentStage?.is_complete
		? 'success'
		: getBadgeColor(currentStage?.color ?? 'gray');

	return (
		<Select.Root value={value ?? undefined} onValueChange={onChange} size="1">
			<Select.Trigger aria-label="Workflow stage" variant="minimal">
				<Badge
					variant="soft"
					size="1"
					color={badgeColor}
					className={currentStage?.color === 'purple' ? styles.badgePurple : ''}
				>
					{currentStage?.name ?? 'No status'}
				</Badge>
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
