package dev.keithv.be.auth;

public record AuthLoginResult(LoginResponse response, String accessToken) {
}
