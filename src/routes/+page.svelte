<script>
	import { DateTime } from 'luxon';
	export let data;

	const getRegion = (url) => new URL(url).searchParams.get('namespace').split('-')[1].toUpperCase();
	const getTZ = (tz) => {
		const date = DateTime.now().setZone(tz);
		let offset = Number(date.toFormat('Z'));
		if (date.isInDST) offset--;
		return offset;
	};

	$: realms = data.connectedRealms
		.map((cr) => cr.realms)
		.flat()
		.sort((a, b) => a.id - b.id);

	$: realmData = realms
		.map((realm) => {
			const locale = (() => {
				let locale = realm.locale.match(/.{2}/g).join('_');
				return locale in realm.name
					? locale
					: Object.keys(realm.name).find((i) => i.substring(0, 2) === locale.substring(0, 2));
			})();
			const name = realm.name[locale];
			const rules = realm.type.type;
			const region = getRegion(realm.region.key.href);
			// const timezone = data.timezones.find((i) => i.timezone === realm.timezone).abbreviation;
			const timezone = getTZ(realm.timezone);
			const array = [name, rules, realm.locale, region, timezone];
			if (realm.name[locale].toLowerCase() !== realm.name.en_US.toLowerCase())
				array.push(realm.name.en_US);
			return `[${realm.id}]="${array.join()}"`;
		})
		.join(',\n');

	$: connectionData = data.connectedRealms
		.sort((a, b) => a.id - b.id)
		.map((cr) => {
			const region = getRegion(cr.auctions.href);
			const realms = cr.realms.map((r) => r.id);
			const array = [cr.id, region, ...realms];
			return `"${array.join()}"`;
		})
		.join(',\n');
</script>

<pre><textarea
		>realmData = &lbrace;
{realmData}
&rbrace;

connectionData = &lbrace;
{connectionData}
&rbrace;</textarea
	></pre>
