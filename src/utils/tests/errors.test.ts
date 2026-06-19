import { describe, it, expect } from 'vitest';
import { extractErrorMessage } from '../errors';

describe('extractErrorMessage', () => {
	it('returns the message from an Error instance', () => {
		expect(extractErrorMessage(new Error('Request failed'))).toBe('Request failed');
	});

	it('returns the default fallback for non Error values', () => {
		expect(extractErrorMessage('a string')).toBe('Something went wrong');
		expect(extractErrorMessage(null)).toBe('Something went wrong');
		expect(extractErrorMessage(undefined)).toBe('Something went wrong');
	});

	it('uses a custom fallback when provided', () => {
		expect(extractErrorMessage({}, 'Login failed')).toBe('Login failed');
	});
});
