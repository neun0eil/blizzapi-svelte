import { credentials } from '$lib/config';
import { DiskStore } from 'cache-manager-fs-hash';
import { cache, REGIONS } from '$lib/global';

export class API {
	constructor(region) {
		this.region = region;
		return Promise.resolve().then(async () => {
			this.token = await this.getToken();
			this.cache = new DiskStore({
				path: `cache/${region}`,
				ttl: 86400000,
				zip: true
			});
			return this;
		});
	}

	async get(endpoint) {
		let data = await this.cache.get(endpoint);
		if (!data) {
			data = await fetch(REGIONS[this.region] + endpoint, {
				headers: { Authorization: 'Bearer ' + this.token }
			}).then(async (res) => (res.ok ? await res.json() : null));
			if (data) await this.cache.set(endpoint, data);
		}
		return data;
	}

	async getToken() {
		let token = await cache.get('token');
		if (!token) {
			token = await fetch('https://oauth.battle.net/token', {
				headers: {
					Authorization: `Basic ${btoa(`${credentials.clientId}:${credentials.clientSecret}`)}`,
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				method: 'POST',
				body: 'grant_type=client_credentials'
			}).then(async (res) => (res.ok ? (await res.json()).access_token : null));
			if (token) await cache.set('token', token);
		}
		return token;
	}
}

export class TZ {
	static async index() {
		let data = await cache.get('timezone');
		if (!data) {
			data = await fetch('https://worldtimeapi.org/api/timezone').then(async (res) =>
				res.ok ? res.json() : null
			);
			if (data) await cache.set('timezone', data);
		}
		return data;
	}

	static async get(tz) {
		let data = await cache.get(tz);
		if (!data) {
			data = await fetch('https://worldtimeapi.org/api/timezone/' + tz).then(async (res) =>
				res.ok ? res.json() : null
			);
			if (data) await cache.set(tz, data);
		}
		return data;
	}
}
