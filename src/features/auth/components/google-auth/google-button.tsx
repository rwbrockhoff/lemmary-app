import styles from './google-button.module.css';

const buildGoogleAuthUrl = () => {
	const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
	if (!supabaseUrl) {
		throw new Error('VITE_SUPABASE_URL is not configured');
	}
	const redirectTo = `${window.location.origin}/auth/callback`;
	return `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectTo)}`;
};

const GoogleIcon = () => (
	<svg width="18" height="18" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z"
			fill="#4285F4"
		/>
		<path
			d="M10 20c2.7 0 4.96-.89 6.62-2.42l-3.16-2.45c-.85.57-1.96.97-3.46.97-2.65 0-4.89-1.79-5.69-4.19H1.05v2.5C2.7 17.74 6.07 20 10 20z"
			fill="#34A853"
		/>
		<path
			d="M4.31 11.91c-.2-.62-.32-1.28-.32-1.91 0-.63.11-1.29.32-1.91V5.59H1.05C.38 6.91 0 8.41 0 10s.38 3.09 1.05 4.41l3.26-2.5z"
			fill="#FBBC04"
		/>
		<path
			d="M10 3.9c1.49 0 2.79.51 3.83 1.5l2.85-2.85C14.96.99 12.7 0 10 0 6.07 0 2.7 2.26 1.05 5.59L4.31 8.09C5.11 5.69 7.35 3.9 10 3.9z"
			fill="#EA4335"
		/>
	</svg>
);

type GoogleButtonProps = {
	label?: string;
};

export const GoogleButton = ({ label = 'Continue with Google' }: GoogleButtonProps) => {
	const handleClick = () => {
		window.location.href = buildGoogleAuthUrl();
	};

	return (
		<button type="button" className={styles.button} onClick={handleClick}>
			<GoogleIcon />
			{label}
		</button>
	);
};

export const OrDivider = ({ text = 'or' }: { text?: string }) => (
	<div className={styles.divider}>{text}</div>
);
