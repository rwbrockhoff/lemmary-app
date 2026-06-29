import { Heading, Text, Stack } from '@artifact-ui/core';
import { MaterialsIcon } from '@/components/icons';
import { PageSpinner } from '@/components/page-spinner';
import { LoadingWrapper } from '@/components/loading-wrapper/loading-wrapper';
import { ErrorState } from '@/components/error-state/error-state';
import { useMaterials } from './materials-queries';
import { LibraryTable } from './library-table';
import shared from '@/styles/shared.module.css';

const MaterialsPage = () => {
	const { data: materials, isLoading, error } = useMaterials();

	return (
		<div className={shared.pageContainer}>
			<Stack gap="6">
				<Heading size="6" iconLeft={<MaterialsIcon size={20} />}>
					Materials
				</Heading>

				<LoadingWrapper
					isLoading={isLoading}
					skeleton={<PageSpinner />}
					isError={!!error}
					isEmpty={materials?.length === 0}
					emptyState={<Text color="secondary">No materials saved yet.</Text>}
					errorState={<ErrorState description="Failed to load materials." />}>
					{materials && <LibraryTable items={materials} />}
				</LoadingWrapper>
			</Stack>
		</div>
	);
};

export default MaterialsPage;
