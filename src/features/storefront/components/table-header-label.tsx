import type { ReactNode } from 'react';
import { Table, Text } from '@artifact-ui/core';

type TableHeaderLabelProps = {
	children: ReactNode;
};

export const TableHeaderLabel = ({ children }: TableHeaderLabelProps) => (
	<Table.HeaderCell>
		<Text size="2" weight="medium" color="secondary" className="pl-2">
			{children}
		</Text>
	</Table.HeaderCell>
);
