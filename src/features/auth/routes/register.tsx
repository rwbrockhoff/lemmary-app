import { AuthLayout } from '@/features/auth/components/auth-layout';
import { RegisterForm } from '@/features/auth/components/register/register-form';

const RegisterPage = () => {
	return (
		<AuthLayout>
			<RegisterForm />
		</AuthLayout>
	);
};

export default RegisterPage;
