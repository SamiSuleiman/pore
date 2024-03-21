import { env } from '$lib/env';
import { del, get, post, put } from '$lib/http';
import type { LinkDto, LinkPreviewDto, UpsertLinkDto } from './model';

const LINK_URL = `${env.baseUrl}/links`;

export async function getLinks(): Promise<LinkPreviewDto[] | undefined> {
	return get<LinkPreviewDto[]>(`${LINK_URL}`);
}

export async function getLink(id: string): Promise<LinkDto | undefined> {
	return get<LinkDto>(`${LINK_URL}/${id}`);
}

export async function addLink(link: UpsertLinkDto): Promise<boolean> {
	return post<UpsertLinkDto>(`${LINK_URL}`, link);
}

export async function updateLink(id: string, link: UpsertLinkDto): Promise<boolean> {
	return put<UpsertLinkDto>(`${LINK_URL}/${id}`, link);
}

export async function deleteLink(id: string): Promise<boolean> {
	return del(`${LINK_URL}/${id}`);
}
