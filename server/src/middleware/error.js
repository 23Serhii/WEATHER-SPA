// server/src/middleware/error.js
import { isAxiosError } from 'axios';

const SAFE_4XX = new Set([400, 401, 403, 404, 409, 422, 429]);

function buildErrorPayload(err, req) {
    // Вихідні дані
    let status = 500;
    let code = 'INTERNAL_ERROR';
    let message = 'Сталася несподівана помилка';
    let clientMessage = 'Щось пішло не так. Спробуйте ще раз.';

    // Axios upstream
    if (isAxiosError(err)) {
        status = err.response?.status || 502;
        code = status === 401 ? 'UPSTREAM_UNAUTHORIZED'
            : status === 404 ? 'UPSTREAM_NOT_FOUND'
                : 'UPSTREAM_ERROR';
        const upstreamMsg = err.response?.data?.message || err.message;
        message = upstreamMsg || message;

        // Краще пояснення для користувача
        if (status === 401) clientMessage = 'Ключ доступу до погодного сервісу недійсний.';
        else if (status === 404) clientMessage = 'Дані не знайдено для запиту.';
        else if (status === 429) clientMessage = 'Забагато запитів. Спробуйте трохи пізніше.';
        else clientMessage = 'Сервіс погоди тимчасово недоступний.';
    }

    // Проставлені у коді помилки
    if (err.status && Number.isInteger(err.status)) status = err.status;
    if (err.code) code = err.code;
    if (err.message) message = err.message;
    if (err.clientMessage) clientMessage = err.clientMessage;

    // Нормалізація статусу
    if (status < 400 || status > 599) status = 500;

    const payload = {
        error: {
            code,
            message,        // технічне
            clientMessage,  // дружнє для користувача
        },
        meta: {
            method: req.method,
            path: req.originalUrl,
            timestamp: new Date().toISOString(),
        }
    };

    // Для корисного дебага (але без секретів)
    if (isAxiosError(err)) {
        payload.error.details = {
            upstream: {
                status: err.response?.status || null,
                url: err.config?.url || null,
                method: err.config?.method?.toUpperCase() || null,
                params: err.config?.params || null,
            }
        };
    }

    return { status, payload };
}

export function notFound(req, res, next) {
    const err = new Error('Ресурс не знайдено');
    err.status = 404;
    err.code = 'NOT_FOUND';
    err.clientMessage = 'Сторінку не знайдено.';
    next(err);
}

export function errorHandler(err, req, res, next) {
    const { status, payload } = buildErrorPayload(err, req);
    // Кешувати помилки не треба
    res.set('Cache-Control', 'no-store');
    // Не розкриваємо стек у проді
    if (!SAFE_4XX.has(status) && process.env.NODE_ENV !== 'production') {
        payload.error.stack = err.stack;
    }
    res.status(status).json(payload);
}
