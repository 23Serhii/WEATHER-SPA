import React from 'react';
import StatChip from './StatChip';
import WeatherIcon from './WeatherIcon';

export default function WeatherCard({ data, source }) {
    const w = data.weather?.[0] || {};
    const isNight = (w.icon || '').endsWith('n');
    return (
        <div className="card p-6 text-white">
            <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                    <h2 className="text-2xl font-extrabold leading-tight">{data.name}</h2>
                    <div className="capitalize opacity-90">{w.description}</div>
                </div>
                <div className="text-white">
                    <WeatherIcon main={w.main} isNight={isNight} size={64} className="opacity-95" />
                </div>
            </div>

            <div className="flex items-end gap-6">
                <div className="text-6xl font-black leading-none drop-shadow-sm">
                    {data.main?.temp != null ? Math.round(data.main?.temp) : '—'}°C
                </div>
                <div className="text-xs px-2 py-1 rounded-full border border-white/30">
                    {source === 'cache' ? 'кеш (≤10 хв)' : source || 'live'}
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                <StatChip label="Вологість" value={data.main?.humidity} unit="%" />
                <StatChip label="Вітер" value={data.wind?.speed} unit=" м/с" />
                <StatChip label="Стан" value={w.main} />
            </div>
        </div>
    );
}
