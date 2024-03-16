import type { UserOverviewDto } from '$lib/user/models';
import { writable } from 'svelte/store';

export const userOverview = writable<UserOverviewDto | undefined>(undefined);
