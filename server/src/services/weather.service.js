import { http } from '../lib/http.js';

const BASE = 'https://api.openweathermap.org';

export async function fetchWeatherByCity({ city, apiKey }) {
    const { data } = await http.get(`${BASE}/data/2.5/weather`, {
        params: { q: city, appid: apiKey, units: 'metric', lang: 'uk' }
    });
    return data;
}

export async function fetchWeatherByCoords({ lat, lon, apiKey }) {
    const { data } = await http.get(`${BASE}/data/2.5/weather`, {
        params: { lat, lon, appid: apiKey, units: 'metric', lang: 'uk' }
    });
    return data;
}
