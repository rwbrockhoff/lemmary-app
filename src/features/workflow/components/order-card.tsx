import { useNavigate } from 'react-router';
import { useDraggable } from '@dnd-kit/core';
import { Text, Badge, Card, Flex, Stack, cn } from '@artifact-ui/core';
import { formatDate } from '@/utils/format';
import { CustomerNameWithNotes } from '@/components/customer-name-with-notes/customer-name-with-notes';
import type { WorkflowBoardOrder } from '@/types/api';
import { getProgressColor } from '@/features/batches/utils/batch-utils';
import styles from './order-card.module.css';

export const DraggableOrderCard = ({ order }: { order: WorkflowBoardOrder }) => {
	const navigate = useNavigate();
	const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
		id: order.id,
	});

	return (
		<div
			ref={setNodeRef}
			{...listeners}
			{...attributes}
			style={{ opacity: isDragging ? 0.3 : 1 }}
			onClick={() => navigate(`/orders/${order.id}?from=workflow`)}>
			<OrderCardContent order={order} />
		</div>
	);
};

export const OrderCardOverlay = ({ order }: { order: WorkflowBoardOrder }) => {
	return (
		<div className={cn(styles.overlay, 'w-[280px]')}>
			<OrderCardContent order={order} />
		</div>
	);
};

const OrderCardContent = ({ order }: { order: WorkflowBoardOrder }) => {
	const stageColor = order.workflow_stage_color
		? `var(--wf-stage-color-${order.workflow_stage_color})`
		: undefined;

	return (
		<Card.Root
			className={cn(styles.card, 'cursor-pointer')}
			style={stageColor ? { borderTop: `3px solid ${stageColor}` } : undefined}>
			<Card.Body className="p-3">
				<Flex justify="between" align="center" className="mb-1">
					<Text size="2" weight="medium">
						{order.order_number}
					</Text>
					{order.batch_name && (
						<Badge variant="outline" size="1" color="neutral">
							{order.batch_name}
						</Badge>
					)}
				</Flex>
				<div className="mb-1">
					<Text size="2" weight="medium" color="secondary">
						<CustomerNameWithNotes
							name={order.customer_name}
							hasNotes={Boolean(order.order_notes)}
						/>
					</Text>
				</div>
				<div className="mb-2">
					<Stack gap="1">
						<Text size="1" color="secondary">
							Ordered: {formatDate(order.order_date)}
						</Text>
						{order.due_date && (
							<Text size="1" color="secondary">
								Due: {formatDate(order.due_date)}
							</Text>
						)}
					</Stack>
				</div>
				<Badge
					variant="soft"
					size="1"
					color={getProgressColor(order.items_completed, order.item_count)}
					className="self-start">
					{order.items_completed}/{order.item_count} Items
				</Badge>
			</Card.Body>
		</Card.Root>
	);
};
