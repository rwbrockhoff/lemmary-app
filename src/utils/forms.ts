import type { FieldError } from 'react-hook-form';

// Extracts error message within React hook form

export const toFieldError = (error?: FieldError) =>
	error ? { error: true, message: error.message ?? '' } : undefined;
