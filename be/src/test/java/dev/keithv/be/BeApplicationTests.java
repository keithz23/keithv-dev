package dev.keithv.be;

import dev.keithv.be.auth.AdminUser;
import dev.keithv.be.auth.AdminUserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import jakarta.servlet.http.Cookie;
import org.springframework.test.web.servlet.request.RequestPostProcessor;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.everyItem;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;

@SpringBootTest
@AutoConfigureMockMvc
class BeApplicationTests {
	@Autowired
	private MockMvc mvc;
	@Autowired
	private AdminUserRepository userRepository;
	@Autowired
	private PasswordEncoder passwordEncoder;

	@BeforeEach
	void ensureAdminUser() {
		if (!userRepository.existsByEmailIgnoreCase("admin@test.local")) {
			userRepository.save(new AdminUser("admin@test.local", passwordEncoder.encode("test-password")));
		}
	}

	private RequestPostProcessor adminJwt() {
		return jwt().authorities(new SimpleGrantedAuthority("ROLE_ADMIN"));
	}

	@Test
	void contextLoads() {
	}

	@Test
	void portfolioEndpointReturnsSeededContent() throws Exception {
		mvc.perform(get("/portfolio"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.profile.name").value("Keith Vuong"))
			.andExpect(jsonPath("$.projects[0].title").value("Bluesky Social"));
	}

	@Test
	void contactEndpointAcceptsValidMessage() throws Exception {
		String payload = """
			{
			  "name": "Taylor",
			  "email": "taylor@example.com",
			  "message": "I would like to discuss a portfolio project backend integration."
			}
			""";

		mvc.perform(post("/contact-messages")
				.contentType(MediaType.APPLICATION_JSON)
				.content(payload))
			.andExpect(status().isCreated())
			.andExpect(jsonPath("$.status").value("NEW"));
	}

	@Test
	void publicPostsOnlyReturnPublishedPosts() throws Exception {
		mvc.perform(get("/posts"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.content[*].status", everyItem(is("PUBLISHED"))))
			.andExpect(jsonPath("$.content[*].slug", not(hasItem("draft-notes-on-blog-search"))));
	}

	@Test
	void draftPostSlugIsHiddenFromPublicEndpoint() throws Exception {
		mvc.perform(get("/posts/draft-notes-on-blog-search"))
			.andExpect(status().isNotFound());
	}

	@Test
	void publicPostsCanFilterByTagSlug() throws Exception {
		mvc.perform(get("/posts").param("tag", "postgresql"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.content[*].tags[*].slug").exists());
	}

	@Test
	void adminCanListDraftAndPublishedPosts() throws Exception {
		mvc.perform(get("/admin/posts").with(adminJwt()))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.content[*].status", hasItem("DRAFT")))
			.andExpect(jsonPath("$.content[*].status", hasItem("PUBLISHED")));
	}

	@Test
	void adminCanReadPostDetail() throws Exception {
		mvc.perform(get("/admin/posts/20000000-0000-0000-0000-000000000003").with(adminJwt()))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.slug").value("draft-notes-on-blog-search"))
			.andExpect(jsonPath("$.content").isNotEmpty());
	}

	@Test
	void adminCanCreateDraftPost() throws Exception {
		String payload = """
			{
			  "title": "Queue Boundaries in Portfolio APIs",
			  "slug": "queue-boundaries-in-portfolio-apis",
			  "excerpt": "A draft note about keeping async boundaries explicit.",
			  "content": "Draft content that can be expanded later.",
			  "status": "DRAFT",
			  "tagSlugs": ["backend"]
			}
			""";

		mvc.perform(post("/admin/posts").with(adminJwt())
				.contentType(MediaType.APPLICATION_JSON)
				.content(payload))
			.andExpect(status().isCreated())
			.andExpect(jsonPath("$.status").value("DRAFT"))
			.andExpect(jsonPath("$.slug").value("queue-boundaries-in-portfolio-apis"));
	}

	@Test
	void adminCannotDeleteAttachedTag() throws Exception {
		mvc.perform(delete("/admin/tags/10000000-0000-0000-0000-000000000002").with(adminJwt()))
			.andExpect(status().isConflict());
	}

	@Test
	void adminCanCreateProject() throws Exception {
		String payload = """
			{
			  "number": "99",
			  "slug": "project-module-test",
			  "title": "Project Module Test",
			  "label": "Backend integration",
			  "description": "A project created by the project module integration test.",
			  "github": "https://github.com/example/project-module-test",
			  "iconKey": "code",
			  "isFeatured": false,
			  "displayOrder": 99,
			  "highlights": ["Validated project creation"],
			  "tech": ["Java", "Spring Boot"]
			}
			""";

		mvc.perform(post("/admin/projects").with(adminJwt())
				.contentType(MediaType.APPLICATION_JSON)
				.content(payload))
			.andExpect(status().isCreated())
			.andExpect(jsonPath("$.slug").value("project-module-test"))
			.andExpect(jsonPath("$.tech[0]").value("Java"));
	}

	@Test
	void adminCanCreateCapability() throws Exception {
		String payload = """
			{
			  "index": "99",
			  "title": "API integration testing",
			  "detail": "A capability created through the protected admin API.",
			  "displayOrder": 99
			}
			""";

		mvc.perform(post("/admin/capabilities").with(adminJwt())
				.contentType(MediaType.APPLICATION_JSON)
				.content(payload))
			.andExpect(status().isCreated())
			.andExpect(jsonPath("$.title").value("API integration testing"))
			.andExpect(jsonPath("$.displayOrder").value(99));
	}

	@Test
	void adminCanListContactMessages() throws Exception {
		mvc.perform(get("/admin/contact-messages").with(adminJwt()))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.content").isArray());
	}

	@Test
	void createProjectRejectsInvalidRequest() throws Exception {
		mvc.perform(post("/admin/projects").with(adminJwt())
				.contentType(MediaType.APPLICATION_JSON)
				.content("{}"))
			.andExpect(status().isBadRequest())
			.andExpect(jsonPath("$.message").value("Validation failed"))
			.andExpect(jsonPath("$.fieldErrors.slug").exists());
	}

	@Test
	void createProjectRejectsDuplicateSlug() throws Exception {
		String payload = """
			{
			  "number": "98",
			  "slug": "bluesky-social",
			  "title": "Duplicate Slug Test",
			  "label": "Backend integration",
			  "description": "This payload intentionally reuses a seeded slug.",
			  "iconKey": "code",
			  "isFeatured": false,
			  "displayOrder": 98,
			  "highlights": ["Duplicate detection"],
			  "tech": ["Java"]
			}
			""";

		mvc.perform(post("/admin/projects").with(adminJwt())
				.contentType(MediaType.APPLICATION_JSON)
				.content(payload))
			.andExpect(status().isConflict())
			.andExpect(jsonPath("$.message").value("Project slug already exists"));
	}

	@Test
	void getProjectBySlugReturnsNotFound() throws Exception {
		mvc.perform(get("/projects/project-that-does-not-exist"))
			.andExpect(status().isNotFound())
			.andExpect(jsonPath("$.message").value("Project not found"));
	}

	@Test
	void adminEndpointRequiresAuthentication() throws Exception {
		mvc.perform(post("/admin/projects")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{}"))
			.andExpect(status().isUnauthorized())
			.andExpect(jsonPath("$.code").value("UNAUTHENTICATED"));
	}

	@Test
	void adminPreflightAllowsLocalFrontendOrigin() throws Exception {
		mvc.perform(options("/admin/projects")
				.header("Origin", "http://localhost:3000")
				.header("Access-Control-Request-Method", "PATCH")
				.header("Access-Control-Request-Headers", "authorization"))
			.andExpect(status().isOk())
			.andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:3000"))
			.andExpect(header().string("Access-Control-Allow-Methods", org.hamcrest.Matchers.containsString("PATCH")))
			.andExpect(header().string("Access-Control-Allow-Headers", org.hamcrest.Matchers.containsStringIgnoringCase("authorization")));
	}

	@Test
	void nonAdminTokenCannotAccessAdminEndpoint() throws Exception {
		mvc.perform(post("/admin/projects")
				.with(jwt().authorities(new SimpleGrantedAuthority("ROLE_USER")))
				.contentType(MediaType.APPLICATION_JSON)
				.content("{}"))
			.andExpect(status().isForbidden())
			.andExpect(jsonPath("$.code").value("FORBIDDEN"));
	}

	@Test
	void adminCanLogin() throws Exception {
		String payload = """
			{"email":"admin@test.local","password":"test-password"}
			""";
		mvc.perform(post("/auth/login")
				.contentType(MediaType.APPLICATION_JSON)
				.content(payload))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.accessToken").doesNotExist())
			.andExpect(jsonPath("$.expiresAt").isNotEmpty())
			.andExpect(header().string(HttpHeaders.SET_COOKIE, org.hamcrest.Matchers.containsString("HttpOnly")));
	}

	@Test
	void adminCanReadSessionFromCookie() throws Exception {
		String payload = """
			{"email":"admin@test.local","password":"test-password"}
			""";
		MvcResult login = mvc.perform(post("/auth/login")
				.contentType(MediaType.APPLICATION_JSON)
				.content(payload))
			.andReturn();
		String setCookie = login.getResponse().getHeader(HttpHeaders.SET_COOKIE);
		String token = setCookie.substring(setCookie.indexOf('=') + 1, setCookie.indexOf(';'));

		mvc.perform(get("/auth/session").cookie(new Cookie("accessToken", token)))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.email").value("admin@test.local"))
			.andExpect(jsonPath("$.role").value("ADMIN"));
	}

	@Test
	void logoutClearsAuthenticationCookie() throws Exception {
		mvc.perform(post("/auth/logout"))
			.andExpect(status().isNoContent())
			.andExpect(header().string(HttpHeaders.SET_COOKIE, org.hamcrest.Matchers.containsString("Max-Age=0")));
	}
}
