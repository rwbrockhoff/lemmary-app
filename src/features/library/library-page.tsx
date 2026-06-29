import { useState } from 'react';
import { Heading, Text, Stack, Flex, Button } from '@artifact-ui/core';
import { LibraryIcon, PlusIcon } from '@/components/icons';
import { PageSpinner } from '@/components/page-spinner';
import { LoadingWrapper } from '@/components/loading-wrapper/loading-wrapper';
import { ErrorState } from '@/components/error-state/error-state';
import { useMaterials } from './library-queries';
import { LibraryTable } from './library-table';
import shared from '@/styles/shared.module.css';

const LibraryPage = () => {
	const { data: materials, isLoading, error } = useMaterials();
	const [isAdding, setIsAdding] = useState(false);

	return (
		<div className={shared.pageContainer}>
			<Stack gap="6">
				<Flex justify="between" align="center">
					<Stack gap="1">
						<Heading size="6" iconLeft={<LibraryIcon size={20} />}>
							Library
						</Heading>
						<Text size="2" color="tertiary">
							Saved materials and components from your bill of materials
						</Text>
					</Stack>
					<Button
						onClick={() => setIsAdding(true)}
						disabled={isAdding}
						iconLeft={<PlusIcon size={16} />}>
						Add material
					</Button>
				</Flex>

				<LoadingWrapper
					isLoading={isLoading}
					skeleton={<PageSpinner />}
					isError={!!error}
					isEmpty={materials?.length === 0 && !isAdding}
					emptyState={<Text color="secondary">No materials saved yet.</Text>}
					errorState={<ErrorState description="Failed to load materials." />}>
					{materials && (
						<LibraryTable
							items={materials}
							isAdding={isAdding}
							onCloseDraft={() => setIsAdding(false)}
						/>
					)}
				</LoadingWrapper>
			</Stack>
		</div>
	);
};

export default LibraryPage;
