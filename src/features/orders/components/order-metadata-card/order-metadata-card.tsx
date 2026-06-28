import { useState, type ReactNode } from 'react';
import { Text, Card, TextArea, Button, Stack, Flex, DatePicker } from '@artifact-ui/core';
import { useUpdateOrderNotes, useUpdateOrderDates } from '../../api/orders-queries';
import { CustomerMetadataRow } from '@/features/customers/components/customer-metadata-row';
import { OrderTypeBadge } from '../order-type-badge';
import { useToast } from '@/providers/toast-context';
import { formatCurrency } from '@/utils/format';
import { parseDateValue, formatDateValue, toZonedDateValue } from '@/utils/date';
import { useStore } from '@/features/settings/api/store-queries';
import { DEFAULT_TIMEZONE } from '@/utils/timezones';
import type { OrderDetail } from '@/types/api';
import styles from './order-metadata-card.module.css';

type OrderMetadataCardProps = {
	order: OrderDetail;
};

export const OrderMetadataCard = ({ order }: OrderMetadataCardProps) => {
	const [notes, setNotes] = useState(order.order_notes ?? '');
	const updateNotes = useUpdateOrderNotes(order.id);
	const updateDates = useUpdateOrderDates(order.id);
	const { data: store } = useStore();
	const toast = useToast();

	const hasNotesChanged = notes !== (order.order_notes ?? '');
	const isWork = order.order_type === 'work';

	const handleSaveNotes = () => {
		updateNotes.mutate(notes, {
			onSuccess: () => toast.success('Notes saved'),
			onError: (error) => toast.error(error.message, 'Could not save notes'),
		});
	};

	const handleOrderDateChange = (date: Date | undefined) => {
		if (!date) return;
		updateDates.mutate(
			{ order_date: formatDateValue(date) },
			{
				onSuccess: () => toast.success('Order date updated'),
				onError: (error) => toast.error(error.message, 'Could not update order date'),
			},
		);
	};

	const handleDueDateChange = (date: Date | undefined) => {
		updateDates.mutate(
			{ due_date: date ? formatDateValue(date) : null },
			{
				onSuccess: () => toast.success('Due date updated'),
				onError: (error) => toast.error(error.message, 'Could not update due date'),
			},
		);
	};

	return (
		<Card.Root className="mb-6">
			<Card.Body className={styles.metadataGrid}>
				<Stack gap="3">
					{!isWork && (
						<CustomerMetadataRow
							name={order.customer_name}
							email={order.customer_email}
							tier={order.customer_tier}
							fromOrderId={order.id}
							trailing={<OrderTypeBadge orderType={order.order_type} />}
						/>
					)}
					{isWork && (
						<MetadataRow
							label="Title"
							value={order.order_title ?? '—'}
							trailing={<OrderTypeBadge orderType={order.order_type} />}
						/>
					)}
					{isWork && order.order_description && (
						<MetadataRow label="Description" value={order.order_description} />
					)}
					<Flex gap="4" align="center">
						<Text size="2" color="secondary" className={styles.label}>
							Date
						</Text>
						<DatePicker
							selected={parseDateValue(
								toZonedDateValue(order.order_date, store?.timezone ?? DEFAULT_TIMEZONE),
							)}
							onSelect={handleOrderDateChange}
							disabled={order.order_type === 'platform'}
							placeholder="Set order date"
							size="1"
							className={styles.subtleDisabled}
						/>
					</Flex>
					<Flex gap="4" align="center">
						<Text size="2" color="secondary" className={styles.label}>
							Due
						</Text>
						<DatePicker
							selected={parseDateValue(order.due_date ?? undefined)}
							onSelect={handleDueDateChange}
							placeholder="Set due date"
							size="1"
						/>
					</Flex>
					{!isWork && (
						<MetadataRow label="Total" value={formatCurrency(order.grand_total)} />
					)}
					{order.shipping_method && (
						<MetadataRow label="Shipping" value={order.shipping_method} />
					)}
					{order.order_url && (
						<Flex gap="4">
							<Text size="2" color="secondary" className={styles.label}>
								Order Page
							</Text>
							<a
								href={order.order_url}
								target="_blank"
								rel="noopener noreferrer"
								className={styles.link}>
								View on Your Store
							</a>
						</Flex>
					)}
				</Stack>
				<Stack>
					<Text size="2" color="secondary" className="mb-1">
						Notes
					</Text>
					<TextArea.Standalone
						value={notes}
						onChange={(e) => setNotes(e.target.value)}
						placeholder="Add notes..."
						rows={4}
						className="flex-1"
					/>
					{hasNotesChanged && (
						<Button
							variant="default"
							size="1"
							className="mt-2 self-start"
							onClick={handleSaveNotes}>
							Save Notes
						</Button>
					)}
				</Stack>
			</Card.Body>
		</Card.Root>
	);
};

type MetadataRowProps = {
	label: string;
	value: string;
	trailing?: ReactNode;
};

const MetadataRow = ({ label, value, trailing }: MetadataRowProps) => (
	<Flex gap="4" align="center">
		<Text size="2" color="secondary" className={styles.label}>
			{label}
		</Text>
		<Text size="2">{value}</Text>
		{trailing}
	</Flex>
);
