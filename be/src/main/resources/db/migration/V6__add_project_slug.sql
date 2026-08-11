ALTER TABLE projects ADD COLUMN slug VARCHAR(180);

UPDATE projects
SET slug = LOWER(REPLACE(title, ' ', '-'))
WHERE slug IS NULL;

ALTER TABLE projects ALTER COLUMN slug SET NOT NULL;
ALTER TABLE projects ADD CONSTRAINT uq_projects_slug UNIQUE (slug);
