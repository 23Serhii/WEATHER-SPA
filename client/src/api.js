export async function fetchWeather(city) {
    const r = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(data.error || 'Помилка отримання даних');
    return data;
}
