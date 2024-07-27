import raiderio from '$lib/raiderio';

export async function load() {
	return {
		raiderio: await raiderio()
	};
}
