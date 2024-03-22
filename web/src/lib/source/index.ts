import { env } from '$lib/env';
import { del, get, post, put } from '$lib/http';
import { invalidateCache } from '$lib/invalidate';
import type { List } from '$lib/models';
import { isOutdated } from '../../stores/source.store';
import type { SourceDto, SourcePreviewDto, UpsertSourceDto } from './model';

const SOURCE_URL = `${env.baseUrl}/sources`;

export async function getSources(): Promise<List<SourcePreviewDto> | undefined> {
	const _res = await get<List<SourcePreviewDto>>(`${SOURCE_URL}`);
	if (_res) isOutdated.set(false);
	return _res;
}

export async function getSource(id: string): Promise<SourceDto | undefined> {
	return await get<SourceDto>(`${SOURCE_URL}/${id}`);
}

export async function addSource(source: UpsertSourceDto): Promise<boolean> {
	const _res = await post<UpsertSourceDto>(`${SOURCE_URL}`, source);
	if (_res) invalidateCache('source', 'word', 'profile');
	return _res;
}

export async function updateSource(id: string, source: UpsertSourceDto): Promise<boolean> {
	const _res = await put<UpsertSourceDto>(`${SOURCE_URL}/${id}`, source);
	if (_res) invalidateCache('source', 'word', 'profile');
	return _res;
}

export async function deleteSource(id: string): Promise<boolean> {
	const _res = await del(`${SOURCE_URL}/${id}`);
	if (_res) invalidateCache('source', 'word', 'profile');
	return _res;
}
