import { Router } from 'express';
import { suggestCache } from '../lib/cache.js';
import { normalizeCity } from '../utils/normalize.js';
import { suggestCities } from '../services/suggest.service.js';

const router = Router();
const { OWM_API_KEY } = process.env;

router.get('/', async (req, res, next) => {
    try {
        const qRaw = `${req.query.q || ''}`.trim();
        if (qRaw.length < 2) return res.json([]);

        const key = `suggest:${normalizeCity(qRaw)}`;
        const hit = suggestCache.get(key);
        if (hit) return res.json(hit);

        const API_KEY = process.env.OWM_API_KEY; // ← тут

        const list = await suggestCities({ q: qRaw, apiKey: API_KEY, limit: 7 });
        suggestCache.set(key, list);
        return res.json(list);
    } catch (e) { next(e); }
});


export default router;
