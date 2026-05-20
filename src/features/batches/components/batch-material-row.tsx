import { Table, Checkbox, cn } from '@artifact-ui/core';
import { formatMaterialQuantity } from '../utils/batch-material-utils';
import styles from '@/styles/shared.module.css';
import type { BatchMaterial } from '@/types/api';

type BatchMaterialRowProps = {
	material: BatchMaterial;
	onToggle: (id: string, completed: boolean) => void;
};

export const BatchMaterialRow = ({ material, onToggle }: BatchMaterialRowProps) => {
	const handleToggle = () => onToggle(material.id, !material.completed);

	return (
		<Table.Row
			className={cn('cursor-pointer', material.completed && styles.completedRow)}
			onClick={handleToggle}>
			<Table.Cell>
				<Checkbox checked={material.completed} onCheckedChange={handleToggle} />
			</Table.Cell>
			<Table.Cell>{material.material_type ?? '—'}</Table.Cell>
			<Table.Cell>{material.piece || '—'}</Table.Cell>
			<Table.Cell>{formatMaterialQuantity(material)}</Table.Cell>
		</Table.Row>
	);
};
