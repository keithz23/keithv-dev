package dev.keithv.be;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.everyItem;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class BeApplicationTests {
	@Autowired
	private MockMvc mvc;

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

		mvc.perform(post("/admin/posts")
				.contentType(MediaType.APPLICATION_JSON)
				.content(payload))
			.andExpect(status().isCreated())
			.andExpect(jsonPath("$.status").value("DRAFT"))
			.andExpect(jsonPath("$.slug").value("queue-boundaries-in-portfolio-apis"));
	}

	@Test
	void adminCannotDeleteAttachedTag() throws Exception {
		mvc.perform(delete("/admin/tags/10000000-0000-0000-0000-000000000002"))
			.andExpect(status().isConflict());
	}
}
