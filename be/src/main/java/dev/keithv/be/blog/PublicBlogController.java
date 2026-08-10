package dev.keithv.be.blog;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping
public class PublicBlogController {
	private final BlogService blogService;

	public PublicBlogController(BlogService blogService) {
		this.blogService = blogService;
	}

	@GetMapping("/posts")
	public PageResponse<PostSummaryResponse> posts(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(required = false) String tag
	) {
		return blogService.getPublishedPosts(page, size, tag);
	}

	@GetMapping("/posts/{slug}")
	public PostDetailResponse post(@PathVariable String slug) {
		return blogService.getPublishedPost(slug);
	}

	@GetMapping("/tags")
	public List<TagResponse> tags() {
		return blogService.getTags();
	}
}
