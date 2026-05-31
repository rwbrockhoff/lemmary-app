import type { ReactNode } from 'react';
import { Card, Heading, Flex } from '@artifact-ui/core';
import { ChartPlaceholder } from '@/components/chart-placeholder/chart-placeholder';
import { DeltaIndicator } from '@/components/delta-indicator/delta-indicator';
import styles from './kpi-bar-card.module.css';

type KpiBarCardProps = {
	title: string;
	icon: ReactNode;
	percentage: number;
	label: string;
	delta: number;
	barColor: string;
	footer?: ReactNode;
	isEmpty: boolean;
	emptyMessage: string;
	emptySubtext: string;
};

export const KpiBarCard = ({
	title,
	icon,
	percentage,
	label,
	delta,
	barColor,
	footer,
	isEmpty,
	emptyMessage,
	emptySubtext,
}: KpiBarCardProps) => {
	if (isEmpty) {
		return (
			<Card.Root>
				<div className={styles.container}>
					<Flex align="center" gap="2" className={styles.heading}>
						{icon}
						<Heading size="5">{title}</Heading>
					</Flex>
					<ChartPlaceholder message={emptyMessage} subtext={emptySubtext} />
				</div>
			</Card.Root>
		);
	}

	const topPct = 100 - percentage;

	return (
		<Card.Root>
			<div className={styles.container}>
				<Flex align="center" gap="2" className={styles.heading}>
					{icon}
					<Heading size="5">{title}</Heading>
				</Flex>
				<div className={styles.body}>
					<div className={styles.bar}>
						<div className={styles.barTop} style={{ height: `${topPct}%` }} />
						<div
							className={styles.barBottom}
							style={{ height: `${percentage}%`, background: barColor }}
						/>
					</div>
					<div className={styles.stats}>
						<div className={styles.bigNumber}>{percentage}%</div>
						<div className={styles.label}>{label}</div>
						<div className={styles.deltaSlot}>
							<DeltaIndicator delta={delta} suffix="" />
						</div>
					</div>
				</div>
				{footer && <div className={styles.footer}>{footer}</div>}
			</div>
		</Card.Root>
	);
};
