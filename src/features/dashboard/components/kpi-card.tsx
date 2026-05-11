import { Card, Text } from '@artifact-ui/core';
import styles from './kpi-card.module.css';

type KpiCardProps = {
	label: string;
	value: string;
	delta?: number;
	subtitle?: string;
};

const formatDelta = (delta: number) => {
	const sign = delta > 0 ? '+' : '';
	return `${sign}${delta.toFixed(1)}%`;
};

export const KpiCard = ({ label, value, delta, subtitle }: KpiCardProps) => {
	const deltaColor =
		delta === undefined || delta === 0 ? 'tertiary' : delta > 0 ? 'info' : 'danger';

	return (
		<Card.Root>
			<div className={styles.card}>
				<Text size="2" color="secondary" weight="medium">
					{label}
				</Text>
				<Text size="7" weight="bold" color="accent">
					{value}
				</Text>
				{delta !== undefined && (
					<Text size="2" color={deltaColor}>
						{formatDelta(delta)} vs last month
					</Text>
				)}
				{subtitle && (
					<Text size="1" color="tertiary">
						{subtitle}
					</Text>
				)}
			</div>
		</Card.Root>
	);
};
