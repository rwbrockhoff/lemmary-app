import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router';
import { TextField, Button, Heading, Text, Stack } from '@artifact-ui/core';
import { useResetPasswordFlow } from './use-reset-password-flow';
import { ResetPasswordSuccess } from './reset-password-success';
import {
	resetPasswordSchema,
	type ResetPasswordFormData,
} from '../../schemas/auth-schemas';
import { extractErrorMessage } from '@/utils/errors';
import { toFieldError } from '@/utils/forms';

export const ResetPasswordForm = () => {
	const [accessToken] = useState<string | null>(() => {
		const hash = window.location.hash.slice(1);
		const params = new URLSearchParams(hash);
		return params.get('access_token');
	});
	const mutation = useResetPasswordFlow();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ResetPasswordFormData>({
		resolver: zodResolver(resetPasswordSchema),
	});

	if (mutation.isSuccess) {
		return <ResetPasswordSuccess />;
	}

	if (!accessToken) {
		return (
			<Stack gap="4">
				<Heading size="5">Invalid reset link</Heading>
				<Text size="2">
					This reset link is missing or invalid. Try requesting a new one.
				</Text>
				<Text size="2">
					<Link to="/forgot-password">Request a new link</Link>
				</Text>
			</Stack>
		);
	}

	const errorMessage = extractErrorMessage(mutation.error);

	const onSubmit = (data: ResetPasswordFormData) => {
		mutation.mutate({ accessToken, newPassword: data.newPassword });
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Stack gap="4">
				<Heading size="5">Set a new password</Heading>
				<TextField.Standalone
					type="password"
					placeholder="New password (min 8 characters)"
					autoFocus
					{...register('newPassword')}
					error={toFieldError(errors.newPassword)}
				/>
				{mutation.isError && (
					<Text size="2" color="danger">
						{errorMessage}
					</Text>
				)}
				<Button type="submit" loading={mutation.isPending} disabled={mutation.isPending}>
					Update password
				</Button>
			</Stack>
		</form>
	);
};
