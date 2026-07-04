import { useState } from 'react';
import { Modal, Select, Button, Stack, Text, Flex } from '@artifact-ui/core';
import { RedoIcon } from '@/components/icons/icons';
import { REWORK_REASONS, isReworkReason, reworkReasonLabel } from '@/utils/rework';
import type { ReworkReason } from '@/types/api';

type ReworkReasonModalProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: (reason: ReworkReason) => void;
	isPending: boolean;
	orderNumber: string;
};

export const ReworkReasonModal = ({
	open,
	onOpenChange,
	onConfirm,
	isPending,
	orderNumber,
}: ReworkReasonModalProps) => {
	const [reason, setReason] = useState<ReworkReason>('defect');

	return (
		<Modal.Root open={open} onOpenChange={onOpenChange}>
			<Modal.Content size="1" ariaDescription="Choose a reason for the rework">
				<Modal.Header>
					<Modal.Title iconLeft={<RedoIcon size={18} />}>
						Redo Order #{orderNumber}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Stack gap="2">
						<Text size="2" color="secondary">
							Why is this order being redone?
						</Text>
						<Select.Root
							value={reason}
							onValueChange={(value) => {
								if (isReworkReason(value)) setReason(value);
							}}
							size="2">
							<Select.Trigger aria-label="Rework reason">
								{reworkReasonLabel(reason)}
							</Select.Trigger>
							<Select.Content>
								<Select.Group>
									{REWORK_REASONS.map((option) => (
										<Select.Item
											key={option.value}
											value={option.value}
											textValue={option.label}>
											{option.label}
										</Select.Item>
									))}
								</Select.Group>
							</Select.Content>
						</Select.Root>
					</Stack>
				</Modal.Body>
				<Modal.Footer>
					<Flex justify="end" gap="2">
						<Button
							type="button"
							variant="ghost"
							color="neutral"
							onClick={() => onOpenChange(false)}
							disabled={isPending}>
							Cancel
						</Button>
						<Button type="button" onClick={() => onConfirm(reason)} disabled={isPending}>
							Redo Order
						</Button>
					</Flex>
				</Modal.Footer>
			</Modal.Content>
		</Modal.Root>
	);
};
