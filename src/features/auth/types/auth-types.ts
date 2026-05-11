export type AuthStatusResponse = {
	isAuthenticated: boolean;
	userId: string | null;
};

export type LoginResponse = {
	userId: string;
	email: string;
};
