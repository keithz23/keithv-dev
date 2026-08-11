package dev.keithv.be.auth;

import java.time.OffsetDateTime;

public record LoginResponse(OffsetDateTime expiresAt) {
}
