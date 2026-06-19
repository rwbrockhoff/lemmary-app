import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	type DragEndEvent,
} from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Heading, Text, Card, Stack, Separator } from '@artifact-ui/core';
import {
	WORKFLOW_STAGE_COLORS,
	type WorkflowStageColor,
} from '@/components/orders/stage-colors';
import type { WorkflowStage } from '@/types/api';
import { StageRow } from './stage-row';
import { AddStage } from './add-stage';

type StageEditorProps = {
	title: string;
	description: string;
	stages: WorkflowStage[];
	onCreate: (name: string, color: WorkflowStageColor) => Promise<void>;
	onRename: (id: string, name: string) => void;
	onRecolor: (id: string, color: WorkflowStageColor) => void;
	onDelete: (id: string) => void;
	onReorder: (orderedIds: string[]) => void;
	isCreating: boolean;
	isUpdating: boolean;
	isDeleting: boolean;
};

export const StageEditor = ({
	title,
	description,
	stages,
	onCreate,
	onRename,
	onRecolor,
	onDelete,
	onReorder,
	isCreating,
	isUpdating,
	isDeleting,
}: StageEditorProps) => {
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over || active.id === over.id) return;

		const oldIndex = stages.findIndex((s) => s.id === active.id);
		const newIndex = stages.findIndex((s) => s.id === over.id);
		if (oldIndex === -1 || newIndex === -1) return;

		const reordered = arrayMove(stages, oldIndex, newIndex);
		onReorder(reordered.map((s) => s.id));
	};

	const stageIds = stages.map((s) => s.id);
	const nextDefaultColor =
		WORKFLOW_STAGE_COLORS[stages.length % WORKFLOW_STAGE_COLORS.length];

	return (
		<Card.Root>
			<Card.Header>
				<Stack gap="1">
					<Heading size="4">{title}</Heading>
					<Text size="2" color="secondary" weight="normal">
						{description}
					</Text>
				</Stack>
			</Card.Header>
			<Card.Body>
				<Stack gap="4">
					<AddStage
						defaultColor={nextDefaultColor}
						onAdd={onCreate}
						isAdding={isCreating}
					/>

					<Separator />

					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragEnd={handleDragEnd}>
						<SortableContext items={stageIds} strategy={verticalListSortingStrategy}>
							<Stack gap="3">
								{stages.map((stage) => (
									<StageRow
										key={stage.id}
										id={stage.id}
										name={stage.name}
										color={stage.color}
										isDefault={stage.is_default}
										onRename={onRename}
										onRecolor={onRecolor}
										onDelete={onDelete}
										isSaving={isUpdating}
										isDeleting={isDeleting}
									/>
								))}
							</Stack>
						</SortableContext>
					</DndContext>
				</Stack>
			</Card.Body>
		</Card.Root>
	);
};
