import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, Flex, TextField, IconButton } from '@artifact-ui/core';
import { GripIcon, TrashIcon } from '@/components/icons';
import { useToast } from '@/providers/toast-context';
import {
	useUpdateWorkflowStage,
	useDeleteWorkflowStage,
} from '@/features/orders/api/orders-queries';

type StageRowProps = {
	id: string;
	name: string;
	isDefault: boolean;
};

export const StageRow = ({ id, name, isDefault }: StageRowProps) => {
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

	const hasChanged = value.trim().length > 0 && value !== name;

	const handleSave = () => {
		if (!hasChanged) return;
		updateStage.mutate(
			{ stageId: id, name: value.trim() },
			{
				onSuccess: () => toast.success('Stage renamed'),
				onError: (error) => toast.error(error.message, 'Could not rename'),
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
					className="flex items-center justify-center text-gray-500 hover:text-gray-700 cursor-grab active:cursor-grabbing">
					<GripIcon size={16} />
				</button>
				<TextField.Standalone value={value} onChange={(e) => setValue(e.target.value)} />
				<Button
					size="2"
					onClick={handleSave}
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
