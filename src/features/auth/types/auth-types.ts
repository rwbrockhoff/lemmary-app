export type AuthUser = {
	userId: string;
	email: string;
	firstName: string | null;
	lastName: string | null;
	avatarUrl: string | null;
	isDemo: boolean;
};

export type AuthStatusResponse = {
	isAuthenticated: boolean;
	user: AuthUser | null;
};

export type LoginResponse = {
	userId: string;
	email: string;
};

export type RegisterResponse = {
	userId: string;
	email: string;
	needsEmailConfirmation: boolean;
};
