import React, { useState } from 'react';
import { safeFetch } from './lib/safeFetch.js';
import { useToast } from './components/Toast.jsx';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import Skeleton from './components/Skeleton';
import WeatherBackground from './components/WeatherBackground';

export default function App() {
    const [city, setCity] = useState('Київ');
    const [payload, setPayload] = useState(null);
    const [loading, setLoading] = useState(false);
    const { push } = useToast();

    const w0 = payload?.weather?.[0];
    const temp = typeof payload?.main?.temp === 'number' ? payload.main.temp : null;
    const icon = w0?.icon || '';
    const main = w0?.main || '';

    async function onSubmit(e) {
        e.preventDefault();
        setLoading(true);
        const { ok, data, error } = await safeFetch(`/api/weather?city=${encodeURIComponent(city)}`);
        setLoading(false);

        if (!ok) {
            setPayload(null);
            push({
                type: 'error',
                title: 'Не вдалось отримати погоду',
                message: error.clientMessage || 'Спробуйте пізніше',
                hint: process.env.NODE_ENV !== 'production' ? `${error.code} • ${error.status}` : undefined
            });
            return;
        }
        setPayload(data);
    }

    async function onPickCoords(lat, lon) {
        setLoading(true);
        const { ok, data, error } = await safeFetch(`/api/weather/by-coords?lat=${lat}&lon=${lon}`);
        setLoading(false);

        if (!ok) {
            setPayload(null);
            push({
                type: 'error',
                title: 'Не вдалось отримати погоду',
                message: error.clientMessage || 'Спробуйте пізніше',
                hint: process.env.NODE_ENV !== 'production' ? `${error.code} • ${error.status}` : undefined
            });
            return;
        }
        setPayload(data);
    }

    return (
        <WeatherBackground main={main} icon={icon} temp={temp} rain1h={payload?.rain?.['1h'] ?? payload?.rain?.['3h'] ?? null}>
            <div className="mx-auto max-w-3xl px-4 py-12">
                <header className="mb-8 text-white">
                    <h1 className="text-4xl font-extrabold drop-shadow-sm text-glow">Погода</h1>
                    <p className="opacity-90">Поточні дані • кеш 10 хв • автодоповнення</p>
                </header>

                <SearchBar city={city} setCity={setCity} loading={loading} onSubmit={onSubmit} onPickCoords={onPickCoords} />

                {loading && <Skeleton />}

                {!loading && payload && <WeatherCard data={payload} source={payload.source} />}

                {!loading && !payload && (
                    <div className="text-white/90">Почніть з пошуку міста або виберіть з підказок.</div>
                )}

                <footer className="mt-12 text-white/80 text-sm">
                    Дані: OpenWeatherMap • Кеш: 10 хв • UI: Tailwind + анімації
                </footer>
            </div>
        </WeatherBackground>
    );
}
