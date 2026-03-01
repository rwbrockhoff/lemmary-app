import { Heading, Text, Badge, Tabs } from '@artifact-ui/core';
import { MaterialsIcon } from '@/components/icons';
import { useMaterialsReport } from './materials-queries';
import { FabricTable } from './fabric-table';
import { LinearTable } from './linear-table';
import { HardwareTable } from './hardware-table';
import { MismatchesTable } from './mismatches-table';

const MaterialsPage = () => {
	const { data: report, isLoading, error } = useMaterialsReport();

	return (
		<div className="p-8 max-w-5xl mx-auto">
			<div className="mb-6">
				<Heading size="6" iconLeft={<MaterialsIcon size={20} />}>Materials Report</Heading>
			</div>

			{isLoading && <Text color="secondary">Loading materials report...</Text>}

			{error && <Text color="danger">Failed to load materials report.</Text>}

			{report && (
				<Tabs.Root defaultValue="fabric">
					<Tabs.List>
						<Tabs.Trigger value="fabric">
							Fabric ({report.fabric.length})
						</Tabs.Trigger>
						<Tabs.Trigger value="linear">
							Linear ({report.linear.length})
						</Tabs.Trigger>
						<Tabs.Trigger value="hardware">
							Hardware ({report.hardware.length})
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
		</div>
	);
};

export default MaterialsPage;
