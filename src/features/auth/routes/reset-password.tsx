import { AuthLayout } from '@/features/auth/components/auth-layout';
import { ResetPasswordForm } from '@/features/auth/components/reset-password/reset-password-form';

const ResetPasswordPage = () => {
	return (
		<AuthLayout>
			<ResetPasswordForm />
		</AuthLayout>
	);
};

export default ResetPasswordPage;
