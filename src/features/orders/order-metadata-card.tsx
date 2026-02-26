import { useState } from 'react';
import { Text, Card, TextArea, Button } from '@artifact-ui/core';
import { useUpdateOrderNotes } from './orders-queries';
import { formatDate, formatCurrency } from '@/utils/format';
import type { OrderDetail } from '@/types/api';

type OrderMetadataCardProps = {
	order: OrderDetail;
};

export const OrderMetadataCard = ({ order }: OrderMetadataCardProps) => {
	const [notes, setNotes] = useState(order.order_notes ?? '');
	const updateNotes = useUpdateOrderNotes(order.id);
	const hasNotesChanged = notes !== (order.order_notes ?? '');

	return (
		<Card.Root className="mb-6">
			<Card.Body className="grid grid-cols-2 gap-6">
				<div className="flex flex-col gap-3">
					<MetadataRow label="Date" value={formatDate(order.order_date)} />
					<MetadataRow label="Total" value={formatCurrency(order.grand_total)} />
					{order.shipping_method && (
						<MetadataRow label="Shipping" value={order.shipping_method} />
					)}
					{order.order_url && (
						<div className="flex gap-4">
							<Text size="2" color="secondary" className="w-20 shrink-0">Order Page</Text>
							<a href={order.order_url} target="_blank" rel="noopener noreferrer" className="text-sm underline opacity-80 hover:opacity-100">
								View on Squarespace
							</a>
						</div>
					)}
				</div>
				<div className="flex flex-col">
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
				</div>
			</Card.Body>
		</Card.Root>
	);
};

type MetadataRowProps = {
	label: string;
	value: string;
};

const MetadataRow = ({ label, value }: MetadataRowProps) => (
	<div className="flex gap-4">
		<Text size="2" color="secondary" className="w-20 shrink-0">{label}</Text>
		<Text size="2">{value}</Text>
	</div>
);
