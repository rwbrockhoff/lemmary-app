import { Text, Button, Stack, Flex, Modal } from '@artifact-ui/core';
import { TrashIcon } from '@/components/icons/icons';
import { useToast } from '@/providers/toast-context';
import { useDeleteMaterial } from './library-queries';
import type { MaterialLibraryItem } from '@/types/api';

type DeleteMaterialModalProps = {
	material: MaterialLibraryItem;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export const DeleteMaterialModal = ({
	material,
	open,
	onOpenChange,
}: DeleteMaterialModalProps) => {
	const toast = useToast();
	const deleteMaterial = useDeleteMaterial();

	const label = [material.material_type_name, material.color, material.size]
		.filter(Boolean)
		.join(' - ');

	const handleDelete = () => {
		deleteMaterial.mutate(material.id, {
			onSuccess: () => {
				toast.success('Material deleted');
				onOpenChange(false);
			},
			onError: (error) => toast.error(error.message, 'Could not delete material'),
		});
	};

	return (
		<Modal.Root open={open} onOpenChange={onOpenChange}>
			<Modal.Content
				variant="simple"
				size="1"
				ariaDescription="Confirm material deletion">
				<Modal.Header showCloseButton={false}>
					<Modal.Title iconLeft={<TrashIcon size={18} />}>Delete material?</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Stack gap="3">
						<Text size="2">Delete {label}? This can't be undone.</Text>
					</Stack>
				</Modal.Body>
				<Modal.Footer>
					<Flex justify="end" gap="2">
						<Button
							variant="ghost"
							color="neutral"
							onClick={() => onOpenChange(false)}
							disabled={deleteMaterial.isPending}
							className="cursor-pointer">
							Cancel
						</Button>
						<Button
							variant="outline"
							color="danger"
							onClick={handleDelete}
							loading={deleteMaterial.isPending}
							disabled={deleteMaterial.isPending}
							className="cursor-pointer">
							Delete
						</Button>
					</Flex>
				</Modal.Footer>
			</Modal.Content>
		</Modal.Root>
	);
};
