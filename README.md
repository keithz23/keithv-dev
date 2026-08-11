# Keith Vuong Portfolio

Full-stack portfolio with a Next.js public site and admin workspace backed by a Spring Boot REST API and PostgreSQL.

## Architecture

```text
Next.js public/admin UI
  -> Axios + TanStack Query
  -> Spring MVC Controller -> Service -> Repository -> PostgreSQL
                                      -> DTO / Mapper
```

- `fe/`: Next.js 16, React 19, TypeScript and Tailwind CSS.
- `be/`: Spring Boot 4, Java 25, Spring Security, JPA and Flyway.
- Public API data remains readable without authentication.
- `/api/v1/admin/**` uses stateless JWT authentication and requires `ROLE_ADMIN`.

## Database summary

- Portfolio: `portfolio_profiles`, `navigation_links`, `social_links`, `hero_principles`, `capabilities`, `educations`.
- Experience: `work_experiences` 1—N `work_experience_highlights`.
- Projects: `projects` 1—N `project_highlights` and `project_technologies`.
- Contact: `contact_messages` with `NEW`, `READ`, and `ARCHIVED` states.
- Blog foundation: `posts` N—N `tags` through `post_tags`.
- Admin authentication: `users` with BCrypt password hashes and an `ADMIN` role.

Flyway migrations live in `be/src/main/resources/db/migration`. Never edit an applied migration; add the next version.

## Environment

Copy values from `.env.example` into your local environment. The `local` Spring profile imports both the repository `.env` and `be/.env` when present; values in `be/.env` take precedence. Production still requires environment variables supplied by the deployment platform.

```env
DB_URL=jdbc:postgresql://localhost:5433/portfolio_db
DB_USERNAME=portfolio
DB_PASSWORD=portfolio

JWT_SECRET=replace-with-a-32-byte-base64-or-base64url-hs256-key
JWT_ACCESS_TOKEN_MINUTES=30
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace-for-local-bootstrap

CORS_ALLOWED_ORIGINS=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
PORTFOLIO_API_BASE_URL=http://localhost:8080/api/v1
```

`ADMIN_EMAIL` and `ADMIN_PASSWORD` create a local admin only when that email does not already exist. No password is seeded by Flyway or committed to Git.

## Local setup

```bash
docker-compose up -d
```

```bash
cd be
export JWT_SECRET="$(openssl rand -base64 32 | tr '+/' '-_' | tr -d '=\n')"
export ADMIN_EMAIL='admin@example.com'
export ADMIN_PASSWORD='choose-a-local-password'
./mvnw spring-boot:run
```

```bash
cd fe
npm install
npm run dev
```

- Public site: <http://localhost:3000>
- Admin login: <http://localhost:3000/admin/login>
- API health: <http://localhost:8080/api/v1/actuator/health>
- Local Swagger UI: <http://localhost:8080/api/v1/swagger-ui.html>

Swagger is disabled by the production profile.

## Admin resources

- `/admin/projects`: full project CRUD.
- `/admin/capabilities`: capability CRUD.
- `/admin/experiences`: experience and highlight CRUD.
- `/admin/educations`: education CRUD.
- `/admin/social-links`: social-link CRUD.
- `/admin/contact-messages`: paginated inbox, status updates and deletion.

The public UI routes and responsive layout are unchanged. Certificates were not introduced because the current portfolio has no certificate data or UI. Blog admin UI is intentionally deferred.

## Verification

```bash
cd be && ./mvnw test
cd fe && npm run lint
cd fe && npm run build
```

## Security limitation

The MVP stores the access token in `localStorage`. Axios attaches it as a Bearer token and clears auth state plus redirects to `/admin/login` on HTTP 401. Expired tokens are rejected client-side and by the API. Because JavaScript can read `localStorage`, an XSS vulnerability could expose the token; a future production hardening phase should move authentication to secure, HttpOnly, SameSite cookies and add refresh-token rotation.

## Backlog

- Profile, navigation-link, and hero-principle admin editors.
- Blog admin UI.
- Audit logging and recovery/soft-delete strategy.
- HttpOnly cookie authentication and refresh tokens.
