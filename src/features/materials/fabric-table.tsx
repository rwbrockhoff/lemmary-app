import { Table } from '@artifact-ui/core';
import type { FabricEntry } from '@/types/api';

type FabricTableProps = {
	items: FabricEntry[];
};

export const FabricTable = ({ items }: FabricTableProps) => {
	return (
		<Table.Root variant="surface" size="2" highlight>
			<Table.Header>
				<Table.Row>
					<Table.HeaderCell>Product</Table.HeaderCell>
					<Table.HeaderCell>Piece</Table.HeaderCell>
					<Table.HeaderCell>Color</Table.HeaderCell>
					<Table.HeaderCell textAlign="center">Qty</Table.HeaderCell>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{items.map((item, index) => (
					<Table.Row key={`${item.product_name}-${item.piece}-${item.color}-${index}`}>
						<Table.Cell>{item.product_name}</Table.Cell>
						<Table.Cell>{item.piece}</Table.Cell>
						<Table.Cell>{item.color || '—'}</Table.Cell>
						<Table.Cell textAlign="center">{item.total_quantity}</Table.Cell>
					</Table.Row>
				))}
			</Table.Body>
		</Table.Root>
	);
};
