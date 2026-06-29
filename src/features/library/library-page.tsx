import { Heading, Text, Stack } from '@artifact-ui/core';
import { LibraryIcon } from '@/components/icons';
import { PageSpinner } from '@/components/page-spinner';
import { LoadingWrapper } from '@/components/loading-wrapper/loading-wrapper';
import { ErrorState } from '@/components/error-state/error-state';
import { useMaterials } from './library-queries';
import { LibraryTable } from './library-table';
import shared from '@/styles/shared.module.css';

const LibraryPage = () => {
	const { data: materials, isLoading, error } = useMaterials();

	return (
		<div className={shared.pageContainer}>
			<Stack gap="6">
				<Stack gap="1">
					<Heading size="6" iconLeft={<LibraryIcon size={20} />}>
						Library
					</Heading>
					<Text size="2" color="tertiary">
						Saved materials and components from your bill of materials
					</Text>
				</Stack>

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

export default LibraryPage;
