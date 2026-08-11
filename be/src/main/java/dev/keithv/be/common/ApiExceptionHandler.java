package dev.keithv.be.common;

import java.time.Clock;
import java.time.OffsetDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {
	@ExceptionHandler(BadRequestException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public ApiErrorResponse badRequest(BadRequestException exception, HttpServletRequest request) {
		return error(HttpStatus.BAD_REQUEST, "BAD_REQUEST", exception.getMessage(), request, Map.of());
	}

	@ExceptionHandler(ResourceNotFoundException.class)
	@ResponseStatus(HttpStatus.NOT_FOUND)
	public ApiErrorResponse notFound(ResourceNotFoundException exception, HttpServletRequest request) {
		return error(HttpStatus.NOT_FOUND, "NOT_FOUND", exception.getMessage(), request, Map.of());
	}

	@ExceptionHandler({ ConflictException.class, DataIntegrityViolationException.class })
	@ResponseStatus(HttpStatus.CONFLICT)
	public ApiErrorResponse conflict(Exception exception, HttpServletRequest request) {
		String message = exception instanceof ConflictException
			? exception.getMessage()
			: "Request conflicts with existing data";
		return error(HttpStatus.CONFLICT, "CONFLICT", message, request, Map.of());
	}

	@ExceptionHandler(BadCredentialsException.class)
	@ResponseStatus(HttpStatus.UNAUTHORIZED)
	public ApiErrorResponse unauthorized(HttpServletRequest request) {
		return error(HttpStatus.UNAUTHORIZED, "UNAUTHENTICATED", "Invalid email or password", request, Map.of());
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public ApiErrorResponse validation(MethodArgumentNotValidException exception, HttpServletRequest request) {
		Map<String, String> fields = new LinkedHashMap<>();
		exception.getBindingResult().getFieldErrors().forEach((fieldError) ->
			fields.put(fieldError.getField(), fieldError.getDefaultMessage())
		);
		return error(HttpStatus.BAD_REQUEST, "VALIDATION_ERROR", "Validation failed", request, fields);
	}

	@ExceptionHandler(HttpMessageNotReadableException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public ApiErrorResponse invalidJson(HttpServletRequest request) {
		return error(HttpStatus.BAD_REQUEST, "INVALID_JSON", "Request body is invalid", request, Map.of());
	}

	private ApiErrorResponse error(
		HttpStatus status,
		String code,
		String message,
		HttpServletRequest request,
		Map<String, String> fields
	) {
		return new ApiErrorResponse(
			OffsetDateTime.now(Clock.systemUTC()),
			status.value(),
			code,
			message,
			request.getRequestURI(),
			fields
		);
	}
}
