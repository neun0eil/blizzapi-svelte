import { API, TZ } from '$lib/api';
import { REGIONS, NAMESPACES } from '$lib/global';

export async function load() {
	return {
		connectedRealms: await getConnectedRealms(),
		timezones: await getTimeZones()
	};
}

async function getConnectedRealms() {
	const connectedRealms = [];
	for await (const region of Object.keys(REGIONS)) {
		const api = await new API(region);
		for await (const namespace of NAMESPACES) {
			const index = await api.get(`/data/wow/connected-realm/index?namespace=${namespace}${region}`);
			if (index)
				await Promise.all(
					index.connected_realms.map(async ({ href }) => {
						const url = new URL(href);
						const connectedRealm = await api.get(url.pathname + url.search);
						if (connectedRealm) connectedRealms.push(connectedRealm);
					})
				);
		}
	}
	return connectedRealms;
}

async function getTimeZones() {
	const index = await TZ.index();
	if (index) return await Promise.all(index.map(async (tz) => await TZ.get(tz)));
}
