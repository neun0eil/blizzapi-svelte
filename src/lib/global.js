import { DiskStore } from 'cache-manager-fs-hash';

export const cache = new DiskStore({
	path: 'cache/global',
	ttl: 3600000,
	zip: true
});

export const REGIONS = {
	us: 'https://us.api.blizzard.com',
	eu: 'https://eu.api.blizzard.com',
	kr: 'https://kr.api.blizzard.com',
	tw: 'https://tw.api.blizzard.com'
	// cn: 'https://gateway.battlenet.com.cn'
};

export const NAMESPACES = ['dynamic-', 'dynamic-classic-'];
