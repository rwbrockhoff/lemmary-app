import { Table } from '@artifact-ui/core';
import type { LinearEntry } from '@/types/api';

type LinearTableProps = {
	items: LinearEntry[];
};

export const LinearTable = ({ items }: LinearTableProps) => {
	return (
		<Table.Root variant="surface" size="2" highlight>
			<Table.Header>
				<Table.Row>
					<Table.HeaderCell>Material</Table.HeaderCell>
					<Table.HeaderCell textAlign="center">Width</Table.HeaderCell>
					<Table.HeaderCell textAlign="center">Total (ft)</Table.HeaderCell>
					<Table.HeaderCell textAlign="center">Order (ft)</Table.HeaderCell>
					<Table.HeaderCell textAlign="center">Order (yds)</Table.HeaderCell>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{items.map((item, index) => (
					<Table.Row key={`${item.material_type}-${item.width}-${index}`}>
						<Table.Cell>{item.material_type}</Table.Cell>
						<Table.Cell textAlign="center">
							{item.width ? `${item.width}"` : '—'}
						</Table.Cell>
						<Table.Cell textAlign="center">{item.total_feet}</Table.Cell>
						<Table.Cell textAlign="center">{item.feet_to_order}</Table.Cell>
						<Table.Cell textAlign="center">
							{Math.ceil(item.feet_to_order / 3)}
						</Table.Cell>
					</Table.Row>
				))}
			</Table.Body>
		</Table.Root>
	);
};
