export interface InputValidator {
	fn: (value: string) => string;
	errMsg: string;
	isTouched: boolean;
}
