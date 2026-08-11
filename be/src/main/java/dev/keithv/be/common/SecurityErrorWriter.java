package dev.keithv.be.common;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Clock;
import java.time.OffsetDateTime;
import java.util.Map;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

@Component
public class SecurityErrorWriter implements AuthenticationEntryPoint, AccessDeniedHandler {
	private final ObjectMapper objectMapper;

	public SecurityErrorWriter(ObjectMapper objectMapper) {
		this.objectMapper = objectMapper;
	}

	@Override
	public void commence(
		HttpServletRequest request,
		HttpServletResponse response,
		AuthenticationException exception
	) throws IOException, ServletException {
		write(response, request, HttpServletResponse.SC_UNAUTHORIZED, "UNAUTHENTICATED", "Authentication is required");
	}

	@Override
	public void handle(
		HttpServletRequest request,
		HttpServletResponse response,
		AccessDeniedException exception
	) throws IOException, ServletException {
		write(response, request, HttpServletResponse.SC_FORBIDDEN, "FORBIDDEN", "Access is denied");
	}

	private void write(
		HttpServletResponse response,
		HttpServletRequest request,
		int status,
		String code,
		String message
	) throws IOException {
		response.setStatus(status);
		response.setContentType(MediaType.APPLICATION_JSON_VALUE);
		objectMapper.writeValue(response.getOutputStream(), new ApiErrorResponse(
			OffsetDateTime.now(Clock.systemUTC()),
			status,
			code,
			message,
			request.getRequestURI(),
			Map.of()
		));
	}
}
