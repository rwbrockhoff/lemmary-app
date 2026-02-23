import { Table, Checkbox, Button, Badge, cn } from '@artifact-ui/core';
import { getProgressColor } from './batch-utils';
import styles from '@/styles/shared.module.css';
import { MinusIcon, PlusIcon } from '@/components/icons/icons';
import type { BatchMaterial } from '@/types/api';

type BatchMaterialsTableProps = {
	materials: BatchMaterial[];
	onToggle: (id: string, completed: boolean) => void;
	onUpdateQty?: (id: string, completedQty: number) => void;
};

export const BatchMaterialsTable = ({
	materials,
	onToggle,
	onUpdateQty,
}: BatchMaterialsTableProps) => {
	const isFabric = materials[0]?.category === 'fabric';

	return (
		<Table.Root>
			<Table.Header>
				<Table.Row>
					{!isFabric && <Table.HeaderCell className="w-10" />}
					<Table.HeaderCell>Piece</Table.HeaderCell>
					<Table.HeaderCell>Detail</Table.HeaderCell>
					<Table.HeaderCell>Qty</Table.HeaderCell>
					{isFabric && (
						<Table.HeaderCell style={{ textAlign: 'center' }}>
							Progress
						</Table.HeaderCell>
					)}
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{materials.map((material) => {
					const totalQty = Number(material.quantity);

					if (isFabric && onUpdateQty) {
						return (
							<Table.Row
								key={material.id}
								className={cn(material.completed && styles.completedRow)}
							>
								<Table.Cell>
									{material.piece}
								</Table.Cell>
								<Table.Cell>
									{formatMaterialDetail(material)}
								</Table.Cell>
								<Table.Cell>
									{formatMaterialQuantity(material)}
								</Table.Cell>
								<Table.Cell textAlign="center">
									<div className="flex items-center justify-center gap-2">
										<Button
											size="1"
											variant="ghost"
											color="neutral"
											disabled={
												material.completed_qty <= 0
											}
											onClick={() =>
												onUpdateQty(
													material.id,
													material.completed_qty - 1,
												)
											}
										>
											<MinusIcon size={14} />
										</Button>
										<Badge
											size="2"
											variant="soft"
											color={getProgressColor(material.completed_qty, totalQty)}
										>
											{material.completed_qty}/{totalQty}
										</Badge>
										<Button
											size="1"
											variant="ghost"
											color="neutral"
											disabled={
												material.completed_qty >=
												totalQty
											}
											onClick={() =>
												onUpdateQty(
													material.id,
													material.completed_qty + 1,
												)
											}
										>
											<PlusIcon size={14} />
										</Button>
									</div>
								</Table.Cell>
							</Table.Row>
						);
					}

					return (
						<Table.Row
							key={material.id}
							className={cn('cursor-pointer', material.completed && styles.completedRow)}
							onClick={() =>
								onToggle(material.id, !material.completed)
							}
						>
							<Table.Cell>
								<Checkbox
									checked={material.completed}
									onCheckedChange={() =>
										onToggle(
											material.id,
											!material.completed,
										)
									}
								/>
							</Table.Cell>
							<Table.Cell>{material.piece}</Table.Cell>
							<Table.Cell>
								{formatMaterialDetail(material)}
							</Table.Cell>
							<Table.Cell>
								{formatMaterialQuantity(material)}
							</Table.Cell>
						</Table.Row>
					);
				})}
			</Table.Body>
		</Table.Root>
	);
};

function formatMaterialDetail(material: BatchMaterial): string {
	if (material.category === 'fabric') {
		return material.color ?? '—';
	}
	if (material.category === 'linear') {
		const type = material.material_type ?? '';
		const width = material.width ? `${material.width}"` : '';
		return [type, width].filter(Boolean).join(' · ');
	}
	return '—';
}

function formatMaterialQuantity(material: BatchMaterial): string {
	const qty = Number(material.quantity);
	if (material.category === 'linear') {
		const feet = Math.ceil(qty / 12);
		return `${feet} ft`;
	}
	return String(qty);
}
