import { Stack } from '@artifact-ui/core';
import { PageSpinner } from '@/components/page-spinner';
import { LoadingWrapper } from '@/components/loading-wrapper/loading-wrapper';
import { ErrorState } from '@/components/error-state/error-state';
import { useOrderStages } from '@/features/workflow/api/workflow-queries';
import { WorkflowStagesCard } from './workflow-stages-card';

export const WorkflowSettingsTab = () => {
	const { data: stages, isLoading, error } = useOrderStages();

	return (
		<Stack gap="6" className="max-w-2xl">
			<LoadingWrapper
				isLoading={isLoading}
				skeleton={<PageSpinner />}
				isError={!!error}
				errorState={<ErrorState description="Failed to load workflow stages." />}>
				{stages && <WorkflowStagesCard stages={stages} />}
			</LoadingWrapper>
		</Stack>
	);
};
