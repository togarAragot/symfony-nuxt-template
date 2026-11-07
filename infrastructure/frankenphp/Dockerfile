FROM dunglas/frankenphp:1-php8.5-trixie AS php-base

RUN install-php-extensions \
    pdo_mysql \
    intl \
    zip \
    opcache

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
COPY ./infrastructure/frankenphp/Caddyfile /etc/frankenphp/Caddyfile
WORKDIR /var/www/app
COPY ./apps/backend .

FROM php-base AS dev

COPY ./infrastructure/frankenphp/docker-entrypoint.sh /usr/local/bin/docker-entrypoint
RUN chmod +x /usr/local/bin/docker-entrypoint

ENTRYPOINT ["docker-entrypoint"]