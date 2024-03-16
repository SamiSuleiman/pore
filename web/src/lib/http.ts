export async function get<T>(url: string) {
	return (
		await fetch(url, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
		})
	).json() as T;
}

export async function post(url: string, body: Record<string, unknown>) {
	return await fetch(url, {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	});
}

export async function del(url: string) {
	return await fetch(url, {
		method: 'DELETE',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
	});
}

export async function put(url: string, body: Record<string, unknown>) {
	return await fetch(url, {
		method: 'PUT',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	});
}
