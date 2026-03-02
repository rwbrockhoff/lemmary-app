import { Heading, Text, Card, Grid } from '@artifact-ui/core';
import { formatCurrency } from '@/utils/format';
import type { Order } from '@/types/api';

type OrdersSummaryProps = {
	orders: Order[];
};

export const OrdersSummary = ({ orders }: OrdersSummaryProps) => {
	const totalItems = orders.reduce((sum, o) => sum + o.item_count, 0);
	const totalRevenue = orders.reduce(
		(sum, o) => sum + Number(o.grand_total ?? 0),
		0,
	);

	return (
		<Grid columns={3} gap="4" className="mb-6">
			<Card.Root size="1">
				<Card.Body>
					<Text color="secondary" size="2">
						Open Orders
					</Text>
					<Heading size="5">{orders.length}</Heading>
				</Card.Body>
			</Card.Root>
			<Card.Root size="1">
				<Card.Body>
					<Text color="secondary" size="2">
						Total Items
					</Text>
					<Heading size="5">{totalItems}</Heading>
				</Card.Body>
			</Card.Root>
			<Card.Root size="1">
				<Card.Body>
					<Text color="secondary" size="2">
						Revenue
					</Text>
					<Heading size="5">
						{formatCurrency(String(totalRevenue))}
					</Heading>
				</Card.Body>
			</Card.Root>
		</Grid>
	);
};
