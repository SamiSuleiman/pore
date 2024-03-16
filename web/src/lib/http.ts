export async function get<T>(url: string): Promise<T | undefined> {
	try {
		const _res = await fetch(url, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (!_res.ok) return undefined;

		return (await _res.json()) as T;
	} catch {
		return undefined;
	}
}

export async function post<T>(url: string, body: T): Promise<boolean> {
	try {
		return (
			await fetch(url, {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			})
		).ok;
	} catch {
		return false;
	}
}

export async function del(url: string): Promise<boolean> {
	try {
		return (
			await fetch(url, {
				method: 'DELETE',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
			})
		).ok;
	} catch {
		return false;
	}
}

export async function put<T>(url: string, body: T): Promise<boolean> {
	try {
		return (
			await fetch(url, {
				method: 'PUT',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			})
		).ok;
	} catch {
		return false;
	}
}
