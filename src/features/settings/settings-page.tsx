import { useState } from 'react';
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
import {
	Heading,
	Text,
	TextField,
	Button,
	Card,
	Stack,
	Flex,
	Separator,
} from '@artifact-ui/core';
import { SettingsIcon } from '@/components/icons';
import { PageSpinner } from '@/components/page-spinner';
import {
	useWorkflowStages,
	useReorderWorkflowStages,
} from '@/features/orders/api/orders-queries';
import { useToast } from '@/providers/toast-context';
import { useSettings, useUpdateStore } from './api/settings-queries';
import { StageRow } from './components/stage-row';
import { AddStage } from './components/add-stage';

type UpdateStorePayload = {
	storeName?: string;
	leadTimeDays?: number | null;
	accessToken?: string;
};

const SettingsPage = () => {
	const toast = useToast();
	const { data: settings, isLoading: settingsLoading } = useSettings();
	const { data: stages, isLoading: stagesLoading } = useWorkflowStages();
	const updateStore = useUpdateStore();
	const reorderStages = useReorderWorkflowStages();

	const [prevSettings, setPrevSettings] = useState(settings);
	const [storeName, setStoreName] = useState(settings?.storeName ?? '');
	const [leadTime, setLeadTime] = useState(
		settings?.leadTimeDays != null ? String(settings.leadTimeDays) : '',
	);
	const [accessToken, setAccessToken] = useState('');

	if (settings !== prevSettings) {
		setPrevSettings(settings);
		setStoreName(settings?.storeName ?? '');
		setLeadTime(settings?.leadTimeDays != null ? String(settings.leadTimeDays) : '');
	}

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
	);

	if (settingsLoading || stagesLoading) return <PageSpinner />;

	const buildPayload = (): UpdateStorePayload => {
		const payload: UpdateStorePayload = {};

		if (settings && storeName !== settings.storeName) {
			payload.storeName = storeName.trim();
		}

		const currentLeadTime = settings?.leadTimeDays ?? null;
		const inputLeadTime = leadTime === '' ? null : Number(leadTime);
		if (inputLeadTime !== currentLeadTime) {
			payload.leadTimeDays = inputLeadTime;
		}

		if (accessToken.trim().length > 0) {
			payload.accessToken = accessToken.trim();
		}

		return payload;
	};

	const payload = buildPayload();
	const hasChanges = Object.keys(payload).length > 0;

	const handleSave = () => {
		if (!hasChanges) return;
		updateStore.mutate(payload, {
			onSuccess: () => {
				setAccessToken('');
				toast.success('Store settings updated');
			},
			onError: (error) => {
				toast.error(error.message, 'Could not update store');
			},
		});
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over || active.id === over.id || !stages) return;

		const oldIndex = stages.orderStages.findIndex((s) => s.id === active.id);
		const newIndex = stages.orderStages.findIndex((s) => s.id === over.id);
		if (oldIndex === -1 || newIndex === -1) return;

		const reordered = arrayMove(stages.orderStages, oldIndex, newIndex);
		reorderStages.mutate(reordered.map((s) => s.id));
	};

	const stageIds = stages?.orderStages.map((s) => s.id) ?? [];

	return (
		<div className="p-8 max-w-2xl">
			<Stack gap="6">
				<Heading size="6" iconLeft={<SettingsIcon />}>
					Settings
				</Heading>

				<Card.Root>
					<Card.Header>
						<Heading size="4">Store Connection</Heading>
					</Card.Header>
					<Card.Body>
						<Stack gap="5">
							<Stack gap="2">
								<Text size="2" weight="medium">
									Store Name
								</Text>
								<TextField.Standalone
									value={storeName}
									onChange={(e) => setStoreName(e.target.value)}
								/>
							</Stack>

							<Stack gap="2">
								<Text size="2" weight="medium">
									Access Token
								</Text>
								<Text size="2" color="secondary">
									Leave blank to keep current token. Updating triggers a connection test.
								</Text>
								<TextField.Standalone
									type="password"
									placeholder="Paste new token to update"
									value={accessToken}
									onChange={(e) => setAccessToken(e.target.value)}
								/>
							</Stack>

							<Stack gap="2">
								<Text size="2" weight="medium">
									Lead Time
								</Text>
								<Text size="2" color="secondary">
									Default number of days from order date to due date. Applied to new
									orders during sync.
								</Text>
								<div className="w-32">
									<TextField.Standalone
										type="number"
										placeholder="Days"
										value={leadTime}
										onChange={(e) => setLeadTime(e.target.value)}
										min={0}
									/>
								</div>
							</Stack>

							<Flex>
								<Button
									onClick={handleSave}
									disabled={!hasChanges || updateStore.isPending}
									className="cursor-pointer">
									Save Changes
								</Button>
							</Flex>
						</Stack>
					</Card.Body>
				</Card.Root>

				<Card.Root>
					<Card.Header>
						<Heading size="4">Workflow Stages</Heading>
					</Card.Header>
					<Card.Body>
						<Stack gap="4">
							<Text size="2" color="secondary">
								Drag to reorder. Rename, add, or remove the stages that appear on your
								kanban board.
							</Text>

							<AddStage />

							<Separator />

							<DndContext
								sensors={sensors}
								collisionDetection={closestCenter}
								onDragEnd={handleDragEnd}>
								<SortableContext items={stageIds} strategy={verticalListSortingStrategy}>
									<Stack gap="3">
										{stages?.orderStages.map((stage) => (
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
			</Stack>
		</div>
	);
};

export default SettingsPage;
