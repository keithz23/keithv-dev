package dev.keithv.be.contact;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ContactMessageRequest(
	@NotBlank
	@Size(min = 2, max = 120)
	String name,

	@NotBlank
	@Email
	@Size(max = 254)
	String email,

	@NotBlank
	@Size(min = 20, max = 5000)
	String message
) {
}
