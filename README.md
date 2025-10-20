# Weather SPA (React + Node)

SPA з автодоповненням міст, кешем 10 хв, резервним провайдером, та візуальними ефектами погоди.

## Стек
- **Client**: React + Vite, Tailwind, кастомні SVG іконки, Canvas RainFX, toast-нотіфікації
- **Server**: Node + Express, OpenWeatherMap (primary) / Open-Meteo (fallback), NodeCache

## Швидкий старт
```bash
# 1) сервер
cp .env.example server/.env   # підстав свій OWM_API_KEY
cd server
npm i
npm run dev   # http://localhost:5000

# 2) клієнт
cd ../client
npm i
npm run dev   # http://localhost:5173
