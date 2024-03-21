import { env } from '$lib/env';
import { del, get, post, put } from '$lib/http';
import { invalidateCache } from '$lib/invalidate';
import { isOutdated } from '../../stores/link.store';
import type { LinkDto, LinkPreviewDto, UpsertLinkDto } from './model';

const LINK_URL = `${env.baseUrl}/links`;

export async function getLinks(): Promise<LinkPreviewDto[] | undefined> {
	const _res = await get<LinkPreviewDto[]>(`${LINK_URL}`);
	if (_res) isOutdated.set(false);
	return _res;
}

export async function getLink(id: string): Promise<LinkDto | undefined> {
	return await get<LinkDto>(`${LINK_URL}/${id}`);
}

export async function addLink(link: UpsertLinkDto): Promise<boolean> {
	const _res = await post<UpsertLinkDto>(`${LINK_URL}`, link);
	if (_res) invalidateCache('link', 'word', 'profile');
	return _res;
}

export async function updateLink(id: string, link: UpsertLinkDto): Promise<boolean> {
	const _res = await put<UpsertLinkDto>(`${LINK_URL}/${id}`, link);
	if (_res) invalidateCache('link', 'word', 'profile');
	return _res;
}

export async function deleteLink(id: string): Promise<boolean> {
	const _res = await del(`${LINK_URL}/${id}`);
	if (_res) invalidateCache('link', 'word', 'profile');
	return _res;
}
