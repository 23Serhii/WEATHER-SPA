import { http } from '../lib/http.js';

// Геокодинг Open-Meteo (без ключа)
export async function omGeocode(name, limit = 1, language = 'uk') {
  const { data } = await http.get('https://geocoding-api.open-meteo.com/v1/search', {
    params: { name, count: limit, language }
  });
  return (data?.results || []).map(i => ({
    name: i.name,
    state: i.admin1 || null,
    country: i.country || null,
    lat: i.latitude,
    lon: i.longitude
  }));
}

// Поточна погода Open-Meteo (без ключа)
export async function omCurrent(lat, lon, timezone = 'auto') {
  const params = {
    latitude: lat,
    longitude: lon,
    current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code',
    timezone
  };
  const { data } = await http.get('https://api.open-meteo.com/v1/forecast', { params });
  return data?.current || null;
}

// Мапа WMO weather_code → { main, description }
export function mapWmo(code) {
  const c = Number(code);
  if ([0].includes(c)) return { main: 'Clear',        description: 'ясно' };
  if ([1,2,3].includes(c)) return { main: 'Clouds',       description: 'мінлива хмарність' };
  if ([45,48].includes(c)) return { main: 'Mist',         description: 'туман/мряка' };
  if ([51,53,55,56,57].includes(c)) return { main: 'Drizzle',      description: 'мряка' };
  if ([61,63,65,66,67].includes(c)) return { main: 'Rain',         description: 'дощ' };
  if ([71,73,75,77].includes(c)) return { main: 'Snow',         description: 'сніг' };
  if ([80,81,82].includes(c)) return { main: 'Rain',         description: 'зливи' };
  if ([85,86].includes(c)) return { main: 'Snow',         description: 'снігопад' };
  if ([95,96,99].includes(c)) return { main: 'Thunderstorm', description: 'гроза' };
  return { main: 'Atmosphere', description: 'атмосферні явища' };
}
