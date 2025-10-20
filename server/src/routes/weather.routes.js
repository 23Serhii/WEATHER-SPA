import {Router} from 'express';
import axios from 'axios';
import {weatherCache} from '../lib/cache.js';
import {normalizeCity} from '../utils/normalize.js';
import {makeEtag} from '../utils/etag.js';
import {fetchWeatherByCity, fetchWeatherByCoords} from '../services/weather.service.js';
import {omGeocode, omCurrent, mapWmo} from '../services/fallback-openmeteo.service.js';

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        const rawCity = `${req.query.city || ''}`.trim();
        if (!rawCity) {
            res.status(400);
            throw new Error('Вкажіть параметр ?city=');
        }
        const key = `city:${normalizeCity(rawCity)}`;

        const hit = weatherCache.get(key);
        if (hit) {
            const etag = makeEtag(hit);
            res.set('ETag', etag);
            if (req.headers['if-none-match'] === etag) return res.status(304).end();
            return res.json({source: 'cache', ...hit});
        }

        const API_KEY = process.env.OWM_API_KEY;         // ← тут, у хендлері
        let payload;

        try {
            if (!API_KEY) throw new Error('NO_KEY');
            const data = await fetchWeatherByCity({city: rawCity, apiKey: API_KEY});
            payload = shapeWeatherOWM(data);
        } catch (e) {
            if (e?.message === 'NO_KEY' || (axios.isAxiosError(e) && [401, 403].includes(e.response?.status))) {
                const geo = (await omGeocode(rawCity, 1, 'uk'))?.[0];
                if (!geo) {
                    res.status(404);
                    throw new Error('Місто не знайдено');
                }
                const cur = await omCurrent(geo.lat, geo.lon);
                payload = shapeWeatherOM(geo, cur);
            } else {
                throw e;
            }
        }

        weatherCache.set(key, payload);
        res.set('ETag', makeEtag(payload));
        res.set('Cache-Control', 'public, max-age=60');
        return res.json({source: API_KEY ? 'live' : 'fallback', ...payload});
    } catch (e) {
        next(e);
    }
});

router.get('/by-coords', async (req, res, next) => {
    try {
        const lat = Number(req.query.lat);
        const lon = Number(req.query.lon);
        if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
            res.status(400);
            throw new Error('Необхідні числові параметри lat та lon');
        }

        const key = `coords:${lat.toFixed(3)},${lon.toFixed(3)}`;
        const hit = weatherCache.get(key);
        if (hit) {
            const etag = makeEtag(hit);
            res.set('ETag', etag);
            if (req.headers['if-none-match'] === etag) return res.status(304).end();
            return res.json({source: 'cache', ...hit});
        }

        const API_KEY = process.env.OWM_API_KEY;         // ← і тут
        let payload;

        try {
            if (!API_KEY) throw new Error('NO_KEY');
            const data = await fetchWeatherByCoords({lat, lon, apiKey: API_KEY});
            payload = shapeWeatherOWM(data);
        } catch (e) {
            if (e?.message === 'NO_KEY' || (axios.isAxiosError(e) && [401, 403].includes(e.response?.status))) {
                const cur = await omCurrent(lat, lon);
                payload = shapeWeatherOM({name: 'Вибрані координати', state: null, country: null}, cur);
            } else {
                throw e;
            }
        }

        weatherCache.set(key, payload);
        res.set('ETag', makeEtag(payload));
        res.set('Cache-Control', 'public, max-age=60');
        return res.json({source: API_KEY ? 'live' : 'fallback', ...payload});
    } catch (e) {
        next(e);
    }
});

function shapeWeatherOWM(data) {
    return {
        name: data.name,
        main: {temp: data.main?.temp ?? null, humidity: data.main?.humidity ?? null},
        wind: {speed: data.wind?.speed ?? null},
        weather: (data.weather || []).map(w => ({main: w.main, description: w.description, icon: w.icon})),
        rain: data.rain ?? null   //  ←  це нове
    };
}

function shapeWeatherOM(geo, cur) {
    const {main, description} = mapWmo(cur?.weather_code);
    return {
        name: [geo.name, geo.state, geo.country].filter(Boolean).join(', '),
        main: {temp: cur?.temperature_2m ?? null, humidity: cur?.relative_humidity_2m ?? null},
        wind: {speed: cur?.wind_speed_10m ?? null},
        weather: [{main, description, icon: null}]
    };
}

export default router;
