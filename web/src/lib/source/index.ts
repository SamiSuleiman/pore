import { env } from '$lib/env';
import { del, get, post, put } from '$lib/http';
import type { SourceDto, SourcePreviewDto, UpsertSourceDto } from './model';

const SOURCE_URL = `${env.baseUrl}/sources`;

export async function getSources(): Promise<SourcePreviewDto[]> {
	return get<SourcePreviewDto[]>(`${SOURCE_URL}`);
}

export async function getSource(id: string): Promise<SourceDto> {
	return get<SourceDto>(`${SOURCE_URL}/${id}`);
}

export async function addSource(source: UpsertSourceDto): Promise<void> {
	post<UpsertSourceDto>(`${SOURCE_URL}`, source);
}

export async function updateSource(id: string, source: UpsertSourceDto): Promise<void> {
	put<UpsertSourceDto>(`${SOURCE_URL}/${id}`, source);
}

export async function deleteSource(id: string): Promise<void> {
	del(`${SOURCE_URL}/${id}`);
}
