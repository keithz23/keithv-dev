CREATE INDEX idx_posts_public_listing
    ON posts (status, published_at DESC);

CREATE INDEX idx_posts_slug
    ON posts (slug);

CREATE INDEX idx_tags_slug
    ON tags (slug);

CREATE INDEX idx_post_tags_tag_id
    ON post_tags (tag_id);
