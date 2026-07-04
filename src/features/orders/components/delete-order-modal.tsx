import { Modal, Button, Text, Flex } from '@artifact-ui/core';
import { TrashIcon } from '@/components/icons/icons';

type DeleteOrderModalProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	orderNumber: string;
	onDelete: () => void;
	isPending: boolean;
};

export const DeleteOrderModal = ({
	open,
	onOpenChange,
	orderNumber,
	onDelete,
	isPending,
}: DeleteOrderModalProps) => {
	return (
		<Modal.Root open={open} onOpenChange={onOpenChange}>
			<Modal.Content variant="simple" size="1" ariaDescription="Confirm order deletion">
				<Modal.Header showCloseButton={false}>
					<Modal.Title iconLeft={<TrashIcon size={18} />}>Delete Order</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Text size="2">
						Are you sure you want to delete <strong>{orderNumber}</strong>? This can't be
						undone.
					</Text>
				</Modal.Body>
				<Modal.Footer>
					<Flex justify="end" gap="2">
						<Button
							variant="ghost"
							color="neutral"
							onClick={() => onOpenChange(false)}
							disabled={isPending}>
							Cancel
						</Button>
						<Button
							color="danger"
							iconLeft={<TrashIcon size={14} />}
							onClick={onDelete}
							loading={isPending}
							disabled={isPending}>
							Delete
						</Button>
					</Flex>
				</Modal.Footer>
			</Modal.Content>
		</Modal.Root>
	);
};
