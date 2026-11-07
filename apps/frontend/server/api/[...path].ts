export default defineEventHandler((event) => {
    const { apiProxyTarget, apiBasicUser, apiBasicPassword } = useRuntimeConfig(event);
    const url = getRequestURL(event);

    return proxyRequest(event, `${apiProxyTarget}${url.pathname}${url.search}`, {
        headers: {
            // overrides anything the browser sent in Authorization
            authorization: `Basic ${btoa(`${apiBasicUser}:${apiBasicPassword}`)}`,
        },
    });
});