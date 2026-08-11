package dev.keithv.be.contact;

import jakarta.validation.constraints.NotNull;

public record ContactStatusPatchRequest(@NotNull ContactMessageStatus status) { }
