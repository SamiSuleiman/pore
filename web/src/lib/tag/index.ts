import { env } from '$lib/env';
import { del, get, post, put } from '$lib/http';
import type { FilterDto, List } from '$lib/models';
import { type UpsertTagDto, type TagDto, type TagPreviewDto } from './model';

const TAGS_URL = `${env.baseUrl}/tags`;

export async function getTags(filter?: FilterDto): Promise<List<TagPreviewDto> | undefined> {
	const _url =
		`${TAGS_URL}?` +
		new URLSearchParams({
			filter: JSON.stringify({
				page: filter?.page ?? 0,
				pageSize: filter?.pageSize ?? 10,
			}),
		});
	const _res = await get<List<TagPreviewDto>>(_url);
	return _res;
}

export async function getTag(id: string): Promise<TagDto | undefined> {
	return await get<TagDto>(`${TAGS_URL}/${id}`);
}

export async function addTag(tag: UpsertTagDto): Promise<boolean> {
	const _res = await post<UpsertTagDto>(`${TAGS_URL}`, tag);
	return _res;
}

export async function updateTag(id: string, tag: UpsertTagDto): Promise<boolean> {
	const _res = await put<UpsertTagDto>(`${TAGS_URL}/${id}`, tag);
	return _res;
}

export async function deleteTag(id: string): Promise<boolean> {
	const _res = await del(`${TAGS_URL}/${id}`);
	return _res;
}
