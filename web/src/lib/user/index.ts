import { env } from '$lib/env';
import { get } from '$lib/http';
import type { UserOverviewDto } from './models';

const USER_URL = `${env.baseUrl}/users`;

export async function getUserOverview(): Promise<UserOverviewDto> {
	return await get<UserOverviewDto>(`${USER_URL}/overview`);
}
