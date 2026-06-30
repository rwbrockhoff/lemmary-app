/** Adds https:// when a URL is entered without a protocol */
export function ensureHttps(value: string): string {
	const trimmed = value.trim();
	if (trimmed === '') return '';
	return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

/** A real domain, not just a word (requires a dotted hostname like .com) */
export function isValidUrl(value: string): boolean {
	try {
		return new URL(value).hostname.includes('.');
	} catch {
		return false;
	}
}
