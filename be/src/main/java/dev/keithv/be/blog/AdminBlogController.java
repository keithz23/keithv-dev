package dev.keithv.be.blog;

import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
public class AdminBlogController {
	private final BlogService blogService;

	public AdminBlogController(BlogService blogService) {
		this.blogService = blogService;
	}

	@PostMapping("/posts")
	@ResponseStatus(HttpStatus.CREATED)
	public PostDetailResponse createPost(@Valid @RequestBody PostCreateRequest request) {
		return blogService.createPost(request);
	}

	@PatchMapping("/posts/{id}")
	public PostDetailResponse patchPost(
		@PathVariable UUID id,
		@Valid @RequestBody PostPatchRequest request
	) {
		return blogService.patchPost(id, request);
	}

	@DeleteMapping("/posts/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void deletePost(@PathVariable UUID id) {
		blogService.deletePost(id);
	}

	@PostMapping("/tags")
	@ResponseStatus(HttpStatus.CREATED)
	public TagResponse createTag(@Valid @RequestBody TagCreateRequest request) {
		return blogService.createTag(request);
	}

	@DeleteMapping("/tags/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void deleteTag(@PathVariable UUID id) {
		blogService.deleteTag(id);
	}
}
