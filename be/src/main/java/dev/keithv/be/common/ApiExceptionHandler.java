package dev.keithv.be.common;

import java.time.Clock;
import java.time.OffsetDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {
	@ExceptionHandler(BadRequestException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public ApiErrorResponse badRequest(BadRequestException exception) {
		return error(HttpStatus.BAD_REQUEST, exception.getMessage(), Map.of());
	}

	@ExceptionHandler(ResourceNotFoundException.class)
	@ResponseStatus(HttpStatus.NOT_FOUND)
	public ApiErrorResponse notFound(ResourceNotFoundException exception) {
		return error(HttpStatus.NOT_FOUND, exception.getMessage(), Map.of());
	}

	@ExceptionHandler({ ConflictException.class, DataIntegrityViolationException.class })
	@ResponseStatus(HttpStatus.CONFLICT)
	public ApiErrorResponse conflict(Exception exception) {
		String message = exception instanceof ConflictException
			? exception.getMessage()
			: "Request conflicts with existing data";
		return error(HttpStatus.CONFLICT, message, Map.of());
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public ApiErrorResponse validation(MethodArgumentNotValidException exception) {
		Map<String, String> fields = new LinkedHashMap<>();
		exception.getBindingResult().getFieldErrors().forEach((fieldError) ->
			fields.put(fieldError.getField(), fieldError.getDefaultMessage())
		);
		return error(HttpStatus.BAD_REQUEST, "Validation failed", fields);
	}

	@ExceptionHandler(HttpMessageNotReadableException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public ApiErrorResponse invalidJson() {
		return error(HttpStatus.BAD_REQUEST, "Request body is invalid", Map.of());
	}

	private ApiErrorResponse error(HttpStatus status, String message, Map<String, String> fields) {
		return new ApiErrorResponse(
			OffsetDateTime.now(Clock.systemUTC()),
			status.value(),
			status.getReasonPhrase(),
			message,
			fields
		);
	}
}
