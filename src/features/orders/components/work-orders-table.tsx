import { useNavigate } from 'react-router';
import { Table, Badge } from '@artifact-ui/core';
import { WrenchIcon } from '@/components/icons';
import { EmptyState } from '@/components/empty-state/empty-state';
import { getProgressColor } from '@/features/batches/utils/batch-utils';
import { StatusBadge } from './status-badge';
import { OrderNumberLabel } from '@/components/orders/order-number-label';
import { formatDate } from '@/utils/format';
import type { OrderWithItems } from '@/types/api';

type WorkOrdersTableProps = {
	orders: OrderWithItems[];
};

export const WorkOrdersTable = ({ orders }: WorkOrdersTableProps) => {
	const navigate = useNavigate();

	if (orders.length === 0) {
		return (
			<EmptyState
				icon={<WrenchIcon size={20} />}
				title="No work orders yet"
				description="Create a work order to build up your store's stock."
				action={{
					label: 'Create work order',
					onClick: () => navigate('/orders/work/new'),
				}}
			/>
		);
	}

	return (
		<Table.Root variant="surface" size="2">
			<Table.Header>
				<Table.Row>
					<Table.HeaderCell className="w-32">Order</Table.HeaderCell>
					<Table.HeaderCell>Title</Table.HeaderCell>
					<Table.HeaderCell className="w-40">Due</Table.HeaderCell>
					<Table.HeaderCell className="w-28">Progress</Table.HeaderCell>
					<Table.HeaderCell className="w-44">Status</Table.HeaderCell>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{orders.map((order) => (
					<Table.Row
						key={order.id}
						className="cursor-pointer"
						onClick={() => navigate(`/orders/${order.id}`)}>
						<Table.Cell>
							<OrderNumberLabel
								orderNumber={order.order_number}
								orderType={order.order_type}
							/>
						</Table.Cell>
						<Table.Cell>{order.order_title ?? '—'}</Table.Cell>
						<Table.Cell>{order.due_date ? formatDate(order.due_date) : '—'}</Table.Cell>
						<Table.Cell>
							<Badge
								size="1"
								variant="soft"
								color={getProgressColor(order.items_completed, order.item_count)}>
								{order.items_completed}/{order.item_count}
							</Badge>
						</Table.Cell>
						<Table.Cell>
							<StatusBadge
								name={order.workflow_stage_name}
								color={order.workflow_stage_color}
							/>
						</Table.Cell>
					</Table.Row>
				))}
			</Table.Body>
		</Table.Root>
	);
};
