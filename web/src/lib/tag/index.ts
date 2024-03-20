import { env } from '$lib/env';
import { del, get, post, put } from '$lib/http';
import { type UpsertTagDto, type TagDto, type TagPreviewDto } from './model';

const TAGS_URL = `${env.baseUrl}/tags`;

export async function getTags(): Promise<TagPreviewDto[] | undefined> {
	return get<TagPreviewDto[]>(`${TAGS_URL}`);
}

export async function getTag(id: string): Promise<TagDto | undefined> {
	return get<TagDto>(`${TAGS_URL}/${id}`);
}

export async function addTag(tag: UpsertTagDto): Promise<boolean> {
	return post<UpsertTagDto>(`${TAGS_URL}`, tag);
}

export async function updateTag(id: string, tag: UpsertTagDto): Promise<boolean> {
	return put<UpsertTagDto>(`${TAGS_URL}/${id}`, tag);
}

export async function deleteTag(id: string): Promise<boolean> {
	return del(`${TAGS_URL}/${id}`);
}
