import { useDroppable } from '@dnd-kit/core';
import { Text, Flex, DropdownMenu } from '@artifact-ui/core';
import { EllipsisHorizontalIcon } from '@/components/icons/icons';
import { StatusBadge } from '@/features/orders/components/status-badge';
import { DraggableOrderCard } from './order-card';
import type { WorkflowBoardOrder, WorkflowStage } from '@/types/api';

type KanbanColumnProps = {
	stage: WorkflowStage;
	orders: WorkflowBoardOrder[];
	collapsed?: boolean;
	onToggleCollapse?: () => void;
};

export const KanbanColumn = ({
	stage,
	orders,
	collapsed,
	onToggleCollapse,
}: KanbanColumnProps) => {
	const { setNodeRef, isOver } = useDroppable({ id: stage.id });

	return (
		<div className="flex flex-col min-w-[280px] max-w-[320px] shrink-0">
			<Flex align="center" gap="2" className="mb-3 px-1">
				<StatusBadge name={stage.name} color={stage.color} />
				<Text size="1" color="secondary">
					{orders.length}
				</Text>
				{stage.is_complete && onToggleCollapse && (<div className="ml-auto">
					<DropdownMenu.DropdownMenu>
						<DropdownMenu.DropdownMenuTrigger asChild>
							<button
								className="p-1 rounded hover:bg-gray-200 focus:outline-none focus-visible:outline-none"
								style={{ outline: 'none' }}
								aria-label="Column options"
							>
								<EllipsisHorizontalIcon size={14} />
							</button>
						</DropdownMenu.DropdownMenuTrigger>
						<DropdownMenu.DropdownMenuContent align="end" size="1">
							<DropdownMenu.DropdownMenuItem onSelect={onToggleCollapse}>
								{collapsed ? 'Show completed orders' : 'Hide completed orders'}
							</DropdownMenu.DropdownMenuItem>
						</DropdownMenu.DropdownMenuContent>
					</DropdownMenu.DropdownMenu>
				</div>)}
			</Flex>
			<div
				ref={setNodeRef}
				className={`flex flex-col gap-2 min-h-[200px] rounded-lg p-2 transition-colors ${
					isOver ? 'bg-blue-50 ring-2 ring-blue-200' : 'bg-gray-50'
				}`}
			>
				{!collapsed &&
					orders.map((order) => (
						<DraggableOrderCard key={order.id} order={order} />
					))}
				{!collapsed && orders.length === 0 && (
					<Text size="1" color="secondary" className="text-center py-8">
						No orders
					</Text>
				)}
				{collapsed && (
					<Text size="1" color="secondary" className="text-center py-8">
						{orders.length} completed {orders.length === 1 ? 'order' : 'orders'}
					</Text>
				)}
			</div>
		</div>
	);
};
