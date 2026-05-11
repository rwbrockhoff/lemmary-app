import { Text, Checkbox, Flex } from '@artifact-ui/core';

type BatchFilterProps = {
	batches: { id: string; name: string }[];
	selectedIds: Set<string>;
	showAll: boolean;
	onToggleBatch: (batchId: string) => void;
	onToggleShowAll: () => void;
};

export const BatchFilter = ({
	batches,
	selectedIds,
	showAll,
	onToggleBatch,
	onToggleShowAll,
}: BatchFilterProps) => {
	return (
		<Flex align="center" gap="4" className="mb-6 flex-wrap">
			<Text size="2" color="secondary">
				Active Batches:
			</Text>
			{batches.map((batch) => (
				<label
					key={batch.id}
					className="flex items-center gap-2 cursor-pointer select-none">
					<Checkbox
						checked={!showAll && selectedIds.has(batch.id)}
						onCheckedChange={() => onToggleBatch(batch.id)}
						size="1"
					/>
					<Text size="2">{batch.name}</Text>
				</label>
			))}
			<label className="flex items-center gap-2 cursor-pointer select-none ml-2">
				<Checkbox checked={showAll} onCheckedChange={onToggleShowAll} size="1" />
				<Text size="2">Show all orders</Text>
			</label>
		</Flex>
	);
};
