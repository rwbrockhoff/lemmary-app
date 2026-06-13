import { describe, it, expect } from 'vitest';
import type { FieldError } from 'react-hook-form';
import { toFieldError } from '../forms';

describe('toFieldError', () => {
	it('returns undefined when there is no error', () => {
		expect(toFieldError(undefined)).toBeUndefined();
	});

	it('maps a field error to the TextField error shape', () => {
		const error: FieldError = { type: 'required', message: 'Required' };
		expect(toFieldError(error)).toEqual({ error: true, message: 'Required' });
	});

	it('falls back to an empty message when the error has none', () => {
		const error: FieldError = { type: 'required' };
		expect(toFieldError(error)).toEqual({ error: true, message: '' });
	});
});
