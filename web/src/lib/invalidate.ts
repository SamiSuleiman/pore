import { isOutdated as isProfileOutdated } from '../stores/user.store';
import { isOutdated as isTagOutdated } from '../stores/tag.store';
import { isOutdated as isLinkOutdated } from '../stores/link.store';
import { isOutdated as isSourceOutdated } from '../stores/source.store';

export type Cache = 'tag' | 'link' | 'source' | 'all' | 'profile';

export function invalidateCache(...caches: Cache[]) {
	caches.forEach((cache) => {
		switch (cache) {
			case 'tag':
				isTagOutdated.set(true);
				break;
			case 'link':
				isLinkOutdated.set(true);
				break;
			case 'source':
				isSourceOutdated.set(true);
				break;
			case 'all':
				isTagOutdated.set(true);
				isLinkOutdated.set(true);
				isSourceOutdated.set(true);
				break;
			case 'profile':
				isProfileOutdated.set(true);
				break;
		}
	});
}
