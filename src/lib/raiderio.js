import { cache } from '$lib/global';

const regex = /window\.__RIO_INITIAL_DATA = (.*)$/gm;

export default async function () {
	let data = await cache.get('raiderio');
	if (!data) {
		data = await fetch('https://raider.io/realms').then(async (res) =>
			res.ok ? JSON.parse(eval(regex.exec(await res.text())[1])) : null
		);
		if (data) await cache.set('raiderio', data);
	}
	return data;
}
