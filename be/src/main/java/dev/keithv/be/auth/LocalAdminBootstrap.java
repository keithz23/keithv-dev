package dev.keithv.be.auth;

import dev.keithv.be.config.SecurityProperties;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Profile("local")
public class LocalAdminBootstrap implements ApplicationRunner {
	private final AdminUserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final SecurityProperties properties;

	public LocalAdminBootstrap(
		AdminUserRepository userRepository,
		PasswordEncoder passwordEncoder,
		SecurityProperties properties
	) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.properties = properties;
	}

	@Override
	@Transactional
	public void run(ApplicationArguments args) {
		String email = normalize(properties.localAdminEmail());
		String password = normalize(properties.localAdminPassword());
		if (email == null || password == null || userRepository.existsByEmailIgnoreCase(email)) {
			return;
		}
		userRepository.save(new AdminUser(email, passwordEncoder.encode(password)));
	}

	private String normalize(String value) {
		if (value == null || value.isBlank()) return null;
		return value.trim();
	}
}
