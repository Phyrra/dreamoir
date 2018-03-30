export function isBlank(text: string) {
	return !text || text.trim().length === 0;
}