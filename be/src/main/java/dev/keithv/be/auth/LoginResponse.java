package dev.keithv.be.auth;

import java.time.OffsetDateTime;

public record LoginResponse(String accessToken, String tokenType, OffsetDateTime expiresAt) {
}
