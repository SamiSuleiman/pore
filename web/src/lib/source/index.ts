import { env } from '$lib/env';
import { del, get, post, put } from '$lib/http';
import type { SourceDto, SourcePreviewDto, UpsertSourceDto } from './model';

const SOURCE_URL = `${env.baseUrl}/sources`;

export async function getSources(): Promise<SourcePreviewDto[] | undefined> {
	return get<SourcePreviewDto[]>(`${SOURCE_URL}`);
}

export async function getSource(id: string): Promise<SourceDto| undefined > {
	return get<SourceDto>(`${SOURCE_URL}/${id}`);
}

export async function addSource(source: UpsertSourceDto): Promise<boolean> {
	return post<UpsertSourceDto>(`${SOURCE_URL}`, source);
}

export async function updateSource(id: string, source: UpsertSourceDto): Promise<boolean> {
	return put<UpsertSourceDto>(`${SOURCE_URL}/${id}`, source);
}

export async function deleteSource(id: string): Promise<boolean> {
	return del(`${SOURCE_URL}/${id}`);
}
