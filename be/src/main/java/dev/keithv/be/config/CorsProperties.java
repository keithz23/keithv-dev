package dev.keithv.be.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "portfolio.cors")
public record CorsProperties(String allowedOrigins) {
}
