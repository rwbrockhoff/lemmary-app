import { useState } from 'react';
import { Button, Flex, TextField } from '@artifact-ui/core';
import { PlusIcon } from '@/components/icons';
import { useToast } from '@/providers/toast-context';
import { useCreateWorkflowStage } from '@/features/orders/api/orders-queries';
import { StageColorPicker } from '@/features/orders/components/stage-color-picker';
import type { WorkflowStageColor } from '@/components/orders/stage-colors';

type AddStageProps = {
	defaultColor: WorkflowStageColor;
};

export const AddStage = ({ defaultColor }: AddStageProps) => {
	const toast = useToast();
	const createStage = useCreateWorkflowStage();
	const [name, setName] = useState('');
	const [color, setColor] = useState<WorkflowStageColor>(defaultColor);
	const [prevDefault, setPrevDefault] = useState(defaultColor);

	if (defaultColor !== prevDefault) {
		setPrevDefault(defaultColor);
		setColor(defaultColor);
	}

	const handleAdd = () => {
		const trimmed = name.trim();
		if (trimmed.length === 0) return;

		createStage.mutate(
			{ name: trimmed, color },
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
		<Flex gap="2" align="center">
			<StageColorPicker value={color} onChange={setColor} />
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
