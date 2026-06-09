# Medium Blog

A single-author blog built with Vue 3, Vike SSR, Express, Prisma, PostgreSQL, and S3-compatible object storage.

## Requirements

- Node.js 24
- npm 11
- PostgreSQL 16+
- MinIO or another S3-compatible service

## Local Development

1. Install dependencies:

   ```sh
   npm ci
   ```

2. Create `.env` from `.env.example` and set `DATABASE_URL` and the MinIO variables.

3. Apply migrations and create the admin account:

   ```sh
   npm run prisma:deploy
   npm run admin:create
   ```

   For non-interactive environments, set `ADMIN_EMAIL` and `ADMIN_PASSWORD`. Running the command again updates the same admin password and revokes existing sessions.

4. Start the development server:

   ```sh
   npm run dev
   ```

The public site is served at `http://localhost:3000`; the admin login is at `/auth/login`.

## Verification

```sh
npm test
npx prisma validate
npm run build
npm audit --omit=dev
```

The repository still has legacy full-lint findings in older Vue and Cypress files. Changed server files should be linted before merging.

## Production

Copy `.env.production.example` to an environment file kept outside version control, set strong PostgreSQL and MinIO credentials, and configure the public `VITE_DOMAIN_ADDRESS`.

```sh
docker compose --env-file .env.production -f dc-production.yml up -d --build
docker compose --env-file .env.production -f dc-production.yml exec blog npm run admin:create
```

The application applies committed migrations on startup. Authentication uses revocable, hashed database sessions in an `HttpOnly`, `SameSite=Lax`, production-secure cookie.

## Database Operations

Create a development migration after changing the schema:

```sh
npm run prisma:dev
```

Apply committed migrations:

```sh
npm run prisma:deploy
```

The current initial migration is intentionally destructive relative to the legacy schema. Existing data is not supported by the modernization plan.
