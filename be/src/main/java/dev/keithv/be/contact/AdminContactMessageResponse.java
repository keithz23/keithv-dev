package dev.keithv.be.contact;

import java.time.OffsetDateTime;
import java.util.UUID;

public record AdminContactMessageResponse(UUID id, String name, String email, String message, ContactMessageStatus status, OffsetDateTime createdAt) { }
