import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Heading, Text, Button, Table, Checkbox } from '@artifact-ui/core';
import { useOrders } from '@/features/orders/orders-queries';
import { useCreateBatch } from './batches-queries';
import { formatDate, formatCurrency } from '@/utils/format';

const CreateBatchPage = () => {
	const navigate = useNavigate();
	const { data: orders, isLoading } = useOrders();
	const createBatch = useCreateBatch();

	const [name, setName] = useState('');
	const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(
		new Set(),
	);

	const pendingOrders = orders?.filter(
		(o) => o.fulfillment_status === 'pending',
	);

	const toggleOrder = (orderId: string) => {
		setSelectedOrderIds((prev) => {
			const next = new Set(prev);
			if (next.has(orderId)) {
				next.delete(orderId);
			} else {
				next.add(orderId);
			}
			return next;
		});
	};

	const handleCreate = async () => {
		if (!name.trim() || selectedOrderIds.size === 0) return;

		await createBatch.mutateAsync({
			name: name.trim(),
			orderIds: [...selectedOrderIds],
		});

		navigate('/batches');
	};

	return (
		<div className="p-8 max-w-5xl mx-auto">
			<div className="flex items-center justify-between mb-6">
				<Heading size="6">New Batch</Heading>
				<div className="flex items-center gap-3">
					<Button variant="outline" onClick={() => navigate('/batches')}>
						Cancel
					</Button>
					<Button
						onClick={handleCreate}
						disabled={
							!name.trim() ||
							selectedOrderIds.size === 0 ||
							createBatch.isPending
						}
					>
						{createBatch.isPending ? 'Creating...' : 'Create Batch'}
					</Button>
				</div>
			</div>

			<div className="mb-6">
				<label className="block mb-2">
					<Text weight="medium">Batch Name</Text>
				</label>
				<input
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="e.g. Week of Feb 24"
					className="w-full max-w-sm px-3 py-2 border rounded-md"
				/>
			</div>

			<div className="mb-4">
				<Text weight="medium">
					Select Orders ({selectedOrderIds.size} selected)
				</Text>
			</div>

			{isLoading && <Text color="secondary">Loading orders...</Text>}

			{pendingOrders && pendingOrders.length === 0 && (
				<Text color="secondary">No pending orders available.</Text>
			)}

			{pendingOrders && pendingOrders.length > 0 && (
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell className="w-10" />
							<Table.HeaderCell className="w-24">Order #</Table.HeaderCell>
							<Table.HeaderCell>Customer</Table.HeaderCell>
							<Table.HeaderCell>Date</Table.HeaderCell>
							<Table.HeaderCell>Items</Table.HeaderCell>
							<Table.HeaderCell className="text-end">Total</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{pendingOrders.map((order) => (
							<Table.Row
								key={order.id}
								className="cursor-pointer"
								onClick={() => toggleOrder(order.id)}
							>
								<Table.Cell>
									<Checkbox
										checked={selectedOrderIds.has(order.id)}
										onCheckedChange={() => toggleOrder(order.id)}
									/>
								</Table.Cell>
								<Table.Cell>{order.order_number}</Table.Cell>
								<Table.Cell>{order.customer_name}</Table.Cell>
								<Table.Cell>{formatDate(order.order_date)}</Table.Cell>
								<Table.Cell className="text-center">
									{order.item_count}
								</Table.Cell>
								<Table.Cell className="text-end">
									{formatCurrency(order.grand_total)}
								</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
				</Table.Root>
			)}
		</div>
	);
};

export default CreateBatchPage;
