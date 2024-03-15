export async function get<T>(url: string) {
	return (
		await fetch(url, {
			method: 'GET',
			credentials: 'same-origin',
			headers: {
				'Content-Type': 'application/json',
			},
		})
	).json() as T;
}

export async function post(url: string, body: Record<string, unknown>) {
	return await fetch(url, {
		method: 'POST',
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	});
}

export async function del(url: string) {
	return await fetch(url, {
		method: 'DELETE',
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application/json',
		},
	});
}

export async function put(url: string, body: Record<string, unknown>) {
	return await fetch(url, {
		method: 'PUT',
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	});
}
