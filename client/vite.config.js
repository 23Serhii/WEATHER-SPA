import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Проксі на backend для /api
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            '/api': 'http://localhost:5000'
        }
    }
});
