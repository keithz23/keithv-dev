package dev.keithv.be.portfolio;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.util.List;
import org.hibernate.validator.constraints.URL;

public record ProjectPatchRequest(
	@Size(min = 1, max = 10) String number,
	@Size(min = 1, max = 180) @Pattern(regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$") String slug,
	@Size(min = 1, max = 160) String title,
	@Size(min = 1, max = 160) String label,
	@Size(min = 1) String description,
	@Size(max = 500) @URL(protocol = "https") String github,
	@Size(max = 80) String visualKey,
	@Size(min = 1, max = 80) String iconKey,
	Boolean isFeatured,
	@PositiveOrZero Integer displayOrder,
	@Size(min = 1) List<@NotBlank String> highlights,
	@Size(min = 1) List<@NotBlank @Size(max = 120) String> tech
) {
}
