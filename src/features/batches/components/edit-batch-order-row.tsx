import { Fragment } from 'react';
import { Table, Checkbox, IconButton, Flex, cn } from '@artifact-ui/core';
import { ChevronDownIcon } from '@/components/icons/icons';
import { LockIcon } from '@/components/icons';
import { OrderItemsExpanded } from '@/features/orders/components/order-items-expanded/order-items-expanded';
import { OrderNumberLabel } from '@/components/orders/order-number-label';
import { formatDate, formatCurrency } from '@/utils/format';
import { useFormatDateTz } from '@/hooks/use-format-date-tz';
import { getOrderDisplayName } from '@/utils/orders';
import shared from '@/styles/shared.module.css';
import type { OrderWithItems } from '@/types/api';

type EditBatchOrderRowProps = {
	order: OrderWithItems;
	isSelected: boolean;
	isExpanded: boolean;
	locked?: boolean;
	onToggle: (orderId: string) => void;
	onExpand: (orderId: string) => void;
};

export const EditBatchOrderRow = ({
	order,
	isSelected,
	isExpanded,
	locked = false,
	onToggle,
	onExpand,
}: EditBatchOrderRowProps) => {
	const formatTz = useFormatDateTz();
	return (
		<Fragment>
			<Table.Row
				className={locked ? undefined : 'cursor-pointer'}
				style={locked ? { opacity: 0.6 } : undefined}
				onClick={locked ? undefined : () => onToggle(order.id)}>
				<Table.Cell>
					<Checkbox
						checked={isSelected}
						disabled={locked}
						onCheckedChange={locked ? undefined : () => onToggle(order.id)}
					/>
				</Table.Cell>
				<Table.Cell>
					<Flex align="center" gap="1">
						<OrderNumberLabel
							orderNumber={order.order_number}
							orderType={order.order_type}
						/>
						{locked && <LockIcon size={12} />}
					</Flex>
				</Table.Cell>
				<Table.Cell className="truncate max-w-0">{getOrderDisplayName(order)}</Table.Cell>
				<Table.Cell>{formatTz(order.order_date)}</Table.Cell>
				<Table.Cell>{order.due_date ? formatDate(order.due_date) : '—'}</Table.Cell>
				<Table.Cell className="text-center">{order.item_count}</Table.Cell>
				<Table.Cell className="text-end">{formatCurrency(order.grand_total)}</Table.Cell>
				<Table.Cell>
					<IconButton
						icon={
							<ChevronDownIcon
								size={16}
								className={cn(shared.expandIcon, isExpanded && shared.expandIconOpen)}
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
			{isExpanded && <OrderItemsExpanded items={order.items} colSpan={8} />}
		</Fragment>
	);
};
