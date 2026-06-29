import { Text, Badge, Tabs } from '@artifact-ui/core';
import { PageSpinner } from '@/components/page-spinner';
import { LoadingWrapper } from '@/components/loading-wrapper/loading-wrapper';
import { ErrorState } from '@/components/error-state/error-state';
import { useMaterialsReport } from './production-queries';
import { FabricTable } from './fabric-table';
import { LinearTable } from './linear-table';
import { HardwareTable } from './hardware-table';
import { MismatchesTable } from './mismatches-table';

export const MaterialsReport = () => {
	const { data: report, isLoading, error } = useMaterialsReport();

	return (
		<LoadingWrapper
			isLoading={isLoading}
			skeleton={<PageSpinner />}
			isError={!!error}
			errorState={<ErrorState description="Failed to load materials report." />}>
			{report && (
				<Tabs.Root defaultValue="fabric">
					<Tabs.List size="1">
						<Tabs.Trigger value="fabric">
							<span className="flex items-center gap-2">
								Fabric
								{report.fabric.length > 0 && (
									<Badge variant="soft" color="neutral" size="1">
										{report.fabric.length}
									</Badge>
								)}
							</span>
						</Tabs.Trigger>
						<Tabs.Trigger value="linear">
							<span className="flex items-center gap-2">
								Linear
								{report.linear.length > 0 && (
									<Badge variant="soft" color="neutral" size="1">
										{report.linear.length}
									</Badge>
								)}
							</span>
						</Tabs.Trigger>
						<Tabs.Trigger value="hardware">
							<span className="flex items-center gap-2">
								Hardware
								{report.hardware.length > 0 && (
									<Badge variant="soft" color="neutral" size="1">
										{report.hardware.length}
									</Badge>
								)}
							</span>
						</Tabs.Trigger>
						{report.mismatches.length > 0 && (
							<Tabs.Trigger value="mismatches">
								<span className="flex items-center gap-2">
									Mismatches
									<Badge variant="soft" color="danger" size="1">
										{report.mismatches.length}
									</Badge>
								</span>
							</Tabs.Trigger>
						)}
					</Tabs.List>

					<Tabs.Content value="fabric" className="pt-4">
						{report.fabric.length > 0 ? (
							<FabricTable items={report.fabric} />
						) : (
							<Text color="secondary">No fabric needed.</Text>
						)}
					</Tabs.Content>

					<Tabs.Content value="linear" className="pt-4">
						{report.linear.length > 0 ? (
							<LinearTable items={report.linear} />
						) : (
							<Text color="secondary">No linear materials needed.</Text>
						)}
					</Tabs.Content>

					<Tabs.Content value="hardware" className="pt-4">
						{report.hardware.length > 0 ? (
							<HardwareTable items={report.hardware} />
						) : (
							<Text color="secondary">No hardware needed.</Text>
						)}
					</Tabs.Content>

					{report.mismatches.length > 0 && (
						<Tabs.Content value="mismatches" className="pt-4">
							<MismatchesTable items={report.mismatches} />
						</Tabs.Content>
					)}
				</Tabs.Root>
			)}
		</LoadingWrapper>
	);
};
