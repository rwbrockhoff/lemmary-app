import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, Flex, TextField, IconButton, cn } from '@artifact-ui/core';
import shared from '@/styles/shared.module.css';
import { GripIcon, TrashIcon } from '@/components/icons';
import { useToast } from '@/providers/toast-context';
import {
	useUpdateWorkflowStage,
	useDeleteWorkflowStage,
} from '@/features/orders/api/orders-queries';
import { StageColorPicker } from '@/features/orders/components/stage-color-picker';
import {
	isWorkflowStageColor,
	type WorkflowStageColor,
} from '@/components/orders/stage-colors';

type StageRowProps = {
	id: string;
	name: string;
	color: string | null;
	isDefault: boolean;
};

const resolveColor = (color: string | null): WorkflowStageColor => {
	if (color && isWorkflowStageColor(color)) return color;
	return 'slate';
};

export const StageRow = ({ id, name, color, isDefault }: StageRowProps) => {
	const toast = useToast();
	const updateStage = useUpdateWorkflowStage();
	const deleteStage = useDeleteWorkflowStage();
	const [value, setValue] = useState(name);

	const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
		useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	const currentColor = resolveColor(color);
	const hasChanged = value.trim().length > 0 && value !== name;

	const handleSaveName = () => {
		if (!hasChanged) return;
		updateStage.mutate(
			{ stageId: id, name: value.trim() },
			{
				onSuccess: () => toast.success('Stage renamed'),
				onError: (error) => toast.error(error.message, 'Could not rename'),
			},
		);
	};

	const handleColorChange = (next: WorkflowStageColor) => {
		if (next === currentColor) return;
		updateStage.mutate(
			{ stageId: id, color: next },
			{
				onError: (error) => toast.error(error.message, 'Could not update color'),
			},
		);
	};

	const handleDelete = () => {
		if (isDefault) return;
		deleteStage.mutate(id, {
			onSuccess: () => toast.success('Stage deleted'),
			onError: (error) => toast.error(error.message, 'Could not delete'),
		});
	};

	return (
		<div ref={setNodeRef} style={style}>
			<Flex gap="2" align="center">
				<button
					{...attributes}
					{...listeners}
					type="button"
					aria-label="Drag to reorder"
					className={cn(
						shared.mutedIcon,
						'flex items-center justify-center cursor-grab active:cursor-grabbing',
					)}>
					<GripIcon size={16} />
				</button>
				<StageColorPicker value={currentColor} onChange={handleColorChange} />
				<TextField.Standalone value={value} onChange={(e) => setValue(e.target.value)} />
				<Button
					size="2"
					onClick={handleSaveName}
					disabled={!hasChanged || updateStage.isPending}
					variant="secondary"
					className="cursor-pointer">
					Save
				</Button>
				<IconButton
					size="1"
					variant="ghost"
					color="danger"
					onClick={handleDelete}
					disabled={isDefault || deleteStage.isPending}
					label={isDefault ? 'Default stage cannot be deleted' : 'Delete stage'}
					icon={<TrashIcon size={18} />}
					className="cursor-pointer"
				/>
			</Flex>
		</div>
	);
};
