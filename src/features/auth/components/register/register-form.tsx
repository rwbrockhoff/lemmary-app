import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router';
import { TextField, Button, Heading, Text, Stack } from '@artifact-ui/core';
import { useRegisterFlow } from './use-register-flow';
import { RegisterSuccess } from './register-success';
import { GoogleButton, OrDivider } from '../google-auth/google-button';
import { registerSchema, type RegisterFormData } from '../../schemas/auth-schemas';

export const RegisterForm = () => {
	const registerMutation = useRegisterFlow();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
	});

	if (registerMutation.isSuccess && registerMutation.data) {
		return <RegisterSuccess email={registerMutation.data.email} />;
	}

	const errorMessage =
		registerMutation.error instanceof Error
			? registerMutation.error.message
			: 'Registration failed';

	const onSubmit = (data: RegisterFormData) => {
		registerMutation.mutate(data);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Stack gap="4" className="w-72">
				<Heading size="5">Create your account</Heading>
				<GoogleButton label="Sign up with Google" />
				<OrDivider />
				<TextField.Standalone
					type="text"
					placeholder="First name"
					autoFocus
					{...register('firstName')}
					error={
						errors.firstName
							? { error: true, message: errors.firstName.message ?? '' }
							: undefined
					}
				/>
				<TextField.Standalone
					type="text"
					placeholder="Last name"
					{...register('lastName')}
					error={
						errors.lastName
							? { error: true, message: errors.lastName.message ?? '' }
							: undefined
					}
				/>
				<TextField.Standalone
					type="email"
					placeholder="Email"
					{...register('email')}
					error={
						errors.email
							? { error: true, message: errors.email.message ?? '' }
							: undefined
					}
				/>
				<TextField.Standalone
					type="password"
					placeholder="Password (min 8 characters)"
					{...register('password')}
					error={
						errors.password
							? { error: true, message: errors.password.message ?? '' }
							: undefined
					}
				/>
				{registerMutation.isError && (
					<Text size="2" color="danger">
						{errorMessage}
					</Text>
				)}
				<Button type="submit" disabled={registerMutation.isPending}>
					{registerMutation.isPending ? 'Creating account...' : 'Sign up'}
				</Button>
				<Text size="2">
					Already have an account? <Link to="/login">Sign in</Link>
				</Text>
			</Stack>
		</form>
	);
};
