export default defineEventHandler((event) => {
    const path = getRequestURL(event).pathname;
    if (path.startsWith('/_nuxt') || path.startsWith('/api')) return;

    let sid = getCookie(event, 'sid');
    if (!sid) {
        sid = crypto.randomUUID();
        setCookie(event, 'sid', sid, {
            httpOnly: true,
            sameSite: 'lax',
            secure: !import.meta.dev,
            path: '/',
            maxAge: 60 * 60 * 24 * 30,
        });
    }

    event.context.sessionId = sid;
});