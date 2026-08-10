package dev.keithv.be.blog;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;
import java.util.Set;

public record PostCreateRequest(
	@NotBlank
	@Size(max = 200)
	String title,

	@NotBlank
	@Size(max = 220)
	@Pattern(regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$")
	String slug,

	@NotBlank
	@Size(max = 500)
	String excerpt,

	@NotBlank
	String content,

	@NotNull
	PostStatus status,

	OffsetDateTime publishedAt,

	Set<@Pattern(regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$") String> tagSlugs
) {
}
