import { useNavigate } from 'react-router';
import { useDraggable } from '@dnd-kit/core';
import { Text, Badge, Card } from '@artifact-ui/core';
import { formatDate } from '@/utils/format';
import type { WorkflowBoardOrder } from '@/types/api';
import { getProgressColor } from '@/features/batches/batch-utils';

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
			onClick={() => navigate(`/orders/${order.id}?from=workflow`)}
		>
			<OrderCardContent order={order} />
		</div>
	);
};

export const OrderCardOverlay = ({ order }: { order: WorkflowBoardOrder }) => {
	return (
		<div className="w-[280px] rotate-2 shadow-lg">
			<OrderCardContent order={order} />
		</div>
	);
};

const OrderCardContent = ({ order }: { order: WorkflowBoardOrder }) => {
	return (
		<Card.Root className="cursor-pointer hover:shadow-md transition-shadow">
			<Card.Body className="p-3">
				<div className="flex items-center justify-between mb-1">
					<Text size="2" weight="medium">
						{order.order_number}
					</Text>
					{order.batch_name && (
						<Badge variant="outline" size="1" color="neutral">
							{order.batch_name}
						</Badge>
					)}
				</div>
				<Text size="2" color="secondary" className="mb-2">
					{order.customer_name}
				</Text>
				<div className="flex flex-col gap-0.5">
					<Text size="1" color="secondary">
						Ordered: {formatDate(order.order_date)}
					</Text>
					{order.due_date && (
						<Text size="1" color="secondary">
							Due: {formatDate(order.due_date)}
						</Text>
					)}
				</div>
				<Badge
					variant="soft"
					size="1"
					color={getProgressColor(order.items_completed, order.item_count)}
					className="mt-2 self-start"
				>
					{order.items_completed}/{order.item_count} Items
				</Badge>
			</Card.Body>
		</Card.Root>
	);
};
