package dev.keithv.be.auth;

import java.util.UUID;

public record AuthSessionResponse(UUID id, String email, String role) {
}
