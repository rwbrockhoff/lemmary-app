import { Fragment } from 'react';
import { Table, Checkbox, cn } from '@artifact-ui/core';
import { ChevronDownIcon } from '@/components/icons/icons';
import { OrderItemsExpanded } from '@/features/orders/components/order-items-expanded/order-items-expanded';
import { formatDate, formatCurrency } from '@/utils/format';
import shared from '@/styles/shared.module.css';
import type { OrderWithItems } from '@/types/api';

type EditBatchOrderRowProps = {
	order: OrderWithItems;
	isSelected: boolean;
	isExpanded: boolean;
	onToggle: (orderId: string) => void;
	onExpand: (orderId: string) => void;
};

export const EditBatchOrderRow = ({
	order,
	isSelected,
	isExpanded,
	onToggle,
	onExpand,
}: EditBatchOrderRowProps) => (
	<Fragment>
		<Table.Row className="cursor-pointer" onClick={() => onToggle(order.id)}>
			<Table.Cell>
				<Checkbox checked={isSelected} onCheckedChange={() => onToggle(order.id)} />
			</Table.Cell>
			<Table.Cell>{order.order_number}</Table.Cell>
			<Table.Cell>{order.customer_name}</Table.Cell>
			<Table.Cell>{formatDate(order.order_date)}</Table.Cell>
			<Table.Cell>{order.due_date ? formatDate(order.due_date) : '—'}</Table.Cell>
			<Table.Cell className="text-center">{order.item_count}</Table.Cell>
			<Table.Cell className="text-end">{formatCurrency(order.grand_total)}</Table.Cell>
			<Table.Cell>
				<button
					type="button"
					className="cursor-pointer p-1 rounded hover:bg-[var(--color-bg-muted)]"
					onClick={(e) => {
						e.stopPropagation();
						onExpand(order.id);
					}}>
					<ChevronDownIcon
						size={16}
						className={cn(shared.expandIcon, isExpanded && shared.expandIconOpen)}
					/>
				</button>
			</Table.Cell>
		</Table.Row>
		{isExpanded && <OrderItemsExpanded items={order.items} colSpan={8} />}
	</Fragment>
);
