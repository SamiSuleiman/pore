export function getPages(pageSize: number, count: number): { name: string }[] {
	const pages = Math.ceil(count / pageSize);
	const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1);
	return pageNumbers.map((page) => ({
		name: page.toString(),
	}));
}
