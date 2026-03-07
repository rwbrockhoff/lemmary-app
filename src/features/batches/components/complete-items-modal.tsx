import { Modal, Button, Text, Flex, Stack } from '@artifact-ui/core';
import { ListChecksIcon } from '@/components/icons/icons';
import { VariantBadges } from '@/components/variant-badges';
import type { BatchOrderItem } from '@/types/api';

type CompleteItemsModalProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	items: BatchOrderItem[];
	onConfirm: () => void;
	isPending: boolean;
};

export const CompleteItemsModal = ({
	open,
	onOpenChange,
	items,
	onConfirm,
	isPending,
}: CompleteItemsModalProps) => {
	return (
		<Modal.Root open={open} onOpenChange={onOpenChange}>
			<Modal.Content variant="simple" size="2" ariaDescription="Mark incomplete items as complete">
				<Modal.Header showCloseButton={false}>
					<Flex align="center" gap="2">
						<ListChecksIcon size={18} />
						<Modal.Title>Mark Items Complete?</Modal.Title>
					</Flex>
				</Modal.Header>
				<Modal.Body>
					<Stack gap="6">
						<Text size="4" weight="medium">
							This order has {items.length} incomplete{' '}
							{items.length === 1 ? 'item' : 'items'}.
						</Text>
						<Flex direction="column" gap="2">
						{items.map((item) => (
							<Flex key={item.id} align="center" gap="2">
								<Text size="2" color="secondary">•</Text>
								<Text size="2">
									{item.product_name}
									{item.quantity > 1 && ` (x${item.quantity})`}
								</Text>
								<VariantBadges variants={item.variant_label} />
							</Flex>
						))}
					</Flex>
					</Stack>
				</Modal.Body>
				<Modal.Footer className="mt-4">
					<Flex justify="end" gap="2">
						<Button
							variant="ghost"
							color="neutral"
							onClick={() => onOpenChange(false)}
							disabled={isPending}
						>
							Skip
						</Button>
						<Button
							iconLeft={<ListChecksIcon size={14} />}
							onClick={onConfirm}
							loading={isPending}
							disabled={isPending}
						>
							Mark All Complete
						</Button>
					</Flex>
				</Modal.Footer>
			</Modal.Content>
		</Modal.Root>
	);
};
