import { Fragment } from 'react';
import { Table, Checkbox, Badge, IconButton, cn } from '@artifact-ui/core';
import { ChevronDownIcon } from '@/components/icons/icons';
import { OrderItemsExpanded } from '@/features/orders/components/order-items-expanded/order-items-expanded';
import { formatDate, formatCurrency } from '@/utils/format';
import { getOrderDisplayName } from '@/utils/orders';
import shared from '@/styles/shared.module.css';
import type { OrderWithItems } from '@/types/api';

type Tab = 'available' | 'in-batches';

type SelectOrdersTableProps = {
	orders: OrderWithItems[];
	tab: Tab;
	selectedOrderIds: Set<string>;
	expandedOrderIds: Set<string>;
	onToggle: (orderId: string) => void;
	onExpand: (orderId: string) => void;
};

export const SelectOrdersTable = ({
	orders,
	tab,
	selectedOrderIds,
	expandedOrderIds,
	onToggle,
	onExpand,
}: SelectOrdersTableProps) => {
	const colCount = tab === 'available' ? 8 : 8;

	return (
		<Table.Root>
			<Table.Header>
				<Table.Row>
					{tab === 'available' && <Table.HeaderCell className="w-10" />}
					<Table.HeaderCell className="w-24">Order #</Table.HeaderCell>
					<Table.HeaderCell className="w-1/4">Name</Table.HeaderCell>
					<Table.HeaderCell className="w-28">Date</Table.HeaderCell>
					<Table.HeaderCell className="w-28">Due</Table.HeaderCell>
					<Table.HeaderCell className="w-16 text-center">Items</Table.HeaderCell>
					{tab === 'in-batches' && <Table.HeaderCell>Batch</Table.HeaderCell>}
					<Table.HeaderCell className="w-24 text-end">Total</Table.HeaderCell>
					<Table.HeaderCell className="w-14" />
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{orders.map((order) => {
					const isExpanded = expandedOrderIds.has(order.id);

					return (
						<Fragment key={order.id}>
							<Table.Row
								className={tab === 'available' ? 'cursor-pointer' : undefined}
								onClick={tab === 'available' ? () => onToggle(order.id) : undefined}>
								{tab === 'available' && (
									<Table.Cell onClick={(e) => e.stopPropagation()}>
										<Checkbox
											checked={selectedOrderIds.has(order.id)}
											onCheckedChange={() => onToggle(order.id)}
										/>
									</Table.Cell>
								)}
								<Table.Cell>{order.order_number}</Table.Cell>
								<Table.Cell className="truncate max-w-0">
									{getOrderDisplayName(order)}
								</Table.Cell>
								<Table.Cell>{formatDate(order.order_date)}</Table.Cell>
								<Table.Cell>
									{order.due_date ? formatDate(order.due_date) : '—'}
								</Table.Cell>
								<Table.Cell className="text-center">{order.item_count}</Table.Cell>
								{tab === 'in-batches' && (
									<Table.Cell>
										<Badge size="1" variant="soft">
											{order.batch_name}
										</Badge>
									</Table.Cell>
								)}
								<Table.Cell className="text-end">
									{formatCurrency(order.grand_total)}
								</Table.Cell>
								<Table.Cell>
									<IconButton
										icon={
											<ChevronDownIcon
												size={16}
												className={cn(
													shared.expandIcon,
													isExpanded && shared.expandIconOpen,
												)}
											/>
										}
										label="Toggle order items"
										size="1"
										variant="ghost"
										color="neutral"
										onClick={(e) => {
											e.stopPropagation();
											onExpand(order.id);
										}}
									/>
								</Table.Cell>
							</Table.Row>
							{isExpanded && (
								<OrderItemsExpanded items={order.items} colSpan={colCount} />
							)}
						</Fragment>
					);
				})}
			</Table.Body>
		</Table.Root>
	);
};
