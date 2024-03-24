import { env } from '$lib/env';
import { del, get, post, put } from '$lib/http';
import { invalidateCache } from '$lib/invalidate';
import type { FilterDto, List } from '$lib/models';
import { isOutdated } from '../../stores/link.store';
import type { LinkDto, LinkPreviewDto, UpsertLinkDto } from './model';

const LINK_URL = `${env.baseUrl}/links`;

export async function getLinks(filter?: FilterDto): Promise<List<LinkPreviewDto> | undefined> {
	const _url =
		`${LINK_URL}?` +
		new URLSearchParams({
			filter: JSON.stringify({
				page: filter?.page ?? 0,
				pageSize: filter?.pageSize ?? 10,
			}),
		});

	const _res = await get<List<LinkPreviewDto>>(_url);
	if (_res) isOutdated.set(false);
	return _res;
}

export async function getLink(id: string): Promise<LinkDto | undefined> {
	return await get<LinkDto>(`${LINK_URL}/${id}`);
}

export async function addLink(link: UpsertLinkDto): Promise<boolean> {
	const _res = await post<UpsertLinkDto>(`${LINK_URL}`, link);
	if (_res) invalidateCache('link', 'profile');
	return _res;
}

export async function updateLink(id: string, link: UpsertLinkDto): Promise<boolean> {
	const _res = await put<UpsertLinkDto>(`${LINK_URL}/${id}`, link);
	if (_res) invalidateCache('link', 'profile');
	return _res;
}

export async function deleteLink(id: string): Promise<boolean> {
	const _res = await del(`${LINK_URL}/${id}`);
	if (_res) invalidateCache('link', 'profile');
	return _res;
}
