package dev.keithv.be.config;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

class SecurityConfigTests {
	@Test
	void acceptsAnUnpaddedBase64UrlEncodedHs256Secret() {
		SecurityProperties properties = propertiesWithSecret(
			"oxCHvPwBodcx1t6mDCJAyK3ZazxWCkWd1RLpZDlPUVe"
		);

		assertDoesNotThrow(() -> SecurityConfig.jwtKey(properties));
	}

	@Test
	void acceptsAStandardBase64EncodedHs256Secret() {
		SecurityProperties properties = propertiesWithSecret(
			"//////////////////////////////////////////8="
		);

		assertDoesNotThrow(() -> SecurityConfig.jwtKey(properties));
	}

	@Test
	void rejectsASecretThatDecodesToLessThan256Bits() {
		SecurityProperties properties = propertiesWithSecret("YWJj");

		IllegalStateException exception = assertThrows(
			IllegalStateException.class,
			() -> SecurityConfig.jwtKey(properties)
		);
		assertEquals(
			"JWT_SECRET must decode to at least 32 bytes (256 bits) for HS256",
			exception.getMessage()
		);
	}

	@Test
	void rejectsASecretThatIsNotBase64UrlEncoded() {
		SecurityProperties properties = propertiesWithSecret("not a base64url key!");

		IllegalStateException exception = assertThrows(
			IllegalStateException.class,
			() -> SecurityConfig.jwtKey(properties)
		);
		assertEquals(
			"JWT_SECRET must be a Base64 or Base64URL-encoded HS256 key",
			exception.getMessage()
		);
	}

	private SecurityProperties propertiesWithSecret(String secret) {
		return new SecurityProperties(secret, 60, null, null, false);
	}
}
