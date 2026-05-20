import { Table, Button, Badge, Flex, cn } from '@artifact-ui/core';
import { MinusIcon, PlusIcon } from '@/components/icons/icons';
import { getProgressColor } from '../batch-utils';
import { formatMaterialQuantity } from '../batch-material-utils';
import styles from '@/styles/shared.module.css';
import type { BatchMaterial } from '@/types/api';

type BatchFabricMaterialRowProps = {
	material: BatchMaterial;
	onUpdateQty: (id: string, completedQty: number) => void;
};

export const BatchFabricMaterialRow = ({
	material,
	onUpdateQty,
}: BatchFabricMaterialRowProps) => {
	const totalQty = Number(material.quantity);

	const handleDecrement = () => onUpdateQty(material.id, material.completed_qty - 1);
	const handleIncrement = () => onUpdateQty(material.id, material.completed_qty + 1);

	return (
		<Table.Row
			key={material.id}
			className={cn(material.completed && styles.completedRow)}>
			<Table.Cell>{material.product_name ?? '—'}</Table.Cell>
			<Table.Cell>{material.material_type ?? '—'}</Table.Cell>
			<Table.Cell>{material.piece}</Table.Cell>
			<Table.Cell>{material.color ?? '—'}</Table.Cell>
			<Table.Cell>{formatMaterialQuantity(material)}</Table.Cell>
			<Table.Cell textAlign="center">
				<Flex align="center" justify="center" gap="2">
					<Button
						size="1"
						variant="ghost"
						color="neutral"
						disabled={material.completed_qty <= 0}
						onClick={handleDecrement}>
						<MinusIcon size={14} />
					</Button>
					<Badge
						size="2"
						variant="soft"
						color={getProgressColor(material.completed_qty, totalQty)}>
						{material.completed_qty}/{totalQty}
					</Badge>
					<Button
						size="1"
						variant="ghost"
						color="neutral"
						disabled={material.completed_qty >= totalQty}
						onClick={handleIncrement}>
						<PlusIcon size={14} />
					</Button>
				</Flex>
			</Table.Cell>
		</Table.Row>
	);
};
