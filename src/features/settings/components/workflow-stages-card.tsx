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
import { useReorderWorkflowStages } from '@/features/orders/api/orders-queries';
import type { WorkflowStage } from '@/types/api';
import { StageRow } from './stage-row';
import { AddStage } from './add-stage';

type WorkflowStagesCardProps = {
	stages: WorkflowStage[];
};

export const WorkflowStagesCard = ({ stages }: WorkflowStagesCardProps) => {
	const reorderStages = useReorderWorkflowStages();

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
		reorderStages.mutate(reordered.map((s) => s.id));
	};

	const stageIds = stages.map((s) => s.id);

	return (
		<Card.Root>
			<Card.Header>
				<Heading size="4">Workflow Stages</Heading>
			</Card.Header>
			<Card.Body>
				<Stack gap="4">
					<Text size="2" color="secondary">
						Drag to reorder. Rename, add, or remove the stages that appear on your kanban
						board.
					</Text>

					<AddStage />

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
										isDefault={stage.is_default}
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
