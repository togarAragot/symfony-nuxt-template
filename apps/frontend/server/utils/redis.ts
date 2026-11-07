import Redis from 'ioredis';

declare global {
    // eslint-disable-next-line no-var
    var __redis: Redis | undefined;
}

export const useRedis = (): Redis => {
    const { redisUrl } = useRuntimeConfig();
    globalThis.__redis ??= new Redis(redisUrl);
    return globalThis.__redis;
};