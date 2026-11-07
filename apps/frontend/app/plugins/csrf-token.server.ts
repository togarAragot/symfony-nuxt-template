import { useRedis } from '~~/server/utils/redis';
import type CsrfToken from '~/types/csrf-token';

const TTL_SECONDS = 60 * 60;
const SESSION_COOKIE = 'sid';

export default defineNuxtPlugin(async () => {
    const redis = useRedis();

    const csrfToken = useState<CsrfToken | null>('csrf-token', () => null);

    const sessionId = useCookie(SESSION_COOKIE).value;
    if (!sessionId) return;

    const key = `csrf:${sessionId}`;
    const stored = await redis.get(key);

    if (stored !== null) {
        csrfToken.value = JSON.parse(stored) as CsrfToken;
        return;
    }

    const csrf: CsrfToken = {
        token: crypto.randomUUID(),
        expiresAt: Date.now() + TTL_SECONDS * 1000,
    };

    await redis.set(key, JSON.stringify(csrf), 'EX', TTL_SECONDS);
    csrfToken.value = csrf;
});