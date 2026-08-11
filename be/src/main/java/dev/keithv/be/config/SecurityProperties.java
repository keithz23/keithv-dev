package dev.keithv.be.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "portfolio.security")
public record SecurityProperties(
	String jwtSecret,
	long accessTokenMinutes,
	String localAdminEmail,
	String localAdminPassword
) {
}
