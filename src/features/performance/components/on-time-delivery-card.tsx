import { ClockIcon } from '@/components/icons';
import { KpiBarCard } from '@/components/kpi-bar-card/kpi-bar-card';
import type { OnTimeDelivery } from '../api/performance-queries';

type OnTimeDeliveryCardProps = {
	delivery: OnTimeDelivery | null;
};

export const OnTimeDeliveryCard = ({ delivery }: OnTimeDeliveryCardProps) => {
	const onTimeCount = delivery?.onTimeCount ?? 0;
	const totalCount = delivery?.totalCount ?? 0;
	const priorOnTimeCount = delivery?.priorOnTimeCount ?? 0;
	const priorTotalCount = delivery?.priorTotalCount ?? 0;

	const onTimePct = totalCount > 0 ? Math.round((onTimeCount / totalCount) * 100) : 0;
	const priorPct =
		priorTotalCount > 0 ? Math.round((priorOnTimeCount / priorTotalCount) * 100) : null;
	const delta = priorPct !== null ? onTimePct - priorPct : 0;

	return (
		<KpiBarCard
			title="On-Time Rate"
			icon={<ClockIcon size={18} />}
			percentage={onTimePct}
			label="Orders shipped on time"
			delta={delta}
			barColor="var(--wf-stage-color-sage)"
			footer={`${onTimeCount} of ${totalCount} fulfilled`}
			isEmpty={delivery === null}
			emptyMessage="Not enough fulfilled orders yet"
			emptySubtext="On-time rates appear as orders ship out."
		/>
	);
};
