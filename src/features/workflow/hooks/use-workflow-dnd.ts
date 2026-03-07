import { useState, useMemo } from 'react';
import {
	PointerSensor,
	useSensor,
	useSensors,
	type DragStartEvent,
	type DragEndEvent,
} from '@dnd-kit/core';
import { useUpdateOrderStage } from '@/features/orders/api/orders-queries';
import type { WorkflowBoardOrder } from '@/types/api';

type PendingMove = { orderId: string; stageId: string };

export const useWorkflowDnd = (orders: WorkflowBoardOrder[]) => {
	const updateStage = useUpdateOrderStage();
	const [activeOrder, setActiveOrder] = useState<WorkflowBoardOrder | null>(
		null,
	);
	const [pendingMove, setPendingMove] = useState<PendingMove | null>(null);

	const displayOrders = useMemo(() => {
		if (!pendingMove) return orders;
		return orders.map((o) =>
			o.id === pendingMove.orderId
				? { ...o, workflow_stage_id: pendingMove.stageId }
				: o,
		);
	}, [orders, pendingMove]);

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
	);

	const handleDragStart = (event: DragStartEvent) => {
		const order = orders.find((o) => o.id === event.active.id);
		setActiveOrder(order ?? null);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		setActiveOrder(null);
		const { active, over } = event;

		if (!over) return;

		const orderId = active.id as string;
		const newStageId = over.id as string;
		const order = orders.find((o) => o.id === orderId);

		if (!order || order.workflow_stage_id === newStageId) return;

		setPendingMove({ orderId, stageId: newStageId });

		updateStage.mutate(
			{ orderId, stageId: newStageId },
			{ onSettled: () => setPendingMove(null) },
		);
	};

	return { sensors, activeOrder, displayOrders, handleDragStart, handleDragEnd };
};
