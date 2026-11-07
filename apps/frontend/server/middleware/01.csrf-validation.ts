import CsrfToken from "~/types/csrf-token";

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

export default defineEventHandler(async (event) => {
    const path = getRequestURL(event).pathname;
    if (path.startsWith('/api') === false) return;
    if (SAFE_METHODS.has(event.method) === true) return;

    const sessionId = getCookie(event, 'sid');
    const headerToken = getHeader(event, 'x-csrf-token');

    if (!sessionId || !headerToken) {
        throw createError({ statusCode: 403, statusMessage: 'Missing CSRF token' });
    }

    const redis = useRedis();
    const stored = await redis.get(`csrf:${sessionId}`);

    if (stored === null) {
        throw createError({ statusCode: 403, statusMessage: 'CSRF token expired' });
    }

    const { token, expiresAt } = JSON.parse(stored) as CsrfToken;

    if (Date.now() > expiresAt || token !== headerToken) {
        throw createError({ statusCode: 403, statusMessage: 'Invalid CSRF token' });
    }
});