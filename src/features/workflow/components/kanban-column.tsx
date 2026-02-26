import { useDroppable } from '@dnd-kit/core';
import { Text } from '@artifact-ui/core';
import { StatusBadge } from '@/features/orders/components/status-badge';
import { DraggableOrderCard } from './order-card';
import type { WorkflowBoardOrder, WorkflowStage } from '@/types/api';

type KanbanColumnProps = {
	stage: WorkflowStage;
	orders: WorkflowBoardOrder[];
};

export const KanbanColumn = ({ stage, orders }: KanbanColumnProps) => {
	const { setNodeRef, isOver } = useDroppable({ id: stage.id });

	return (
		<div className="flex flex-col min-w-[280px] max-w-[320px] shrink-0">
			<div className="flex items-center gap-2 mb-3 px-1">
				<StatusBadge name={stage.name} color={stage.color} />
				<Text size="1" color="secondary">
					{orders.length}
				</Text>
			</div>
			<div
				ref={setNodeRef}
				className={`flex flex-col gap-2 min-h-[200px] rounded-lg p-2 transition-colors ${
					isOver ? 'bg-blue-50 ring-2 ring-blue-200' : 'bg-gray-50'
				}`}
			>
				{orders.map((order) => (
					<DraggableOrderCard key={order.id} order={order} />
				))}
				{orders.length === 0 && (
					<Text size="1" color="secondary" className="text-center py-8">
						No orders
					</Text>
				)}
			</div>
		</div>
	);
};
