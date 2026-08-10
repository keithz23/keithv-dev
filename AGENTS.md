# Repository Guidelines

## Project Structure & Module Organization

This workspace contains two application roots:

- `fe/`: Next.js portfolio frontend. App Router pages live in `fe/app/`, reusable UI in `fe/components/`, shared helpers in `fe/lib/`, and static assets in `fe/public/`.
- `be/`: Spring Boot backend. Java source is under `be/src/main/java/dev/keithv/be/`, configuration is in `be/src/main/resources/`, and tests are under `be/src/test/java/`.

Keep frontend-only changes inside `fe/` and backend-only changes inside `be/` unless a feature needs both sides.

## Build, Test, and Development Commands

Frontend commands run from `fe/`:

- `npm run dev`: start the Next.js development server.
- `npm run build`: create a production build.
- `npm run start`: serve the production build.
- `npm run lint`: run ESLint with Next.js and TypeScript rules.

Backend commands run from `be/`:

- `./mvnw spring-boot:run`: start the Spring Boot app locally.
- `./mvnw test`: run the JUnit test suite.
- `./mvnw package`: compile, test, and package the backend artifact.

## Coding Style & Naming Conventions

Use TypeScript and React function components in the frontend. Follow the existing two-space indentation, double quotes, and Tailwind utility style seen in `fe/app/` and `fe/components/`. Name React components in `PascalCase`; keep route and component file names lowercase with hyphens, such as `back-to-top.tsx`.

Backend code uses Java 25 and Spring Boot conventions. Keep packages under `dev.keithv.be`, classes in `PascalCase`, and methods and fields in `camelCase`.

For Next.js work, read the relevant local guide in `fe/node_modules/next/dist/docs/` before changing framework APIs; this project uses a version with breaking changes.

## Testing Guidelines

Run `npm run lint` for frontend changes. Add frontend tests only after introducing a test framework or following an existing one.

Run `./mvnw test` for backend changes. Place JUnit tests in `be/src/test/java/` and use focused test names like `contextLoads`.

## Commit & Pull Request Guidelines

Recent frontend history mostly uses short Conventional Commit-style messages, especially `feat: ...`, with occasional plain summaries like `update navbar`. Prefer `type: concise summary`, for example `feat: add contact form validation` or `fix: handle missing project image`.

Pull requests should include a short description, commands run, linked issue or task when relevant, and screenshots or screen recordings for visible UI changes.

## Security & Configuration Tips

Do not commit secrets, local database credentials, or generated build folders such as `fe/.next/`. Keep runtime settings in environment variables or ignored local config files.

# AGENTS.md — Portfolio API Database Alignment

## Mission

You are working inside an existing personal portfolio repository. Your task is to inspect the current application, identify its real data model and integration requirements, then create or align a PostgreSQL database schema and Flyway migrations that match the current portfolio.

The target backend is a Spring Boot REST API. The desired long-term domain includes portfolio projects, blog posts, tags, admin users, and audit logs, but the existing repository is the source of truth for what must be implemented now.

Do not blindly apply a generic schema. First inspect the codebase and align naming, fields, routes, frontend expectations, and existing conventions.

---

## Non-negotiable rules

1. **Inspect before editing.** Do not create migrations, entities, or configuration until you have inspected the repository.
2. **Preserve existing behavior.** Do not rename routes, fields, or UI-facing models unless clearly required and all affected references are updated.
3. **Migration-first database changes.** Use versioned Flyway SQL migrations. Do not use `ddl-auto=update`.
4. **No destructive operations by default.** Never drop databases, schemas, tables, columns, or user data. Do not run destructive commands such as `docker compose down -v`, `DROP`, `TRUNCATE`, or reset migrations unless the user explicitly requests it.
5. **No secrets in Git.** Use environment variables and `.env.example`; never commit `.env`, passwords, tokens, or API keys.
6. **Do not expose persistence entities as API contracts.** Use request/response DTOs if this repository includes Spring controllers.
7. **Stay within scope.** Do not introduce microservices, Kafka, Redis, Elasticsearch, Kubernetes, or authentication redesign unless the existing code requires it or the user explicitly asks.
8. **Make small, reviewable changes.** Avoid unrelated formatting/refactoring. Each change must have a clear purpose.
9. **Explain uncertainty.** If the codebase lacks enough information to choose a schema field, document the assumption and choose the least irreversible option.

