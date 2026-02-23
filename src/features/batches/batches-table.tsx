import { useNavigate } from 'react-router';
import { Table, Badge, Text } from '@artifact-ui/core';
import { formatDate } from '@/utils/format';
import type { Batch } from '@/types/api';

type BatchesTableProps = {
	batches: Batch[];
};

export const BatchesTable = ({ batches }: BatchesTableProps) => {
	const navigate = useNavigate();

	return (
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.HeaderCell>Name</Table.HeaderCell>
					<Table.HeaderCell>Orders</Table.HeaderCell>
					<Table.HeaderCell>Progress</Table.HeaderCell>
					<Table.HeaderCell>Status</Table.HeaderCell>
					<Table.HeaderCell>Created</Table.HeaderCell>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{batches.map((batch) => (
					<Table.Row
						key={batch.id}
						className="cursor-pointer"
						onClick={() => navigate(`/batches/${batch.id}`)}
					>
						<Table.Cell>
							<Text weight="medium">{batch.name}</Text>
						</Table.Cell>
						<Table.Cell>{batch.order_count}</Table.Cell>
						<Table.Cell>
							{batch.items_completed}/{batch.item_count} items
						</Table.Cell>
						<Table.Cell>
							<Badge
								size="1"
								variant="soft"
								color={batch.status === 'completed' ? 'success' : 'info'}
							>
								{batch.status}
							</Badge>
						</Table.Cell>
						<Table.Cell>{formatDate(batch.created_at)}</Table.Cell>
					</Table.Row>
				))}
			</Table.Body>
		</Table.Root>
	);
};
