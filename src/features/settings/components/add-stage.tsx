import { useState } from 'react';
import { Button, Flex, TextField } from '@artifact-ui/core';
import { PlusIcon } from '@/components/icons';
import { useToast } from '@/providers/toast-context';
import { useCreateWorkflowStage } from '@/features/orders/api/orders-queries';

export const AddStage = () => {
	const toast = useToast();
	const createStage = useCreateWorkflowStage();
	const [name, setName] = useState('');

	const handleAdd = () => {
		const trimmed = name.trim();
		if (trimmed.length === 0) return;

		createStage.mutate(
			{ name: trimmed },
			{
				onSuccess: () => {
					setName('');
					toast.success('Stage added');
				},
				onError: (error) => toast.error(error.message, 'Could not add stage'),
			},
		);
	};

	return (
		<Flex gap="3" align="center">
			<TextField.Standalone
				placeholder="New stage name..."
				value={name}
				onChange={(e) => setName(e.target.value)}
			/>
			<Button
				size="2"
				onClick={handleAdd}
				disabled={name.trim().length === 0 || createStage.isPending}
				iconLeft={<PlusIcon size={16} />}
				className="cursor-pointer">
				Add
			</Button>
		</Flex>
	);
};
