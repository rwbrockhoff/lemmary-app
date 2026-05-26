import { Flex, Button } from '@artifact-ui/core';

type FormActionsProps = {
	onCancel: () => void;
	onConfirm: () => void;
	confirmLabel: string;
	pendingLabel: string;
	isPending?: boolean;
	disabled?: boolean;
};

export const FormActions = ({
	onCancel,
	onConfirm,
	confirmLabel,
	pendingLabel,
	isPending = false,
	disabled = false,
}: FormActionsProps) => {
	return (
		<Flex gap="3" align="center">
			<Button variant="outline" onClick={onCancel}>
				Cancel
			</Button>
			<Button onClick={onConfirm} disabled={disabled || isPending}>
				{isPending ? pendingLabel : confirmLabel}
			</Button>
		</Flex>
	);
};
