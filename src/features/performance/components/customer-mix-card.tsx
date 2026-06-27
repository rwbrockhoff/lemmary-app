import { CustomersIcon } from '@/components/icons';
import { KpiBarCard } from '@/components/kpi-bar-card/kpi-bar-card';
import type { CustomerMix } from '../api/performance-queries';

type CustomerMixCardProps = {
	mix: CustomerMix | null;
};

export const CustomerMixCard = ({ mix }: CustomerMixCardProps) => {
	const returningCount = mix?.returningCount ?? 0;
	const totalCount = mix?.totalCount ?? 0;
	const priorReturningCount = mix?.priorReturningCount ?? 0;
	const priorTotalCount = mix?.priorTotalCount ?? 0;

	const returningPct =
		totalCount > 0 ? Math.round((returningCount / totalCount) * 100) : 0;
	const priorReturningPct =
		priorTotalCount > 0
			? Math.round((priorReturningCount / priorTotalCount) * 100)
			: null;
	const delta = priorReturningPct !== null ? returningPct - priorReturningPct : 0;

	return (
		<KpiBarCard
			title="Customer Mix"
			icon={<CustomersIcon size={18} />}
			percentage={returningPct}
			label="Returning customers"
			delta={delta}
			barColor="var(--wf-stage-color-cobalt)"
			footer={`${returningCount} of ${totalCount} returning`}
			isEmpty={mix === null}
			emptyMessage="Not enough customer data yet"
			emptySubtext="Returning vs new mix appears as orders come in."
		/>
	);
};
