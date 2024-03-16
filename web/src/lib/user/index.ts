import { env } from '$lib/env';
import { get } from '$lib/http';
import { userOverview } from '../../stores/user.store';
import type { UserOverviewDto } from './models';

const USER_URL = `${env.baseUrl}/users`;

export async function getUserOverview(): Promise<void> {
	const _overview = await get<UserOverviewDto>(`${USER_URL}/overview`);
	userOverview.set(_overview);
}
