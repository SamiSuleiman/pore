import { env } from '$lib/env';
import { del, get, post, put } from '$lib/http';
import { invalidateCache } from '$lib/invalidate';
import type { FilterDto, List } from '$lib/models';
import { type AddWordDto, type UpdateWordDto, type WordDto, type WordPreviewDto } from './model';

const WORDS_URL = `${env.baseUrl}/words`;

export async function getWords(filter?: FilterDto): Promise<List<WordPreviewDto> | undefined> {
	const _url =
		`${WORDS_URL}?` +
		new URLSearchParams({
			filter: JSON.stringify({
				page: filter?.page ?? 0,
				pageSize: filter?.pageSize ?? 10,
			}),
		});
	const _res = await get<List<WordPreviewDto>>(_url);
	return _res;
}

export async function getWord(id: string): Promise<WordDto | undefined> {
	return await get<WordDto>(`${WORDS_URL}/${id}`);
}

export async function addWord(word: AddWordDto): Promise<boolean> {
	const _res = await post<AddWordDto>(`${WORDS_URL}`, word);
	if (_res) invalidateCache('profile', 'link');
	return _res;
}

export async function updateWord(id: string, word: UpdateWordDto): Promise<boolean> {
	const _res = await put<UpdateWordDto>(`${WORDS_URL}/${id}`, word);
	if (_res) invalidateCache('profile', 'link');
	return _res;
}

export async function deleteWord(id: string): Promise<boolean> {
	const _res = await del(`${WORDS_URL}/${id}`);
	if (_res) invalidateCache('profile', 'link');
	return _res;
}
