import { Table, Checkbox, Badge, Flex } from '@artifact-ui/core';
import { StageSelect } from '@/components/orders/stage-select';
import { StageBadge } from '@/components/orders/stage-badge';
import { LockIcon } from '@/components/icons';
import { CustomerNameWithNotes } from '@/components/customer-name-with-notes/customer-name-with-notes';
import { OrderNumberLabel } from '@/components/orders/order-number-label';
import { isOrderLocked, getOrderDisplayName } from '@/utils/orders';
import { getProgressColor } from '../utils/batch-utils';
import { formatDate } from '@/utils/format';
import { useFormatDateTz } from '@/hooks/use-format-date-tz';
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
	const formatTz = useFormatDateTz();
	const completed = items.filter((i) => i.is_complete).length;
	const total = items.length;

	const currentStage = orderStages.find((s) => s.id === order.workflow_stage_id);
	const isLocked = isOrderLocked(order);

	return (
		<Table.Row className="cursor-pointer" onClick={onRowClick}>
			<Table.Cell onClick={(e) => e.stopPropagation()}>
				<Checkbox
					checked={order.completed}
					disabled={isLocked}
					onCheckedChange={onCheckboxToggle}
				/>
			</Table.Cell>
			<Table.Cell>
				<Flex align="center" gap="1">
					<OrderNumberLabel
						orderNumber={order.order_number}
						orderType={order.order_type}
					/>
					{isLocked && <LockIcon size={12} />}
				</Flex>
			</Table.Cell>
			<Table.Cell className="truncate max-w-0">
				<CustomerNameWithNotes
					name={getOrderDisplayName(order)}
					hasNotes={Boolean(order.order_notes)}
				/>
			</Table.Cell>
			<Table.Cell>{formatTz(order.order_date)}</Table.Cell>
			<Table.Cell>{order.due_date ? formatDate(order.due_date) : '—'}</Table.Cell>
			<Table.Cell>
				<Badge size="1" variant="soft" color={getProgressColor(completed, total)}>
					{completed}/{total}
				</Badge>
			</Table.Cell>
			<Table.Cell onClick={(e) => e.stopPropagation()}>
				{!stagesLoading &&
					(isLocked ? (
						<StageBadge
							name={currentStage?.name ?? null}
							color={currentStage?.color ?? null}
						/>
					) : (
						<StageSelect
							stages={orderStages}
							value={order.workflow_stage_id}
							onChange={onStageChange}
						/>
					))}
			</Table.Cell>
		</Table.Row>
	);
};
