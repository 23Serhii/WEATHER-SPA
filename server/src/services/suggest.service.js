import { http } from '../lib/http.js';

const BASE = 'https://api.openweathermap.org';

export async function suggestCities({ q, apiKey, limit = 5 }) {
    const { data } = await http.get(`${BASE}/geo/1.0/direct`, {
        params: { q, limit, appid: apiKey }
    });
    return data.map((i) => ({
        name: i.name,
        state: i.state || null,
        country: i.country || null,
        lat: i.lat,
        lon: i.lon
    }));
}
