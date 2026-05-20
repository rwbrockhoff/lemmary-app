import { Table, Checkbox, Badge, cn } from '@artifact-ui/core';
import { StageSelect } from '@/features/orders/components/stage-select';
import { getProgressColor } from '../batch-utils';
import { formatDate } from '@/utils/format';
import styles from '@/styles/shared.module.css';
import type { BatchOrder, BatchOrderItem, WorkflowStage } from '@/types/api';

type BatchOrderRowProps = {
	order: BatchOrder;
	items: BatchOrderItem[];
	orderStages: WorkflowStage[];
	stagesLoading: boolean;
	onRowClick: () => void;
	onCheckboxToggle: () => void;
	onStageChange: (stageId: string) => void;
};

export const BatchOrderRow = ({
	order,
	items,
	orderStages,
	stagesLoading,
	onRowClick,
	onCheckboxToggle,
	onStageChange,
}: BatchOrderRowProps) => {
	const completed = items.filter((i) => i.is_complete).length;
	const total = items.length;

	const currentStage = orderStages.find((s) => s.id === order.workflow_stage_id);
	const isStageComplete = currentStage?.is_complete;
	const isInProgress = !isStageComplete && !currentStage?.is_default;
	const rowClass =
		isStageComplete || order.completed
			? styles.completedRow
			: isInProgress
				? styles.inProgressRow
				: '';

	return (
		<Table.Row className={cn('cursor-pointer', rowClass)} onClick={onRowClick}>
			<Table.Cell onClick={(e) => e.stopPropagation()}>
				<Checkbox checked={order.completed} onCheckedChange={onCheckboxToggle} />
			</Table.Cell>
			<Table.Cell>{order.order_number}</Table.Cell>
			<Table.Cell className="truncate max-w-0">{order.customer_name}</Table.Cell>
			<Table.Cell>{formatDate(order.order_date)}</Table.Cell>
			<Table.Cell>{order.due_date ? formatDate(order.due_date) : '—'}</Table.Cell>
			<Table.Cell>
				<Badge size="1" variant="soft" color={getProgressColor(completed, total)}>
					{completed}/{total}
				</Badge>
			</Table.Cell>
			<Table.Cell onClick={(e) => e.stopPropagation()}>
				{!stagesLoading && (
					<StageSelect
						stages={orderStages}
						value={order.workflow_stage_id}
						onChange={onStageChange}
					/>
				)}
			</Table.Cell>
		</Table.Row>
	);
};
