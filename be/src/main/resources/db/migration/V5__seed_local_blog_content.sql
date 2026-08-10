INSERT INTO tags (id, name, slug) VALUES
    ('10000000-0000-0000-0000-000000000001', 'Backend', 'backend'),
    ('10000000-0000-0000-0000-000000000002', 'PostgreSQL', 'postgresql'),
    ('10000000-0000-0000-0000-000000000003', 'Next.js', 'nextjs'),
    ('10000000-0000-0000-0000-000000000004', 'Architecture', 'architecture');

INSERT INTO posts (
    id, title, slug, excerpt, content, status, published_at
) VALUES
    (
        '20000000-0000-0000-0000-000000000001',
        'Designing a Portfolio API Around Real UI Data',
        'designing-a-portfolio-api-around-real-ui-data',
        'How to turn hardcoded portfolio sections into a database-backed API without changing the visible interface.',
        'A useful portfolio API starts with the UI contract that already exists. Projects, capabilities, experience, education, social links, and contact copy should become database records only when the interface actually renders them. This keeps migrations focused and avoids schema that looks impressive but has no consumer.',
        'PUBLISHED',
        '2026-08-10T09:00:00Z'
    ),
    (
        '20000000-0000-0000-0000-000000000002',
        'Flyway Migrations for Small Product Backends',
        'flyway-migrations-for-small-product-backends',
        'A practical migration strategy for Spring Boot services that need PostgreSQL locally and predictable production changes.',
        'Versioned SQL migrations make database changes reviewable. Keep schema changes forward-only, add constraints for real invariants, and separate seed content from table creation. For local development, seed sample content that demonstrates the API contract without embedding secrets.',
        'PUBLISHED',
        '2026-08-09T09:00:00Z'
    ),
    (
        '20000000-0000-0000-0000-000000000003',
        'Draft Notes on Blog Search',
        'draft-notes-on-blog-search',
        'Notes for a future search feature that should stay hidden until it is ready.',
        'This draft is intentionally hidden from public listing and slug lookup. It exists to verify that public endpoints filter by PUBLISHED status.',
        'DRAFT',
        NULL
    );

INSERT INTO post_tags (post_id, tag_id) VALUES
    ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001'),
    ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002'),
    ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000004'),
    ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001'),
    ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002'),
    ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003');
