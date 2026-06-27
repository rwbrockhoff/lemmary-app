import { Card, Text } from '@artifact-ui/core';
import styles from './kpi-card.module.css';

type KpiCardProps = {
	label: string;
	value: string;
	delta?: number;
	footer?: string;
};

const formatDelta = (delta: number) => {
	if (delta >= 1000) return '+999%+';
	const sign = delta > 0 ? '+' : '';
	return `${sign}${delta.toFixed(1)}%`;
};

const deltaColorVar = (delta: number) => {
	if (delta === 0) return 'var(--color-text-muted)';
	return delta > 0 ? 'var(--color-success)' : 'var(--color-error)';
};

export const KpiCard = ({ label, value, delta, footer }: KpiCardProps) => {
	return (
		<Card.Root>
			<div className={styles.card}>
				<div className={styles.cardContent}>
					<Text size="2" color="secondary" weight="medium">
						{label}
					</Text>
					<Text size="7" weight="bold" color="accent">
						{value}
					</Text>
					{delta !== undefined && (
						<Text size="2" style={{ color: deltaColorVar(delta) }}>
							{formatDelta(delta)}
						</Text>
					)}
				</div>
				{footer && <div className={styles.footer}>{footer}</div>}
			</div>
		</Card.Root>
	);
};
