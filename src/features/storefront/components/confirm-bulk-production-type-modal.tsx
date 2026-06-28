import { Text, Button, Flex, Modal } from '@artifact-ui/core';
import type { ProductionType } from '@/types/api';
import { productionTypeLabel } from '../production-type';

type ConfirmBulkProductionTypeModalProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	productionType: ProductionType | null;
	onConfirm: () => void;
};

export const ConfirmBulkProductionTypeModal = ({
	open,
	onOpenChange,
	productionType,
	onConfirm,
}: ConfirmBulkProductionTypeModalProps) => (
	<Modal.Root open={open} onOpenChange={onOpenChange}>
		<Modal.Content
			variant="simple"
			size="1"
			ariaDescription="Confirm applying one production type to all variants">
			<Modal.Header showCloseButton={false}>
				<Modal.Title>Apply to all variants?</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Text size="2">
					This product's variants have different production types. Setting it to{' '}
					<strong>{productionType ? productionTypeLabel(productionType) : ''}</strong>{' '}
					will apply that to every variant.
				</Text>
			</Modal.Body>
			<Modal.Footer>
				<Flex justify="end" gap="2">
					<Button
						variant="ghost"
						color="neutral"
						onClick={() => onOpenChange(false)}
						className="cursor-pointer">
						Cancel
					</Button>
					<Button onClick={onConfirm} className="cursor-pointer">
						Apply to all
					</Button>
				</Flex>
			</Modal.Footer>
		</Modal.Content>
	</Modal.Root>
);
