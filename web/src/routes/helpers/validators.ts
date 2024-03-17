// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function required(value: any) {
	return value !== undefined && value !== null && value !== '' && value !== 0 && value !== false;
}
