# Production Blog Modernization Plan

## Summary

Revive the repository as a secure single-author production blog while retaining Vue, Vike SSR, Express, Prisma, PostgreSQL, and S3-compatible storage. Existing state is disposable, deployment targets one VPS with Docker Compose, and TypeScript adoption is incremental.

## Implementation Status

### Completed on June 9, 2026

- Upgraded Prisma to 7.8 with the PostgreSQL driver adapter and centralized all runtime access through one shared client with graceful shutdown.
- Replaced integer identifiers with UUIDs and introduced the redesigned `User`, `Post`, `Media`, and `Session` records, post status, optimistic version storage, and a fresh disposable migration.
- Replaced JWTs and synchronous bcrypt with hashed opaque database sessions and versioned asynchronous Node `scrypt` password hashes.
- Removed the public setup page and API; added an idempotent interactive `npm run admin:create` command that revokes sessions when credentials change.
- Added password/session tests and verified migration deployment, repeated admin creation, post status serialization, and session revocation against PostgreSQL 16.
- Verified the production Express cookie flow end to end: login, authenticated `/api/auth/me`, logout, and rejection of the revoked session.

### Completed on June 8, 2026

- Added a reproducible Node 24/npm baseline with `package-lock.json`, `.nvmrc`, engine declarations, and verified `npm ci`.
- Upgraded Prisma 3 to Prisma 6.19.3 as an interim compatibility step and added a versioned initial PostgreSQL migration.
- Upgraded vulnerable direct dependencies including Axios, JSON Web Token, Multer, Sharp, and MinIO; removed the direct UUID dependency.
- Added JWT expiry, secure cookie options, production secret validation, login/setup rate limiting, same-origin mutation checks, Helmet, CSP, and structured API errors.
- Restricted post mutations to allowlisted fields, validated publishing metadata and IDs, normalized slugs, and sanitized published/preview HTML.
- Prevented anonymous draft previews and disabled caching for authentication, admin, and preview responses.
- Added bounded image uploads, content inspection, generated object keys, resize limits, rollback, and temporary-file cleanup.
- Fixed setup loading state, admin unpublish state, public loader cleanup, and the editor's Lowlight integration.
- Added 11 passing unit tests for sanitization, token verification, origin enforcement, and post input validation.
- Updated Docker and Compose for Node 24, non-root execution, ignored secrets, named data volumes, pinned service images, and migration-based startup.
- Verified the unit suite, targeted lint, production build, Prisma schema, Compose configuration, Sharp runtime, and Docker image build.
- Upgraded Vue to 3.5, Vite to 8.0.16, and `vite-plugin-ssr` to Vike 0.4.259 with `vike-vue`.
- Replaced legacy `.page.*` files and the custom renderer with `+Page`, `+route`, `+data`, metadata, layout, and response-header configuration files.
- Migrated Express SSR integration to Vike's `renderPage()` and `createDevMiddleware()` APIs while preserving existing public and admin URLs.
- Verified development and production SSR responses and reduced the production dependency audit to zero findings.

### Remaining Priority Work

- Finish framework upgrades for Express 5, Tailwind 4, Tiptap 3, Cypress 15, Vitest 4, and ESLint 10.
- Add TypeScript, CI, API/integration tests, upgraded Cypress coverage, health checks, Caddy TLS, backups, and restore verification.
- Add CSRF tokens, global request limits, session cleanup, and the command-specific publishing API with optimistic version conflicts.
- Monitor the moderate `@prisma/dev` tooling advisories reported by `npm audit --omit=dev`; no high or critical production advisories remain.

### Next Execution Target

Create an Express application factory and API test harness, then add CSRF tokens and integration coverage for login, logout, session expiry, and mutation rejection before changing the publishing endpoints.

## Original Findings Driving Work

- Critical draft disclosure: `?preview=true` exposes unpublished draft content of published posts.
- Stored HTML is rendered unsanitized through `v-html`.
- JWTs never expire; cookies lack `HttpOnly`, `Secure`, and `SameSite`; missing secrets are randomly regenerated.
- APIs accept unrestricted request bodies, enabling mass assignment.
- Uploads and image transformations have no size or dimension limits and leak temporary files.
- Production Compose contains fixed credentials and runs schema changes using `prisma db push`.
- Node 14, Vite 2, Prisma 3, Cypress 9, and other dependencies are obsolete. A temporary dependency resolution reported 19 vulnerabilities: 2 critical and 9 high.
- Tests cover only two happy-path browser flows and rely on fixed delays.

## Phase 1: Reproducible Baseline

1. Adopt Node 24 LTS, npm 11, TypeScript 5.9, and commit `package-lock.json`.
2. Add `engines`, `.nvmrc`, deterministic `npm ci` scripts, and separate `dev`, `build`, `start`, `typecheck`, `lint`, and test commands.
3. Establish a baseline CI workflow before behavioral changes.
4. Replace the README template with verified local-development, deployment, environment, backup, and recovery instructions.

## Phase 2: Framework Modernization

1. Upgrade to Vue 3.5, Vite 8, Vike 0.4 with `vike-vue`, Express 5, Prisma 7, Tailwind 4, Tiptap 3, Cypress 15, Vitest 4, and ESLint 10.
2. Convert the server and shared contracts to TypeScript ESM first; convert Vue modules as they are modified.
3. Replace legacy `.page.*` Vike files with `+Page.vue`, `+route`, `+data`, and renderer configuration files.
4. Create an Express application factory so tests can start the application without opening a production listener.
5. Introduce one shared Prisma client with explicit startup and shutdown lifecycle handling.
6. Remove unused packages, `body-parser`, dead media code, debugging globals, and obsolete renderer workarounds.

## Phase 3: Data Model

