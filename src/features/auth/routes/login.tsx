import { AuthLayout } from '@/features/auth/components/auth-layout';
import { LoginForm } from '@/features/auth/components/login/login-form';

const LoginPage = () => {
	return (
		<AuthLayout>
			<LoginForm />
		</AuthLayout>
	);
};

export default LoginPage;
