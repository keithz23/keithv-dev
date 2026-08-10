package dev.keithv.be.blog;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;
import java.util.Set;

public record PostPatchRequest(
	@Size(min = 1, max = 200)
	String title,

	@Size(min = 1, max = 220)
	@Pattern(regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$")
	String slug,

	@Size(min = 1, max = 500)
	String excerpt,

	@Size(min = 1)
	String content,

	PostStatus status,

	OffsetDateTime publishedAt,

	Set<@Pattern(regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$") String> tagSlugs
) {
}
