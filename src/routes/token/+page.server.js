import { API } from '$lib/api';

export async function load() {
	return {
		token: await getWowToken()
	};
}

async function getWowToken() {
	const api = await new API('eu');
	return await api.get(`/data/wow/token/index?namespace=dynamic-eu`);
}
