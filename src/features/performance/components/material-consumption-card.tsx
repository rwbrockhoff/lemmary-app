import { Card, Heading, Text, Flex } from '@artifact-ui/core';
import { ScissorsIcon } from '@/components/icons';
import { ChartPlaceholder } from '@/components/chart-placeholder/chart-placeholder';
import { MagnitudeIndicator } from '@/components/magnitude-indicator/magnitude-indicator';
import type { MaterialConsumptionEntry } from '../api/performance-queries';
import styles from './material-consumption-card.module.css';

type MaterialConsumptionCardProps = {
	materials: MaterialConsumptionEntry[];
	className?: string;
};

const formatQuantity = (qty: number, measurement: 'linear' | 'area' | 'count') => {
	if (measurement === 'linear') {
		const feet = Math.round(qty / 12);
		return `${feet} ft`;
	}
	if (measurement === 'area') {
		return `${Math.round(qty)} cuts`;
	}
	return `${Math.round(qty)} pc`;
};

const formatName = (entry: MaterialConsumptionEntry) => {
	if (entry.color) return `${entry.materialType} (${entry.color})`;
	return entry.materialType;
};

const getDelta = (current: number, prior: number) => {
	if (prior === 0) return 0;
	return Math.round(((current - prior) / (prior + 1)) * 100);
};

export const MaterialConsumptionCard = ({
	materials,
	className,
}: MaterialConsumptionCardProps) => {
	return (
		<Card.Root className={className}>
			<div className={styles.container}>
				<Flex align="center" gap="2" className={styles.heading}>
					<ScissorsIcon size={18} />
					<Heading size="5">Material Consumption</Heading>
				</Flex>
				<Text className={styles.subtitle} size="2">
					Top material trends this period
				</Text>
				{materials.length === 0 ? (
					<ChartPlaceholder
						message="No material trends yet"
						subtext="Material trends appear as more orders come in."
					/>
				) : (
					<div className={styles.list}>
						{materials.map((m, i) => (
							<div key={`${m.materialType}-${m.color ?? ''}-${i}`} className={styles.row}>
								<div className={styles.name}>{formatName(m)}</div>
								<div className={styles.quantity}>
									{formatQuantity(m.currentQty, m.measurement)}
								</div>
								<div className={styles.delta}>
									<MagnitudeIndicator delta={getDelta(m.currentQty, m.priorQty)} />
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</Card.Root>
	);
};
