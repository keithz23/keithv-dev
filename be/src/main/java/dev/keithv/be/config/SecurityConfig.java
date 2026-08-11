package dev.keithv.be.config;

import dev.keithv.be.common.SecurityErrorWriter;
import java.util.Base64;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.http.HttpMethod;

@Configuration
@EnableConfigurationProperties(SecurityProperties.class)
public class SecurityConfig {
	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http, SecurityErrorWriter errors) throws Exception {
		http
			.csrf((csrf) -> csrf.disable())
			.cors(Customizer.withDefaults())
			.sessionManagement((sessions) -> sessions.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
			.authorizeHttpRequests((requests) -> requests
				.requestMatchers("/admin/**").hasRole("ADMIN")
				.requestMatchers(HttpMethod.POST, "/auth/login", "/contact-messages").permitAll()
				.requestMatchers(HttpMethod.GET, "/portfolio", "/profile", "/navigation-links", "/social-links", "/capabilities", "/experiences", "/educations", "/projects/**", "/posts/**", "/tags", "/actuator/health", "/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
				.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
				.anyRequest().authenticated()
			)
			.oauth2ResourceServer((oauth) -> oauth
				.jwt((jwt) -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
				.authenticationEntryPoint(errors)
				.accessDeniedHandler(errors)
			)
			.exceptionHandling((exceptions) -> exceptions
				.authenticationEntryPoint(errors)
				.accessDeniedHandler(errors)
			)
			.httpBasic(AbstractHttpConfigurer::disable);
		return http.build();
	}

	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	JwtEncoder jwtEncoder(SecurityProperties properties) {
		return NimbusJwtEncoder.withSecretKey(jwtKey(properties)).build();
	}

	@Bean
	JwtDecoder jwtDecoder(SecurityProperties properties) {
		return NimbusJwtDecoder.withSecretKey(jwtKey(properties)).build();
	}

	static SecretKey jwtKey(SecurityProperties properties) {
		byte[] secret = decodeJwtSecret(properties.jwtSecret());
		if (secret.length < 32) {
			throw new IllegalStateException(
				"JWT_SECRET must decode to at least 32 bytes (256 bits) for HS256"
			);
		}
		return new SecretKeySpec(secret, "HmacSHA256");
	}

	private static byte[] decodeJwtSecret(String encodedSecret) {
		try {
			return Base64.getUrlDecoder().decode(encodedSecret);
		} catch (IllegalArgumentException urlException) {
			try {
				return Base64.getDecoder().decode(encodedSecret);
			} catch (IllegalArgumentException standardException) {
				throw new IllegalStateException(
					"JWT_SECRET must be a Base64 or Base64URL-encoded HS256 key",
					standardException
				);
			}
		}
	}

	private JwtAuthenticationConverter jwtAuthenticationConverter() {
		JwtGrantedAuthoritiesConverter authorities = new JwtGrantedAuthoritiesConverter();
		authorities.setAuthoritiesClaimName("roles");
		authorities.setAuthorityPrefix("ROLE_");
		JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
		converter.setJwtGrantedAuthoritiesConverter(authorities);
		return converter;
	}
}
