package dev.keithv.be.portfolio;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.util.List;
import org.hibernate.validator.constraints.URL;

public record ProjectCreateRequest(
	@NotBlank @Size(max = 10) String number,
	@NotBlank @Size(max = 180) @Pattern(regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$") String slug,
	@NotBlank @Size(max = 160) String title,
	@NotBlank @Size(max = 160) String label,
	@NotBlank String description,
	@Size(max = 500) @URL(protocol = "https") String github,
	@Size(max = 80) String visualKey,
	@NotBlank @Size(max = 80) String iconKey,
	@NotNull Boolean isFeatured,
	@NotNull @PositiveOrZero Integer displayOrder,
	@NotEmpty List<@NotBlank String> highlights,
	@NotEmpty List<@NotBlank @Size(max = 120) String> tech
) {
}
