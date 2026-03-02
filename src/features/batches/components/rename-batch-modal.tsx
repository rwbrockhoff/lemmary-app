import { useState, useEffect } from 'react';
import { Modal, Button, TextField, Flex } from '@artifact-ui/core';
import { PencilIcon } from '@/components/icons/icons';

type RenameBatchModalProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	currentName: string;
	onRename: (name: string) => void;
	isPending: boolean;
};

export const RenameBatchModal = ({
	open,
	onOpenChange,
	currentName,
	onRename,
	isPending,
}: RenameBatchModalProps) => {
	const [name, setName] = useState(currentName);

	useEffect(() => {
		if (open) setName(currentName);
	}, [open, currentName]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const trimmed = name.trim();
		if (trimmed && trimmed !== currentName) {
			onRename(trimmed);
		}
	};

	return (
		<Modal.Root open={open} onOpenChange={onOpenChange}>
			<Modal.Content size="1" ariaDescription="Rename this batch">
				<Modal.Header>
					<Modal.Title>Rename Batch</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<form onSubmit={handleSubmit}>
						<TextField.Standalone
							label="Name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							autoFocus
						/>
					</form>
				</Modal.Body>
				<Modal.Footer>
					<Flex justify="end" gap="2">
						<Button
							variant="ghost"
							color="neutral"
							onClick={() => onOpenChange(false)}
						>
							Cancel
						</Button>
						<Button
							color="primary"
							iconLeft={<PencilIcon size={14} />}
							onClick={handleSubmit}
							loading={isPending}
							disabled={isPending || !name.trim() || name.trim() === currentName}
						>
							Rename
						</Button>
					</Flex>
				</Modal.Footer>
			</Modal.Content>
		</Modal.Root>
	);
};
