package dev.keithv.be.blog;

import java.time.OffsetDateTime;
import java.util.UUID;

public record TagResponse(
	UUID id,
	String name,
	String slug,
	OffsetDateTime createdAt
) {
}
