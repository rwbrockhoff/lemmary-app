import type { FieldError } from 'react-hook-form';

// Extracts error message within React hook form

export const toFieldError = (error?: FieldError) =>
	error ? { error: true, message: error.message ?? '' } : undefined;

// Adds a field to an update payload only when it differs from the current value
export function setChanged<T, K extends keyof T>(
	target: T,
	key: K,
	value: T[K],
	original: T[K],
) {
	if (value !== original) target[key] = value;
}
