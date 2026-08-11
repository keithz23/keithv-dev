package dev.keithv.be.auth;

import dev.keithv.be.config.SecurityProperties;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private static final String ACCESS_TOKEN_COOKIE = "accessToken";

    private final AuthService authService;
    private final SecurityProperties properties;

    public AuthController(AuthService authService, SecurityProperties properties) {
        this.authService = authService;
        this.properties = properties;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthLoginResult loginResult = authService.login(request);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, accessTokenCookie(loginResult.accessToken(), properties.accessTokenMinutes() * 60).toString())
                .body(loginResult.response());
    }

    @GetMapping("/session")
    public AuthSessionResponse session(Authentication authentication) {
        JwtAuthenticationToken jwtAuthentication = (JwtAuthenticationToken) authentication;
        return new AuthSessionResponse(
                UUID.fromString(jwtAuthentication.getToken().getSubject()),
                jwtAuthentication.getToken().getClaimAsString("email"),
                jwtAuthentication.getToken().getClaimAsStringList("roles").stream()
                        .findFirst()
                        .orElse("USER")
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, accessTokenCookie("", 0).toString())
                .build();
    }

    private ResponseCookie accessTokenCookie(String token, long maxAgeSeconds) {
        return ResponseCookie.from(ACCESS_TOKEN_COOKIE, token)
                .httpOnly(true)
                .secure(properties.cookieSecure())
                .path("/")
                .maxAge(maxAgeSeconds)
                .sameSite("Strict")
                .build();
    }
}
