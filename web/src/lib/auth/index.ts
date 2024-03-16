import { goto } from '$app/navigation';
import { env } from '$lib/env';
import { get } from '$lib/http';
import { isLoggedIn } from '../../stores/auth.store';
import type { AuthCookie } from './models';

const TOKEN_KEY = 'PORE_TOKENS';
const AUTH_URL = `${env.baseUrl}/auth`;

export function navigateToGithubOAuth(): void {
	window.location.href = AUTH_URL + '/github';
}

export function navigateToGoogleOAuth(): void {
	window.location.href = AUTH_URL + '/google';
}

export function login(): void {
	const _urlTokens = extractTokensFromUrl();
	const _cookieTokens = extractTokensFromCookie();

	if (!_urlTokens && !_cookieTokens) return;
	if (_urlTokens) setTokensInCookie(_urlTokens);

	isLoggedIn.set(true);
	goto('/');
}

export function logout(): void {
	document.cookie = `${TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
	isLoggedIn.set(false);
}

export async function refresh(): Promise<void> {
	const _tokens = extractTokensFromCookie();
	if (!_tokens) return;
	const _refreshed = await get<AuthCookie>(`${AUTH_URL}/refresh`);
	setTokensInCookie(_refreshed);
}

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

export function setTokensInCookie(tokens: AuthCookie): void {
	document.cookie = `${TOKEN_KEY}=${JSON.stringify(tokens)}`;
}
