# Symfony + Nuxt template

This repository runs a Symfony API and a Nuxt frontend as Docker Compose
services. The frontend is the public web application; Caddy in the FrankenPHP
service routes requests to Nuxt or Symfony. Percona Server stores application
data, and Redis is used by Nuxt for session-associated CSRF tokens.

## Structure

- `apps/backend` — Symfony 8.1 API, Doctrine ORM and migrations.
- `apps/frontend` — Nuxt 4 application, server middleware, API proxy, and
  Redis-backed CSRF token handling.
- `infrastructure/frankenphp` — FrankenPHP image, Caddy routing, and entrypoint.
- `infrastructure/nuxt` — Bun-based Nuxt build and runtime images.
- `infrastructure/variables` — environment templates grouped by scope.
- `compose.yml` — local service, volume, port, and network definitions.

## Run the stack

Use Docker with the Compose plugin. The root `.env` supplies local development
database credentials for Compose.

```sh
docker compose up --build
```

The `app` service publishes ports 80 and 443 on the host. Caddy has automatic
HTTPS disabled in this configuration; requests on port 443 redirect to
`http://localhost`. Open the application at `http://localhost`. Nuxt and
Symfony run only in containers; there is no separate host-based development
workflow in this template.

Useful container commands:

```sh
docker compose logs -f app nuxt
docker compose exec app composer install
docker compose exec app php bin/console about
docker compose exec app php bin/console doctrine:migrations:migrate
docker compose down
```

Database and Redis data are held in named Docker volumes. `docker compose down`
keeps the volumes; `docker compose down -v` removes them and their data.

## Request routing

The browser connects to the published `app` service. Caddy normally forwards
requests to `nuxt:3000`, so pages and frontend assets are served by Nuxt. The
browser uses the same origin for API calls under `/api`.

For an API call, Nuxt's `/api/[...path]` server handler proxies the request to
`http://app` while preserving its path and query string. When Caddy receives
`/api/*` from Nuxt's fixed public-network address (`172.30.0.3`), it serves the
request through Symfony's PHP handler instead of sending it back to Nuxt. This
lets the browser reach Symfony through Nuxt without exposing a separate backend
port. Symfony controller routes are mounted under the `/api` prefix.

On this server-to-server hop, Nuxt adds an HTTP Basic `Authorization` header
using its private `apiBasicUser` and `apiBasicPassword` runtime settings. It
overwrites any `Authorization` header supplied by the browser, so the browser
does not choose or receive the backend service credentials. Symfony's
`NuxtClientListener` checks the credentials against `NUXT_CLIENT_USER` and
`NUXT_CLIENT_PASSWORD` using constant-time comparisons; a mismatch returns
HTTP 401. Set matching, non-empty values in both containers using
`NUXT_API_BASIC_USER` / `NUXT_API_BASIC_PASSWORD` for Nuxt and
`NUXT_CLIENT_USER` / `NUXT_CLIENT_PASSWORD` for Symfony. These credentials
identify the Nuxt service, not an end user.

## Docker networks

Compose creates three networks:

- `public` is the shared bridge network for `app` and `nuxt`; only `app` has
  host ports published. Nuxt is assigned `172.30.0.3`, which Caddy uses to
  recognize proxied API requests.
- `database_access` is internal and connects `app` to `database`.
- `redis_access` is internal and connects `app`, `nuxt`, and `redis`.

The database and Redis have no public-network attachment or published host
ports. The backend reaches the database by the Compose service name
`database`; Nuxt reaches Redis by `redis`. The frontend's Redis URL and its
server-side API proxy defaults are in `apps/frontend/nuxt.config.ts`.

## CSRF protection

Nuxt creates an `sid` cookie for frontend page requests. It is HTTP-only,
`SameSite=Lax`, scoped to `/`, and marked `Secure` outside Nuxt development
mode. The server-side CSRF plugin associates a random token with that session
ID in Redis for one hour. Redis stores the token and expiry under `csrf:<sid>`.
The `sid` cookie currently identifies a session for CSRF checks; it does not
authenticate a user.

For unsafe methods under `/api` (anything other than `GET`, `HEAD`, or
`OPTIONS`), Nuxt middleware requires both the session cookie and a matching
`X-CSRF-Token` header. Missing, expired, or mismatched tokens receive HTTP 403.
The `useProtectedFetch` and `useProtectedApi` composables attach the token and
include credentials. Use these helpers for state-changing API requests. The
ordinary `useApi` helper includes credentials but does not add a CSRF header;
it is suitable for safe requests.

User authentication is not implemented yet. Symfony currently has no active
user authenticator. When user providers and login are added, the intended user
identity flow can use browser cookies forwarded through the Nuxt proxy and
validated against those providers. That user session is separate from the
Basic Auth credentials that identify Nuxt to Symfony.

## Environment templates

Committed `.env` files are development defaults. Keep production secrets in
CI environment secrets or another secret store. Local `.env.local` and
`.env.*.local` overrides are ignored by Git.

`infrastructure/variables` separates deployment values by scope:

- `.env.dist.global` contains Compose-wide database credentials:
  `DB_ROOT_PASSWORD` and `DB_PASSWORD`.
- `.env.dist.backend` contains Symfony production values, including
  `APP_SECRET` and `DATABASE_URL`. Its URL references the shared
  `${DB_PASSWORD}` value. It also contains `NUXT_CLIENT_USER` and
  `NUXT_CLIENT_PASSWORD` for the internal Basic Auth check.
- `.env.dist.frontend` contains `NUXT_API_BASIC_USER` and
  `NUXT_API_BASIC_PASSWORD`, the matching credentials Nuxt sends to Symfony.

When adding CI/CD, render the global values before the backend template. Set
database passwords, `APP_SECRET`, and the Basic Auth credentials from protected
CI secrets; keep only non-secret defaults in templates. The Basic Auth values
must match and must not be empty. URL-encode reserved characters when inserting
a password into `DATABASE_URL`.