---

## Target architecture

Use a modular monolith. Organize backend code by feature where possible:

```text
src/main/java/<root-package>/
├── common/                 # API errors, exceptions, shared persistence helpers
├── config/                 # Web, OpenAPI, Jackson, application configuration
├── auth/                   # Only if authentication exists or is requested
├── post/                   # Blog post domain
├── tag/                    # Tag domain
├── project/                # Portfolio project domain
├── audit/                  # Optional audit trail
└── security/               # Only if security is in scope
```

Dependency direction:

```text
HTTP request -> Controller -> Service -> Repository -> PostgreSQL
                              |
                              -> DTO / Mapper
```

- Controller: HTTP mapping, input validation, status codes.
- Service: business rules, transactions, orchestration.
- Repository: persistence and database queries.
- Entity: internal JPA persistence model only.
- DTO: stable request/response API contract.

If the current project uses a different established structure, preserve it unless restructuring is explicitly requested.

---

## Required discovery phase

Before changing any file, inspect and report the following.

### 1. Repository shape

Inspect:

```text
README*
package.json
pom.xml
gradle.build / build.gradle.kts
src/
app/
pages/
components/
prisma/
supabase/
docker-compose.yml / compose.yaml
.env.example
application*.yml / application*.properties
```

Determine:

- Is this frontend-only, backend-only, or full stack?
- Which framework and language are in use?
- Is there an existing database, ORM, migration tool, API client, CMS, or mock-data layer?
- Is the Spring Boot application already present, or must it be introduced?
- What commands are used to run, test, lint, build, and deploy?

### 2. Current portfolio contract

Search for all current portfolio data sources and usages:

```text
project, projects, portfolio, work, experience, skill, blog, post, article, tag,
slug, github, repository, demo, image, thumbnail, featured, category, contact
```

Extract the actual fields used in UI/API. For each resource, record:

| Resource | Current fields | Required fields | Source files | Notes |
|---|---|---|---|---|
| Project | | | | |
| Post/article | | | | |
| Tag/category | | | | |
| Experience | | | | |
| Skills | | | | |
| Contact | | | | |

A field is **required** if rendering, validation, sorting, routing, SEO, or API code depends on it.

### 3. Route and identifier conventions

Identify:

- Existing public URLs, e.g. `/projects/:slug`, `/blog/:slug`.
- Whether slugs are already used and whether they must remain stable.
- Existing API prefix/version, if any.
- ID formats already used: UUID, numeric IDs, strings, external IDs.
- Date format and time-zone conventions.
- Existing casing rules: frontend JSON camelCase, DB snake_case, etc.

### 4. Existing database state

If configuration or migrations exist, inspect but do not reset anything.

Determine:

- Database engine and version.
- Connection configuration source.
- Existing migration history.
- Existing tables and foreign keys, if safe to inspect.
- Whether production/shared data may exist.

---

## Decision policy

Use these decisions unless the existing repository has a clear incompatible convention.

| Concern | Default decision |
|---|---|
| Database | PostgreSQL 16+ |
| Java | Java 21 LTS or existing project LTS version |
| Framework | Existing framework; Spring Boot 3.x for a new backend |
| Build | Existing build tool; Maven for a new Spring Boot app |
| Migration | Flyway SQL migrations |
| IDs | UUID for public API resources; preserve existing IDs if present |
| DB naming | `snake_case` |
| JSON naming | Existing frontend convention, usually `camelCase` |
| Timestamps | `TIMESTAMPTZ` in DB; UTC in application/storage |
| Schema updates | Add a new versioned migration; never edit applied migration |
| JPA schema setting | `ddl-auto: validate` outside disposable local environments |
| API | `/api/v1` only if no versioning convention exists |
| Pagination | `page`, `size`, `sort`; set a maximum page size |
| Deletes | Hard delete only for early local MVP; propose soft delete/audit when real content needs recovery |

