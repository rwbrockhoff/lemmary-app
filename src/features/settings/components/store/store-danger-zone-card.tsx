import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
	Heading,
	Text,
	TextField,
	Button,
	Card,
	Stack,
	Flex,
	Modal,
} from '@artifact-ui/core';
import { TrashIcon } from '@/components/icons';
import { useToast } from '@/providers/toast-context';
import { useDeleteStore, type Store } from '../../api/store-queries';

type StoreDangerZoneCardProps = {
	settings: Store;
};

export const StoreDangerZoneCard = ({ settings }: StoreDangerZoneCardProps) => {
	const navigate = useNavigate();
	const toast = useToast();
	const deleteStore = useDeleteStore();

	const [open, setOpen] = useState(false);
	const [confirmText, setConfirmText] = useState('');

	const canRemove = confirmText.trim() === settings.storeName;

	const handleOpenChange = (next: boolean) => {
		setConfirmText('');
		setOpen(next);
	};

	const handleRemove = () => {
		if (!canRemove) return;

		deleteStore.mutate(undefined, {
			onSuccess: () => {
				toast.success('Store removed');
				navigate('/connect-store');
			},
			onError: (error) => {
				toast.error(error.message, 'Could not remove store');
			},
		});
	};

	return (
		<Card.Root>
			<Card.Header>
				<Heading size="4" color="danger">
					Danger Zone
				</Heading>
			</Card.Header>
			<Card.Body>
				<Stack gap="4">
					<Text size="2" color="secondary">
						Removing your store deletes all of its orders, materials, and BOM data. This
						can't be undone.
					</Text>
					<Flex>
						<Button
							variant="outline"
							color="danger"
							iconLeft={<TrashIcon size={14} />}
							onClick={() => setOpen(true)}
							className="cursor-pointer">
							Remove store
						</Button>
					</Flex>
				</Stack>
			</Card.Body>

			<Modal.Root open={open} onOpenChange={handleOpenChange}>
				<Modal.Content variant="simple" size="1" ariaDescription="Confirm store removal">
					<Modal.Header showCloseButton={false}>
						<Modal.Title iconLeft={<TrashIcon size={18} />}>Remove store</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{/* Temp inset so the input focus ring clears the modal clip, see real-world-fixes */}
						<Stack gap="4" className="p-1">
							<Text size="2">
								This deletes everything tied to your store and can't be undone. Type the
								store name below to confirm.
							</Text>
							<Text size="2" weight="bold">
								{settings.storeName}
							</Text>
							<TextField.Standalone
								value={confirmText}
								onChange={(e) => setConfirmText(e.target.value)}
								placeholder="Type the store name"
								autoFocus
							/>
						</Stack>
					</Modal.Body>
					<Modal.Footer>
						<Flex justify="end" gap="2">
							<Button
								variant="ghost"
								color="neutral"
								onClick={() => handleOpenChange(false)}
								disabled={deleteStore.isPending}
								className="cursor-pointer">
								Cancel
							</Button>
							<Button
								variant="outline"
								color="danger"
								iconLeft={<TrashIcon size={14} />}
								onClick={handleRemove}
								loading={deleteStore.isPending}
								disabled={!canRemove || deleteStore.isPending}
								className="cursor-pointer">
								Remove store
							</Button>
						</Flex>
					</Modal.Footer>
				</Modal.Content>
			</Modal.Root>
		</Card.Root>
	);
};
