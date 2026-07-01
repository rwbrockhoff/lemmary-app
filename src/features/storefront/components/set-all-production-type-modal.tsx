import { useState } from 'react';
import { Text, Button, Stack, Flex, Modal } from '@artifact-ui/core';
import { ProductionIcon } from '@/components/icons';
import type { ProductionType } from '@/types/api';
import { ProductionTypeSelect } from '@/components/production-type-select';

type SetAllProductionTypeModalProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: (productionType: ProductionType) => void;
	pending?: boolean;
};

export const SetAllProductionTypeModal = ({
	open,
	onOpenChange,
	onConfirm,
	pending,
}: SetAllProductionTypeModalProps) => {
	const [selected, setSelected] = useState<ProductionType>('ready_made');

	return (
		<Modal.Root open={open} onOpenChange={onOpenChange}>
			<Modal.Content
				variant="simple"
				size="1"
				ariaDescription="Set production type for all products">
				<Modal.Header showCloseButton={false}>
					<Modal.Title>
						<Flex align="center" gap="2">
							<ProductionIcon size={18} />
							Set All Production Types
						</Flex>
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Stack gap="4">
						<Text size="3">
							This applies one production type to every product, overriding any
							per-product or per-variant choices.
						</Text>
						<ProductionTypeSelect
							value={selected}
							onChange={setSelected}
							variant="default"
							size="2"
						/>
					</Stack>
				</Modal.Body>
				<Modal.Footer>
					<Flex justify="end" gap="2">
						<Button
							variant="ghost"
							color="neutral"
							onClick={() => onOpenChange(false)}
							disabled={pending}
							className="cursor-pointer">
							Cancel
						</Button>
						<Button
							onClick={() => onConfirm(selected)}
							loading={pending}
							disabled={pending}
							className="cursor-pointer">
							Apply to all products
						</Button>
					</Flex>
				</Modal.Footer>
			</Modal.Content>
		</Modal.Root>
	);
};
