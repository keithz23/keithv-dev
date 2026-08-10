package dev.keithv.be.blog;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public record PostSummaryResponse(
	UUID id,
	String title,
	String slug,
	String excerpt,
	PostStatus status,
	OffsetDateTime publishedAt,
	OffsetDateTime createdAt,
	OffsetDateTime updatedAt,
	List<TagResponse> tags
) {
}
