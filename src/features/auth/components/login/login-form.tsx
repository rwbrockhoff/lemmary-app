import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router';
import { TextField, Button, Text, Stack } from '@artifact-ui/core';
import { useLoginFlow } from './use-login-flow';
import { GoogleButton, OrDivider } from '../google-auth/google-button';
import { loginSchema, type LoginFormData } from '../../schemas/auth-schemas';

export const LoginForm = () => {
	const loginMutation = useLoginFlow();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});

	const errorMessage =
		loginMutation.error instanceof Error ? loginMutation.error.message : 'Login failed';

	const onSubmit = (data: LoginFormData) => {
		loginMutation.mutate(data);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Stack gap="4">
				<GoogleButton label="Sign in with Google" />
				<OrDivider />
				<TextField.Standalone
					type="email"
					placeholder="Email"
					autoFocus
					{...register('email')}
					error={
						errors.email
							? { error: true, message: errors.email.message ?? '' }
							: undefined
					}
				/>
				<TextField.Standalone
					type="password"
					placeholder="Password"
					{...register('password')}
					error={
						errors.password
							? { error: true, message: errors.password.message ?? '' }
							: undefined
					}
				/>
				{loginMutation.isError && (
					<Text size="2" color="danger">
						{errorMessage}
					</Text>
				)}
				<Button
					type="submit"
					loading={loginMutation.isPending}
					disabled={loginMutation.isPending}>
					Sign in
				</Button>
				<Text size="2">
					<Link to="/forgot-password">Forgot password?</Link>
				</Text>
				<Text size="2">
					Don't have an account? <Link to="/register">Sign up</Link>
				</Text>
			</Stack>
		</form>
	);
};
