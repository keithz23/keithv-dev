package dev.keithv.be.contact;

import java.time.OffsetDateTime;
import java.util.UUID;

public record ContactMessageResponse(
	UUID id,
	String status,
	OffsetDateTime createdAt
) {
}
