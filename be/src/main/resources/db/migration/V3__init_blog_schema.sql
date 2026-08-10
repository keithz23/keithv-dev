CREATE TABLE posts (
    id UUID PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(220) NOT NULL,
    excerpt VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(30) NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_posts_slug UNIQUE (slug),
    CONSTRAINT chk_posts_status CHECK (status IN ('DRAFT', 'PUBLISHED')),
    CONSTRAINT chk_posts_published_at CHECK (status <> 'PUBLISHED' OR published_at IS NOT NULL)
);

CREATE TABLE tags (
    id UUID PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    slug VARCHAR(140) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_tags_name UNIQUE (name),
    CONSTRAINT uq_tags_slug UNIQUE (slug)
);

CREATE TABLE post_tags (
    post_id UUID NOT NULL,
    tag_id UUID NOT NULL,
    PRIMARY KEY (post_id, tag_id),
    CONSTRAINT fk_post_tags_post
        FOREIGN KEY (post_id)
        REFERENCES posts (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_post_tags_tag
        FOREIGN KEY (tag_id)
        REFERENCES tags (id)
        ON DELETE RESTRICT
);
