# Technical Blog API

Base URL: `http://localhost:8080/api/v1`

The current frontend has no Blog UI yet. These endpoints provide the backend contract for the next integration phase. Admin endpoints are intentionally unauthenticated foundation endpoints until a real auth/JWT module is added.

## Public Endpoints

### List Published Posts

```http
GET /posts?page=0&size=10&tag=postgresql
```

Returns only `PUBLISHED` posts. `tag` is optional and filters by tag slug. `size` is capped at 50.

### Get Published Post by Slug

```http
GET /posts/flyway-migrations-for-small-product-backends
```

Returns `404` for drafts or unknown slugs.

### List Tags

```http
GET /tags
```

Returns all tags sorted by name.

## Admin Endpoints

### Create Post

```http
POST /admin/posts
Content-Type: application/json

{
  "title": "Post title",
  "slug": "post-title",
  "excerpt": "Short summary.",
  "content": "Markdown or plain text content.",
  "status": "PUBLISHED",
  "publishedAt": "2026-08-10T09:00:00Z",
  "tagSlugs": ["backend", "postgresql"]
}
```

`status` must be `DRAFT` or `PUBLISHED`. `PUBLISHED` requires `publishedAt`.

### Patch Post

```http
PATCH /admin/posts/{id}
Content-Type: application/json

{
  "status": "DRAFT",
  "tagSlugs": ["backend"]
}
```

Only provided fields are changed.

### Delete Post

```http
DELETE /admin/posts/{id}
```

Deletes the post and its `post_tags` rows.

### Create Tag

```http
POST /admin/tags
Content-Type: application/json

{
  "name": "Spring Boot",
  "slug": "spring-boot"
}
```

### Delete Tag

```http
DELETE /admin/tags/{id}
```

Returns `409` if the tag is still attached to posts.
