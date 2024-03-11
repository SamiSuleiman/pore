import { dev } from '$app/environment';

const _prodEnv : Env= {
	baseUrl: 'https://api.example.com'
}

const _devEnv : Env= {
	baseUrl: 'http://localhost:3000'
}

interface Env {
	baseUrl: string
}

export const env = dev ? _devEnv : _prodEnv
