import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, TextField, Button, Text, Flex, Stack } from '@artifact-ui/core';
import { useToast } from '@/providers/toast-context';
import { extractErrorMessage } from '@/utils/errors';
import { toFieldError } from '@/utils/forms';
import { useChangeEmail } from '@/features/auth/api/auth-queries';
import {
	changeEmailSchema,
	type ChangeEmailFormData,
} from '@/features/auth/schemas/auth-schemas';

type ChangeEmailModalProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	currentEmail: string;
};

export const ChangeEmailModal = ({
	open,
	onOpenChange,
	currentEmail,
}: ChangeEmailModalProps) => {
	const toast = useToast();
	const mutation = useChangeEmail();
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<ChangeEmailFormData>({
		resolver: zodResolver(changeEmailSchema),
	});

	const handleOpenChange = (next: boolean) => {
		if (!next) {
			mutation.reset();
			reset();
		}
		onOpenChange(next);
	};

	const onSubmit = (data: ChangeEmailFormData) => {
		mutation.mutate(data, {
			onSuccess: () => {
				toast.success('Check your inbox to confirm your new email');
				handleOpenChange(false);
			},
		});
	};

	const errorMessage = extractErrorMessage(mutation.error);

	return (
		<Modal.Root open={open} onOpenChange={handleOpenChange}>
			<Modal.Content size="1" ariaDescription="Change your email">
				<Modal.Header>
					<Modal.Title>Change Email</Modal.Title>
				</Modal.Header>

				<form onSubmit={handleSubmit(onSubmit)}>
					<Modal.Body>
						<Stack gap="4">
							<Text size="2" color="primary">
								Your current email is {currentEmail}.
							</Text>
							<Text size="2" color="secondary">
								We'll send a confirmation link to the new address before the change takes
								effect.
							</Text>
							<TextField.Standalone
								type="email"
								placeholder="New email"
								autoComplete="email"
								autoFocus
								{...register('newEmail')}
								error={toFieldError(errors.newEmail)}
							/>
							<TextField.Standalone
								type="password"
								placeholder="Current password"
								autoComplete="current-password"
								{...register('currentPassword')}
								error={toFieldError(errors.currentPassword)}
							/>
							{mutation.isError && (
								<Text size="2" color="danger">
									{errorMessage}
								</Text>
							)}
						</Stack>
					</Modal.Body>

					<Modal.Footer>
						<Flex justify="end" gap="2">
							<Button
								type="button"
								variant="ghost"
								color="neutral"
								onClick={() => handleOpenChange(false)}
								disabled={mutation.isPending}>
								Cancel
							</Button>
							<Button
								type="submit"
								loading={mutation.isPending}
								disabled={mutation.isPending}>
								Send Confirmation
							</Button>
						</Flex>
					</Modal.Footer>
				</form>
			</Modal.Content>
		</Modal.Root>
	);
};
