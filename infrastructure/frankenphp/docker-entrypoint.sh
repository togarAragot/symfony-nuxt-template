#!/bin/sh
set -e

composer install --no-interaction

exec frankenphp run --config /etc/frankenphp/Caddyfile