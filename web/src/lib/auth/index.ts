import { env } from '$lib/env';
import type { AuthCookie } from './models';

const TOKEN_KEY = 'PORE_TOKEN';

export function navigateGithubToOAuth() {
	// window.location.href = `${env.baseUrl}/auth/github`;
	console.log(env.baseUrl);
}

export function login() {
	const _urlTokens = extractTokensFromUrl();
	const _cookieTokens = extractTokensFromCookie();

	if (!_urlTokens && !_cookieTokens) return;
	if (_urlTokens) setTokensInCookie(_urlTokens);

	// this.$isLoggedIn.set(true);
	// this.router.navigate(['/home']);
}

export function logout() {}
export function refresh() {}

export function extractTokensFromUrl(): AuthCookie | undefined {
	const _url = new URL(window.location.href);
	const _data = _url.searchParams.get('data');

	if (!_data) return undefined;

	const _tokens = JSON.parse(_data);
	return _tokens;
}

export function extractTokensFromCookie(): AuthCookie | undefined {
	const _tokensString = document.cookie
		.split(';')
		.find((cookie) => {
			const [key] = cookie.split('=');
			return key.trim() === TOKEN_KEY;
		})
		?.split('=')[1];

	if (!_tokensString) return undefined;

	const _tokens: AuthCookie = JSON.parse(_tokensString);
	return _tokens;
}

export function setTokensInCookie(tokens: AuthCookie) {
	document.cookie = `${TOKEN_KEY}=${JSON.stringify(tokens)}`;
}
