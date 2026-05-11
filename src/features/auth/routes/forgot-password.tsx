import { AuthLayout } from '@/features/auth/components/auth-layout';
import { ForgotPasswordForm } from '@/features/auth/components/forgot-password/forgot-password-form';

const ForgotPasswordPage = () => {
	return (
		<AuthLayout>
			<ForgotPasswordForm />
		</AuthLayout>
	);
};

export default ForgotPasswordPage;
