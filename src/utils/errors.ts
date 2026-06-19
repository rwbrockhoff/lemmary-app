// Avoids repetitive ternaries of extracting React form error messages

export const extractErrorMessage = (
	error: unknown,
	fallback = 'Something went wrong',
) => {
	return error instanceof Error ? error.message : fallback;
};
