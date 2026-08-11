package dev.keithv.be.auth;

import dev.keithv.be.config.SecurityProperties;
import java.time.Clock;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.List;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
	private final AdminUserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtEncoder jwtEncoder;
	private final SecurityProperties properties;

	public AuthService(
		AdminUserRepository userRepository,
		PasswordEncoder passwordEncoder,
		JwtEncoder jwtEncoder,
		SecurityProperties properties
	) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtEncoder = jwtEncoder;
		this.properties = properties;
	}

	@Transactional(readOnly = true)
	public LoginResponse login(LoginRequest request) {
		AdminUser user = userRepository.findByEmailIgnoreCase(request.email().trim())
			.filter(AdminUser::isEnabled)
			.orElseThrow(() -> new BadCredentialsException("Invalid email or password"));
		if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
			throw new BadCredentialsException("Invalid email or password");
		}

		Instant issuedAt = Instant.now(Clock.systemUTC());
		Instant expiresAt = issuedAt.plus(properties.accessTokenMinutes(), ChronoUnit.MINUTES);
		JwtClaimsSet claims = JwtClaimsSet.builder()
			.issuer("portfolio-api")
			.issuedAt(issuedAt)
			.expiresAt(expiresAt)
			.subject(user.getId().toString())
			.claim("email", user.getEmail())
			.claim("roles", List.of(user.getRole()))
			.build();
		String token = jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
		return new LoginResponse(token, "Bearer", OffsetDateTime.ofInstant(expiresAt, ZoneOffset.UTC));
	}
}
