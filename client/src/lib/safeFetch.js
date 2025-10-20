export async function safeFetch(input, init) {
    try {
        const res = await fetch(input, init);
        const ct = res.headers.get('content-type') || '';
        const isJson = ct.includes('application/json');
        const body = isJson ? await res.json() : await res.text();

        if (!res.ok) {
            const apiErr = isJson && body?.error ? body.error : null;
            const error = {
                status: res.status,
                code: apiErr?.code || 'HTTP_ERROR',
                message: apiErr?.message || (typeof body === 'string' ? body : 'Помилка запиту'),
                clientMessage: apiErr?.clientMessage || mapHttpToClient(res.status),
            };
            return { ok: false, error };
        }

        if (body && body.error) {
            const e = body.error;
            return {
                ok: false,
                error: {
                    status: 200,
                    code: e.code || 'API_ERROR',
                    message: e.message || 'Помилка відповіді API',
                    clientMessage: e.clientMessage || 'Не вдалося виконати операцію.'
                }
            };
        }

        return { ok: true, data: body };
    } catch (e) {
        return {
            ok: false,
            error: {
                status: 0,
                code: 'NETWORK_ERROR',
                message: e?.message || 'Network error',
                clientMessage: 'Немає з’єднання або сервер недоступний.'
            }
        };
    }
}

function mapHttpToClient(status) {
    if (status === 401) return 'Неавторизовано. Перевірте доступ.';
    if (status === 403) return 'Доступ заборонено.';
    if (status === 404) return 'Не знайдено.';
    if (status === 422) return 'Некоректні дані.';
    if (status === 429) return 'Забагато запитів. Спробуйте пізніше.';
    if (status >= 500) return 'Серверна помилка. Спробуйте пізніше.';
    return 'Сталася помилка.';
}
