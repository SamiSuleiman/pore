import { env } from '$lib/env';
import { get } from '$lib/http';
import { isOutdated } from '../../stores/user.store';
import type { UserOverviewDto } from './models';

const USER_URL = `${env.baseUrl}/users`;

export async function getUserOverview(): Promise<UserOverviewDto | undefined> {
	const _res = await get<UserOverviewDto>(`${USER_URL}/overview`);
	if (_res) isOutdated.set(false);
	return _res;
}
