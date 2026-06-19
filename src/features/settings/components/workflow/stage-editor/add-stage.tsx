import { useState } from 'react';
import { Button, Flex, TextField } from '@artifact-ui/core';
import { PlusIcon } from '@/components/icons';
import { StageColorPicker } from '@/features/orders/components/stage-color-picker';
import type { WorkflowStageColor } from '@/components/orders/stage-colors';

type AddStageProps = {
	defaultColor: WorkflowStageColor;
	onAdd: (name: string, color: WorkflowStageColor) => Promise<void>;
	isAdding: boolean;
};

export const AddStage = ({ defaultColor, onAdd, isAdding }: AddStageProps) => {
	const [name, setName] = useState('');
	const [color, setColor] = useState<WorkflowStageColor>(defaultColor);
	const [prevDefault, setPrevDefault] = useState(defaultColor);

	if (defaultColor !== prevDefault) {
		setPrevDefault(defaultColor);
		setColor(defaultColor);
	}

	const handleAdd = async () => {
		const trimmed = name.trim();
		if (trimmed.length === 0) return;

		try {
			await onAdd(trimmed, color);
			setName('');
		} catch {
			// keep the input so the user can retry (container toasts the error)
		}
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
				disabled={name.trim().length === 0 || isAdding}
				iconLeft={<PlusIcon size={16} />}
				className="cursor-pointer">
				Add
			</Button>
		</Flex>
	);
};
