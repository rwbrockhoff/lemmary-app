import { Heading, Text, Card, Stack } from '@artifact-ui/core';

type StatCardProps = {
	label: string;
	value: string | number;
};

export const StatCard = ({ label, value }: StatCardProps) => (
	<Card.Root size="1">
		<Card.Body>
			<Stack gap="1">
				<Text color="secondary" size="2">
					{label}
				</Text>
				<Heading size="5" color="accent">
					{value}
				</Heading>
			</Stack>
		</Card.Body>
	</Card.Root>
);
