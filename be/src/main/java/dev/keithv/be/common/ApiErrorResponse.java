package dev.keithv.be.common;

import java.time.OffsetDateTime;
import java.util.Map;

public record ApiErrorResponse(
	OffsetDateTime timestamp,
	int status,
	String code,
	String message,
	String path,
	Map<String, String> fieldErrors
) {
}
