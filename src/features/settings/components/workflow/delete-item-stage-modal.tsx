import { useState } from 'react';
import { Modal, Button, Text, Stack, Flex, Select } from '@artifact-ui/core';
import { TrashIcon, OrdersIcon } from '@/components/icons';
import shared from '@/styles/shared.module.css';
import type { WorkflowStage } from '@/types/api';

export type ItemStageDeleteBlock = {
	affectedOrders: { orderNumber: string; customerName: string | null }[];
	affectedCount: number;
	suggestedReassignStageId: string | null;
};

type DeleteItemStageModalProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	block: ItemStageDeleteBlock;
	stageName: string;
	reassignStages: WorkflowStage[];
	onConfirm: (reassignStageId: string) => void;
	isDeleting: boolean;
};

export const DeleteItemStageModal = ({
	open,
	onOpenChange,
	block,
	stageName,
	reassignStages,
	onConfirm,
	isDeleting,
}: DeleteItemStageModalProps) => {
	const defaultStageId = block.suggestedReassignStageId ?? reassignStages[0]?.id ?? '';
	const [reassignStageId, setReassignStageId] = useState(defaultStageId);

	const selectedStage = reassignStages.find((s) => s.id === reassignStageId);
	const remaining = block.affectedCount - block.affectedOrders.length;

	return (
		<Modal.Root open={open} onOpenChange={onOpenChange}>
			<Modal.Content
				variant="simple"
				size="1"
				ariaDescription="Reassign items before deleting stage">
				<Modal.Header showCloseButton={false}>
					<Modal.Title iconLeft={<TrashIcon size={18} />}>
						Delete {stageName} Stage
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Stack gap="5">
						<Stack gap="2">
							<Text size="4">These orders still have items in this stage.</Text>
							<Text size="2" color="secondary">
								Pick a stage to move these orders to before deleting.
							</Text>
						</Stack>

						<Stack gap="2">
							{block.affectedOrders.map((order) => (
								<Flex key={order.orderNumber} gap="3" align="center">
									<OrdersIcon size={16} className={shared.mutedIcon} />
									<Text size="2" weight="bold">
										{order.orderNumber}
									</Text>
									{order.customerName && (
										<Text size="2" color="secondary">
											{order.customerName}
										</Text>
									)}
								</Flex>
							))}
							{remaining > 0 && (
								<Text size="2" color="secondary" italic>
									and {remaining} more orders
								</Text>
							)}
						</Stack>

						<Stack gap="1">
							<Text size="2" weight="medium">
								Reassign to
							</Text>
							<Select.Root
								value={reassignStageId}
								onValueChange={setReassignStageId}
								size="2">
								<Select.Trigger aria-label="Move items to stage">
									{selectedStage?.name ?? 'Choose a stage'}
								</Select.Trigger>
								<Select.Content>
									<Select.Group>
										{reassignStages.map((stage) => (
											<Select.Item key={stage.id} value={stage.id} textValue={stage.name}>
												{stage.name}
											</Select.Item>
										))}
									</Select.Group>
								</Select.Content>
							</Select.Root>
						</Stack>
					</Stack>
				</Modal.Body>
				<Modal.Footer>
					<Flex justify="end" gap="2">
						<Button
							variant="ghost"
							color="neutral"
							onClick={() => onOpenChange(false)}
							disabled={isDeleting}>
							Cancel
						</Button>
						<Button
							variant="outline"
							color="danger"
							iconLeft={<TrashIcon size={14} />}
							onClick={() => reassignStageId && onConfirm(reassignStageId)}
							loading={isDeleting}
							disabled={isDeleting || !reassignStageId}>
							Reassign & delete
						</Button>
					</Flex>
				</Modal.Footer>
			</Modal.Content>
		</Modal.Root>
	);
};
