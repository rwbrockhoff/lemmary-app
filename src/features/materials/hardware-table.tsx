import { Table } from '@artifact-ui/core';
import type { HardwareEntry } from '@/types/api';

type HardwareTableProps = {
	items: HardwareEntry[];
};

export const HardwareTable = ({ items }: HardwareTableProps) => {
	return (
		<Table.Root variant="surface" size="2" highlight>
			<Table.Header>
				<Table.Row>
					<Table.HeaderCell>Piece</Table.HeaderCell>
					<Table.HeaderCell textAlign="center">Qty</Table.HeaderCell>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{items.map((item, index) => (
					<Table.Row key={`${item.piece}-${index}`}>
						<Table.Cell>{item.piece}</Table.Cell>
						<Table.Cell textAlign="center">{item.total_count}</Table.Cell>
					</Table.Row>
				))}
			</Table.Body>
		</Table.Root>
	);
};
