import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, Flex, TextField, IconButton, cn } from '@artifact-ui/core';
import shared from '@/styles/shared.module.css';
import { GripIcon, TrashIcon } from '@/components/icons';
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
	onRename: (id: string, name: string) => void;
	onRecolor: (id: string, color: WorkflowStageColor) => void;
	onDelete: (id: string) => void;
	isSaving: boolean;
	isDeleting: boolean;
};

const resolveColor = (color: string | null): WorkflowStageColor => {
	if (color && isWorkflowStageColor(color)) return color;
	return 'slate';
};

export const StageRow = ({
	id,
	name,
	color,
	isDefault,
	onRename,
	onRecolor,
	onDelete,
	isSaving,
	isDeleting,
}: StageRowProps) => {
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
		onRename(id, value.trim());
	};

	const handleColorChange = (next: WorkflowStageColor) => {
		if (next === currentColor) return;
		onRecolor(id, next);
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
					disabled={!hasChanged || isSaving}
					variant="secondary"
					className="cursor-pointer">
					Save
				</Button>
				<IconButton
					size="1"
					variant="ghost"
					color="danger"
					onClick={() => !isDefault && onDelete(id)}
					disabled={isDefault || isDeleting}
					label={isDefault ? 'Default stage cannot be deleted' : 'Delete stage'}
					icon={<TrashIcon size={18} />}
					className="cursor-pointer"
				/>
			</Flex>
		</div>
	);
};
