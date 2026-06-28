import type { ReactNode } from 'react';
import { Heading, Text, Badge, Tabs, Stack } from '@artifact-ui/core';
import { MaterialsIcon } from '@/components/icons';
import { PageSpinner } from '@/components/page-spinner';
import { LoadingWrapper } from '@/components/loading-wrapper/loading-wrapper';
import { ErrorState } from '@/components/error-state/error-state';
import { useMaterialsReport, useMaterials } from './materials-queries';
import { FabricTable } from './fabric-table';
import { LinearTable } from './linear-table';
import { HardwareTable } from './hardware-table';
import { MismatchesTable } from './mismatches-table';
import { LibraryTable } from './library-table';
import shared from '@/styles/shared.module.css';

const MaterialsPage = () => {
	const { data: report, isLoading, error } = useMaterialsReport();
	const {
		data: materials,
		isLoading: materialsLoading,
		error: materialsError,
	} = useMaterials();

	const reportTab = (content: ReactNode) => (
		<LoadingWrapper
			isLoading={isLoading}
			skeleton={<PageSpinner />}
			isError={!!error}
			errorState={<ErrorState description="Failed to load materials report." />}>
			{content}
		</LoadingWrapper>
	);

	return (
		<div className={shared.pageContainer}>
			<Stack gap="6">
				<Heading size="6" iconLeft={<MaterialsIcon size={20} />}>
					Materials
				</Heading>

				<Tabs.Root defaultValue="fabric">
					<Tabs.List>
						<Tabs.Trigger value="fabric">
							Fabric ({report?.fabric.length ?? 0})
						</Tabs.Trigger>
						<Tabs.Trigger value="linear">
							Linear ({report?.linear.length ?? 0})
						</Tabs.Trigger>
						<Tabs.Trigger value="hardware">
							Hardware ({report?.hardware.length ?? 0})
						</Tabs.Trigger>

						{report && report.mismatches.length > 0 && (
							<Tabs.Trigger value="mismatches">
								<span className="flex items-center gap-2">
									Mismatches
									<Badge variant="soft" color="danger" size="1">
										{report.mismatches.length}
									</Badge>
								</span>
							</Tabs.Trigger>
						)}

						<Tabs.Trigger value="library">Library</Tabs.Trigger>
					</Tabs.List>

					<Tabs.Content value="fabric" className="pt-4">
						{reportTab(
							report &&
								(report.fabric.length > 0 ? (
									<FabricTable items={report.fabric} />
								) : (
									<Text color="secondary">No fabric needed.</Text>
								)),
						)}
					</Tabs.Content>

					<Tabs.Content value="linear" className="pt-4">
						{reportTab(
							report &&
								(report.linear.length > 0 ? (
									<LinearTable items={report.linear} />
								) : (
									<Text color="secondary">No linear materials needed.</Text>
								)),
						)}
					</Tabs.Content>

					<Tabs.Content value="hardware" className="pt-4">
						{reportTab(
							report &&
								(report.hardware.length > 0 ? (
									<HardwareTable items={report.hardware} />
								) : (
									<Text color="secondary">No hardware needed.</Text>
								)),
						)}
					</Tabs.Content>

					{report && report.mismatches.length > 0 && (
						<Tabs.Content value="mismatches" className="pt-4">
							<MismatchesTable items={report.mismatches} />
						</Tabs.Content>
					)}

					<Tabs.Content value="library" className="pt-4">
						<LoadingWrapper
							isLoading={materialsLoading}
							skeleton={<PageSpinner />}
							isError={!!materialsError}
							isEmpty={materials?.length === 0}
							emptyState={<Text color="secondary">No materials saved yet.</Text>}
							errorState={<ErrorState description="Failed to load materials." />}>
							{materials && <LibraryTable items={materials} />}
						</LoadingWrapper>
					</Tabs.Content>
				</Tabs.Root>
			</Stack>
		</div>
	);
};

export default MaterialsPage;
