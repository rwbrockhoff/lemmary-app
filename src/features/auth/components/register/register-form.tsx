import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router';
import { TextField, Button, Heading, Text, Stack } from '@artifact-ui/core';
import { useRegisterFlow } from './use-register-flow';
import { RegisterSuccess } from './register-success';
import { GoogleButton, OrDivider } from '../google-auth/google-button';
import { registerSchema, type RegisterFormData } from '../../schemas/auth-schemas';
import { extractErrorMessage } from '@/utils/errors';
import { toFieldError } from '@/utils/forms';

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

	const errorMessage = extractErrorMessage(registerMutation.error, 'Registration failed');

	const onSubmit = (data: RegisterFormData) => {
		registerMutation.mutate(data);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Stack gap="4">
				<Heading size="5">Create your account</Heading>
				<GoogleButton label="Sign up with Google" />
				<OrDivider />
				<TextField.Standalone
					type="text"
					placeholder="First name"
					autoFocus
					{...register('firstName')}
					error={toFieldError(errors.firstName)}
				/>
				<TextField.Standalone
					type="text"
					placeholder="Last name"
					{...register('lastName')}
					error={toFieldError(errors.lastName)}
				/>
				<TextField.Standalone
					type="email"
					placeholder="Email"
					{...register('email')}
					error={toFieldError(errors.email)}
				/>
				<TextField.Standalone
					type="password"
					placeholder="Password (min 8 characters)"
					{...register('password')}
					error={toFieldError(errors.password)}
				/>
				{registerMutation.isError && (
					<Text size="2" color="danger">
						{errorMessage}
					</Text>
				)}
				<Button
					type="submit"
					loading={registerMutation.isPending}
					disabled={registerMutation.isPending}>
					Sign up
				</Button>
				<Text size="2">
					Already have an account? <Link to="/login">Sign in</Link>
				</Text>
			</Stack>
		</form>
	);
};