---

## Baseline portfolio schema

The existing portfolio frontend is the source of truth for existing modules.
However, the Technical Blog module is an explicit required feature even if its UI
does not yet exist in the repository. Always plan and implement the Blog database
foundation: posts, tags, post_tags, public read APIs and admin CRUD APIs.

```text
users 1 --- N posts
posts N --- N tags through post_tags
users 1 --- N audit_logs
projects are independent in the MVP
```

### Candidate resources

#### `projects`

Use only fields the portfolio needs. Typical fields:

```text
id, slug, name, summary, description,
repository_url, demo_url, image_url,
technologies, is_featured, display_order,
created_at, updated_at
```

Notes:

- If `technologies` are only display labels and never queried independently, `JSONB` or `TEXT[]` can be acceptable.
- If technology pages/filtering are a real feature, normalize into `technologies` and `project_technologies`.
- Preserve existing field names at the API boundary; map them if the DB names differ.

#### `posts`

```text
id, author_id, title, slug, excerpt, content,
status, published_at, created_at, updated_at
```

Rules:

- `slug` is unique.
- Only `PUBLISHED` posts are returned by public endpoints.
- A published post requires `published_at`.
- Keep content format compatible with the frontend: Markdown, MDX, HTML, or rich-text JSON. Do not transform it without evidence.

#### `tags` and `post_tags`

```text
tags: id, name, slug, created_at
post_tags: post_id, tag_id
```

Use this only if posts actually support tag/category relationships. Do not store tag names as a comma-separated string.

#### `users` and `audit_logs`

Users/admin authentication may be deferred to phase 2. The Blog module itself
(posts, tags, post_tags, public APIs and admin CRUD contracts) must still be created.
If users are deferred, do not create a fake authentication mechanism; document
authorId/authentication as a follow-up migration and feature.

```text
users: id, email, password_hash, role, created_at, updated_at
audit_logs: id, actor_id, action, resource_type, resource_id, metadata, created_at
```

Do not seed a real password or secret in Git.

---

## Migration requirements

Place migrations in the project’s established location. For Spring Boot + Flyway, default to:

```text
src/main/resources/db/migration/
```

Name files exactly:

```text
V1__init_schema.sql
V2__add_project_image_url.sql
V3__add_post_search_index.sql
```

Migration rules:

- Use forward-only migrations.
- Include primary keys, foreign keys, `NOT NULL`, `UNIQUE`, and `CHECK` constraints for real invariants.
- Add indexes for actual lookup/filter/sort patterns, not speculative indexes.
- Make relationship delete behavior explicit (`CASCADE`, `RESTRICT`, or `SET NULL`).
- Do not create production seed data in the initial schema migration.
- If data migration is needed, make it idempotent where feasible and document assumptions.
- Do not alter/drop existing columns until compatibility and data migration have been planned.

### Example baseline migration

Use this only if it matches the discovered model. Adapt package/domain needs; do not add fields blindly.

```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY,
    slug VARCHAR(180) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    summary VARCHAR(500) NOT NULL,
    description TEXT,
    repository_url VARCHAR(500),
    demo_url VARCHAR(500),
    image_url VARCHAR(500),
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_projects_featured_display_order
    ON projects (is_featured, display_order);
```

If posts are required:

```sql
CREATE TABLE posts (
    id UUID PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(220) NOT NULL UNIQUE,
    excerpt VARCHAR(500),
    content TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_posts_status CHECK (status IN ('DRAFT', 'PUBLISHED')),
    CONSTRAINT chk_published_post CHECK (
        (status = 'DRAFT' AND published_at IS NULL)
        OR (status = 'PUBLISHED' AND published_at IS NOT NULL)
    )
);

CREATE INDEX idx_posts_public_listing
    ON posts (status, published_at DESC);
```

---

## Configuration requirements

Use environment-specific config; never store secrets in source control.

### Expected config files

