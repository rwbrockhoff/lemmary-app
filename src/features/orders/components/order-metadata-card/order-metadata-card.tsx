import { useState } from 'react';
import { Text, Card, TextArea, Button, Stack, Flex } from '@artifact-ui/core';
import { useUpdateOrderNotes } from '../../api/orders-queries';
import { formatDate, formatCurrency } from '@/utils/format';
import type { OrderDetail } from '@/types/api';
import styles from './order-metadata-card.module.css';

type OrderMetadataCardProps = {
	order: OrderDetail;
};

export const OrderMetadataCard = ({ order }: OrderMetadataCardProps) => {
	const [notes, setNotes] = useState(order.order_notes ?? '');
	const updateNotes = useUpdateOrderNotes(order.id);
	const hasNotesChanged = notes !== (order.order_notes ?? '');

	return (
		<Card.Root className="mb-6">
			<Card.Body className={styles.metadataGrid}>
				<Stack gap="3">
					<MetadataRow label="Date" value={formatDate(order.order_date)} />
					{order.due_date && (
						<MetadataRow label="Due" value={formatDate(order.due_date)} />
					)}
					<MetadataRow label="Total" value={formatCurrency(order.grand_total)} />
					{order.shipping_method && (
						<MetadataRow label="Shipping" value={order.shipping_method} />
					)}
					{order.order_url && (
						<Flex gap="4">
							<Text size="2" color="secondary" className={styles.label}>Order Page</Text>
							<a href={order.order_url} target="_blank" rel="noopener noreferrer" className={styles.link}>
								View on Squarespace
							</a>
						</Flex>
					)}
				</Stack>
				<Stack>
					<Text size="2" color="secondary" className="mb-1">Notes</Text>
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
							onClick={() => updateNotes.mutate(notes)}
						>
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
};

const MetadataRow = ({ label, value }: MetadataRowProps) => (
	<Flex gap="4">
		<Text size="2" color="secondary" className={styles.label}>{label}</Text>
		<Text size="2">{value}</Text>
	</Flex>
);