Create a fresh initial Prisma migration with:

- `User`: UUID, normalized email, versioned password hash, timestamps.
- `Post`: UUID, draft and published fields, unique slug, status, summary, publication timestamps, author, and integer `version`.
- `Media`: UUID, object keys, original filename, MIME type, dimensions, byte size, and timestamp.
- `Session`: hashed opaque session identifier, user, expiry, creation time, and last-used time.

Use `prisma migrate dev` locally and `prisma migrate deploy` in production. Never use `db push` for deployment.

## Phase 4: Authentication And Security

1. Replace JWT cookies with revocable database-backed opaque sessions.
2. Set cookies to `HttpOnly`, `Secure` in production, `SameSite=Lax`, bounded lifetime, and rotate them at login.
3. Remove public `/api/auth/setup`; provide an idempotent interactive `npm run admin:create` command.
4. Hash passwords asynchronously with Node `scrypt`, including per-password salt and versioned parameters.
5. Add CSRF tokens for mutations, login rate limiting, global request limits, Helmet, CSP, and request-size limits.
6. Validate environment variables at startup and fail when production secrets or service URLs are missing.
7. Sanitize published and preview HTML using an explicit element, attribute, and URL-protocol allowlist.
8. Return structured errors as `{ error: { code, message, fields?, requestId } }`.

## Phase 5: Publishing Workflow

1. Preserve public routes `/`, `/page/:page`, and `/post/:slug`.
2. Move preview to authenticated `/admin/posts/:id/preview`; never expose drafts through public query parameters.
3. Replace unrestricted updates with Zod-validated command-specific payloads.
4. Add optimistic autosave: clients send `expectedVersion`; conflicts return HTTP `409` with the latest version.
5. Generate normalized slugs, report collisions with `409`, and prevent clients from modifying ownership or timestamps.
6. Return proper `404`, `400`, `401`, `403`, and `409` responses.
7. Fix editor save feedback, failed-save recovery, publish validation, unpublish state updates, and null DOM handling.
8. Apply `no-store` to authentication, admin, and preview responses; use short public caching with ETags for published pages.

## Public Interfaces

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/auth/csrf`
- `GET /api/admin/posts`
- `POST /api/admin/posts`
- `GET /api/admin/posts/:id`
- `PATCH /api/admin/posts/:id/draft`
- `POST /api/admin/posts/:id/publish`
- `POST /api/admin/posts/:id/unpublish`
- `DELETE /api/admin/posts/:id`
- `GET /api/admin/media`
- `POST /api/admin/media`
- `GET /media/:id/:variant`
- `GET /health/live`
- `GET /health/ready`

Share Zod schemas and inferred TypeScript types between server and Vue clients.

## Phase 6: Media Pipeline

1. Accept only JPEG, PNG, WebP, and GIF after content inspection; reject SVG and filename-based MIME claims.
2. Limit uploads to 10 MB, five files per request, and bounded image dimensions.
3. Assign UUID object keys and never use user filenames as storage keys.
4. Generate fixed thumbnail and display variants during upload; remove arbitrary runtime resizing.
5. Clean temporary files in `finally` blocks and remove newly written objects after partial failures.
6. Serve immutable variants with correct MIME type, ETag, cache headers, and `404` handling.

## Phase 7: Deployment And Operations

1. Build a multi-stage Node 24 image using `npm ci`, Prisma generation, a non-root runtime user, and Docker health checks.
2. Compose services: application, PostgreSQL, MinIO, one-shot migration job, and Caddy for automatic TLS.
3. Use named volumes; expose only ports 80/443; keep PostgreSQL and MinIO on the internal network.
4. Keep secrets in deployment environment files outside Git and pin service image versions.
5. Add daily PostgreSQL dumps and MinIO mirrors to encrypted off-host storage with seven daily and four weekly copies.
6. Document restore procedures and perform a restore test before launch.
7. Add structured Pino logs, request IDs, readiness checks for PostgreSQL and MinIO, and graceful shutdown.
8. Deploy immutable image tags and retain the previous image for rollback.

## Tests And Acceptance

- Unit tests: validation, slug generation, sanitization, password hashing, session expiry, and post state transitions.
- API tests: authentication, CSRF, rate limits, mass-assignment rejection, version conflicts, slug conflicts, and status codes.
- Security tests: anonymous draft access, malicious HTML, unsafe links, oversized uploads, spoofed MIME types, and arbitrary resize attempts.
- Integration tests: Prisma repositories against PostgreSQL and media operations against MinIO.
- Cypress tests: admin creation, login/logout, draft autosave, conflict recovery, publish, preview, unpublish, deletion confirmation, and media upload.
- Remove fixed sleeps and synchronize on requests or visible state.
- CI must pass formatting, linting, type checking, unit/integration tests, Cypress, production build, Docker build, migration validation, and dependency audit.
- Production acceptance requires HTTPS, successful backup restoration, no critical/high production dependency advisories, and verified anonymous inability to access drafts.

## Deferred Scope

Tags, search, RSS, sitemap generation, subscriptions, comments, analytics, and multi-author roles remain outside the first production milestone.

## Assumptions

- The application remains single-author.
- Existing databases and object storage do not require migration.
- PostgreSQL and MinIO run on the same VPS initially.
- Public post URLs retain their current shape.
- Basic SEO includes canonical URLs, descriptions, Open Graph metadata, and semantic HTML.
- Framework upgrades follow official migration guidance for [Vike](https://vike.dev/migration/settings), [Prisma 7](https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7), [Express 5](https://expressjs.com/en/guide/migrating-5), [Cypress](https://docs.cypress.io/app/references/migration-guide), and [Node LTS](https://nodejs.org/en/download/releases/).