```text
src/main/resources/application.yml
src/main/resources/application-local.yml
src/main/resources/application-test.yml
src/main/resources/application-prod.yml
.env.example
compose.yaml
```

### Baseline Spring Boot config

```yaml
# application.yml
spring:
  application:
    name: portfolio-api
  profiles:
    default: local
  jpa:
    open-in-view: false
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        jdbc:
          time_zone: UTC
  flyway:
    enabled: true

server:
  servlet:
    context-path: /api/v1

management:
  endpoints:
    web:
      exposure:
        include: health,info
```

```yaml
# application-local.yml
spring:
  datasource:
    url: ${DB_URL:jdbc:postgresql://localhost:5432/portfolio_db}
    username: ${DB_USERNAME:portfolio}
    password: ${DB_PASSWORD:portfolio}
  jpa:
    show-sql: true
```

```yaml
# application-prod.yml
spring:
  datasource:
    url: ${DB_URL}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
  jpa:
    show-sql: false
```

### `.env.example`

```env
POSTGRES_DB=portfolio_db
POSTGRES_USER=portfolio
POSTGRES_PASSWORD=portfolio

DB_URL=jdbc:postgresql://localhost:5432/portfolio_db
DB_USERNAME=portfolio
DB_PASSWORD=portfolio

JWT_SECRET=replace-in-deployment-environment
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Local PostgreSQL Compose baseline

```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: ${POSTGRES_DB:-portfolio_db}
      POSTGRES_USER: ${POSTGRES_USER:-portfolio}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-portfolio}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"]
      interval: 5s
      timeout: 5s
      retries: 10

volumes:
  postgres_data:
```

Do not overwrite an existing Compose configuration without first comparing it.

---

## Work procedure

### Phase A — Inspect and propose

1. Read repository documentation and build/config files.
2. Inventory portfolio resources, fields, routes, static/mock data, API calls, and current types/interfaces.
3. Locate existing database/config/migration infrastructure.
4. Produce a concise **alignment plan** before editing:
    - Current stack and run/test commands.
    - Current data models and source files.
    - Proposed tables/columns and how each maps to UI/API fields.
    - Existing data compatibility risks.
    - Files to add/change.
    - Assumptions and items requiring user confirmation.

If a human interaction channel is available, ask for confirmation when the proposed work would change existing persistent data or API contract. If not, proceed only with additive, backward-compatible changes and document assumptions.

### Phase B — Implement

1. Add or align local database configuration and `.env.example`.
2. Add the smallest necessary Flyway migration(s).
3. Add or align entities/repositories only for discovered resources.
4. Add DTOs/mappers/services/controllers only if backend API implementation is in scope.
5. Add validation and consistent API error handling.
6. Add indexes matching actual queries from the current portfolio.
7. Update README with exact local setup/run commands.

### Phase C — Verify

Run the repository’s available commands. Prefer the existing project scripts.

For Spring Boot, target commands are usually:

```bash
./mvnw test
./mvnw spring-boot:run
```

For Docker-based local DB:

```bash
docker compose up -d
```

Verify:

- The application starts using the local profile.
- Flyway applies migrations successfully.
- No existing frontend build/type checks break.
- Existing project/blog pages still render or API contracts remain compatible.
- Public endpoint behavior is correct: only published posts are visible.
- Errors are structured and do not leak stack traces, SQL, secrets, or internal details.

### Phase D — Final report

Report:

1. What was discovered about the existing portfolio.
2. Files changed and why.
3. The final ERD/table summary.
4. Mapping between current frontend models and database columns.
5. Exact commands to run locally.
6. Migration status and verification result.
7. Assumptions, known limitations, and recommended next steps.

---

## Definition of done

The task is complete only when:

- The proposed schema reflects fields actually used by the current portfolio.
- Database evolution is handled by versioned migrations.
- Local configuration works without committed secrets.
- The backend starts and migrations apply successfully, or any blocker is reported precisely.
- Existing portfolio behavior remains compatible.
- README/setup instructions are accurate.
- The final report identifies every schema/API compatibility assumption.