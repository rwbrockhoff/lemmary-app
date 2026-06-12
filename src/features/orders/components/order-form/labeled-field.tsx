import type { ReactNode } from 'react';
import { Stack, Text } from '@artifact-ui/core';

type LabeledFieldProps = {
	label: string;
	children: ReactNode;
	className?: string;
};

export const LabeledField = ({ label, children, className }: LabeledFieldProps) => (
	<Stack gap="1" className={className}>
		<Text size="2" color="secondary">
			{label}
		</Text>
		{children}
	</Stack>
);
