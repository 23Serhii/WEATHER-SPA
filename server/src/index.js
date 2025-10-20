// ЯВНО вантажимо server/.env незалежно від робочого каталогу
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

import { createServer } from 'http';
import app from './app.js';

const PORT = process.env.PORT || 5000;
const server = createServer(app);

server.listen(PORT, () => {
    const key = process.env.OWM_API_KEY || '';
    console.log(`🚀 Backend: http://localhost:${PORT} | OWM key: ${key ? key.slice(0,4)+'***' : 'MISSING'}`);
});
