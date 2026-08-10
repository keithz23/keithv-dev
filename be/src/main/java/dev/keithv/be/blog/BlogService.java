package dev.keithv.be.blog;

import dev.keithv.be.common.BadRequestException;
import dev.keithv.be.common.ConflictException;
import dev.keithv.be.common.ResourceNotFoundException;
import java.time.OffsetDateTime;
import java.util.Collection;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BlogService {
	private static final int MAX_PAGE_SIZE = 50;

	private final PostRepository postRepository;
	private final TagRepository tagRepository;

	public BlogService(PostRepository postRepository, TagRepository tagRepository) {
		this.postRepository = postRepository;
		this.tagRepository = tagRepository;
	}

	@Transactional(readOnly = true)
	public PageResponse<PostSummaryResponse> getPublishedPosts(int page, int size, String tagSlug) {
		PageRequest pageable = PageRequest.of(normalizePage(page), normalizeSize(size));
		Page<Post> posts = tagSlug == null || tagSlug.isBlank()
			? postRepository.findPublicPosts(PostStatus.PUBLISHED, pageable)
			: postRepository.findPublicPostsByTag(PostStatus.PUBLISHED, tagSlug.trim(), pageable);

		return new PageResponse<>(
			posts.getContent().stream().map(this::toSummary).toList(),
			posts.getNumber(),
			posts.getSize(),
			posts.getTotalElements(),
			posts.getTotalPages()
		);
	}

	@Transactional(readOnly = true)
	public PostDetailResponse getPublishedPost(String slug) {
		return postRepository.findBySlugAndStatus(slug, PostStatus.PUBLISHED)
			.map(this::toDetail)
			.orElseThrow(() -> new ResourceNotFoundException("Published post not found"));
	}

	@Transactional(readOnly = true)
	public List<TagResponse> getTags() {
		return tagRepository.findAllByOrderByNameAsc().stream()
			.map(this::toTag)
			.toList();
	}

	@Transactional
	public PostDetailResponse createPost(PostCreateRequest request) {
		String slug = request.slug().trim();
		if (postRepository.existsBySlug(slug)) {
			throw new ConflictException("Post slug already exists");
		}
		validatePublishedState(request.status(), request.publishedAt());

		Post post = new Post(
			request.title().trim(),
			slug,
			request.excerpt().trim(),
			request.content().trim(),
			request.status(),
			request.publishedAt(),
			resolveTags(request.tagSlugs())
		);
		return toDetail(postRepository.save(post));
	}

	@Transactional
	public PostDetailResponse patchPost(UUID id, PostPatchRequest request) {
		Post post = postRepository.findById(id)
			.orElseThrow(() -> new ResourceNotFoundException("Post not found"));

		String nextSlug = normalizeNullable(request.slug());
		if (nextSlug != null && postRepository.existsBySlugAndIdNot(nextSlug, id)) {
			throw new ConflictException("Post slug already exists");
		}

		PostStatus nextStatus = request.status() == null ? post.getStatus() : request.status();
		OffsetDateTime nextPublishedAt = request.publishedAt() == null
			? post.getPublishedAt()
			: request.publishedAt();
		if (request.status() == PostStatus.DRAFT && request.publishedAt() == null) {
			nextPublishedAt = null;
		}
		validatePublishedState(nextStatus, nextPublishedAt);

		post.update(
			normalizeNullable(request.title()),
			nextSlug,
			normalizeNullable(request.excerpt()),
			normalizeNullable(request.content()),
			request.status(),
			nextPublishedAt,
			request.tagSlugs() == null ? null : resolveTags(request.tagSlugs())
		);

		return toDetail(post);
	}

	@Transactional
	public void deletePost(UUID id) {
		if (!postRepository.existsById(id)) {
			throw new ResourceNotFoundException("Post not found");
		}
		postRepository.deleteById(id);
	}

	@Transactional
	public TagResponse createTag(TagCreateRequest request) {
		String name = request.name().trim();
		String slug = request.slug().trim();
		if (tagRepository.existsByName(name)) {
			throw new ConflictException("Tag name already exists");
		}
		if (tagRepository.existsBySlug(slug)) {
			throw new ConflictException("Tag slug already exists");
		}
		return toTag(tagRepository.save(new Tag(name, slug)));
	}

	@Transactional
	public void deleteTag(UUID id) {
		Tag tag = tagRepository.findById(id)
			.orElseThrow(() -> new ResourceNotFoundException("Tag not found"));
		if (tagRepository.countPostsUsingTag(id) > 0) {
			throw new ConflictException("Tag is still attached to one or more posts");
		}
		tagRepository.delete(tag);
	}

	private int normalizePage(int page) {
		if (page < 0) {
			throw new BadRequestException("Page must be at least 0");
		}
		return page;
	}

	private int normalizeSize(int size) {
		if (size < 1) {
			throw new BadRequestException("Page size must be at least 1");
		}
		return Math.min(size, MAX_PAGE_SIZE);
	}

	private void validatePublishedState(PostStatus status, OffsetDateTime publishedAt) {
		if (status == PostStatus.PUBLISHED && publishedAt == null) {
			throw new BadRequestException("publishedAt is required for published posts");
		}
	}

	private Set<Tag> resolveTags(Collection<String> tagSlugs) {
		if (tagSlugs == null || tagSlugs.isEmpty()) {
			return Set.of();
		}
		Set<String> normalized = tagSlugs.stream()
			.map(String::trim)
			.filter((slug) -> !slug.isBlank())
			.collect(java.util.stream.Collectors.toCollection(LinkedHashSet::new));
		List<Tag> tags = tagRepository.findAllBySlugIn(normalized);
		Set<String> found = tags.stream()
			.map(Tag::getSlug)
			.collect(java.util.stream.Collectors.toSet());
		List<String> missing = normalized.stream()
			.filter((slug) -> !found.contains(slug))
			.toList();
		if (!missing.isEmpty()) {
			throw new BadRequestException("Unknown tag slug: " + missing.getFirst());
		}
		return new LinkedHashSet<>(tags);
	}

	private String normalizeNullable(String value) {
		if (value == null) {
			return null;
		}
		return value.trim();
	}

	private PostSummaryResponse toSummary(Post post) {
		return new PostSummaryResponse(
			post.getId(),
			post.getTitle(),
			post.getSlug(),
			post.getExcerpt(),
			post.getStatus(),
			post.getPublishedAt(),
			post.getCreatedAt(),
			post.getUpdatedAt(),
			toTags(post)
		);
	}

	private PostDetailResponse toDetail(Post post) {
		return new PostDetailResponse(
			post.getId(),
			post.getTitle(),
			post.getSlug(),
			post.getExcerpt(),
			post.getContent(),
			post.getStatus(),
			post.getPublishedAt(),
			post.getCreatedAt(),
			post.getUpdatedAt(),
			toTags(post)
		);
	}

	private List<TagResponse> toTags(Post post) {
		return post.getTags().stream()
			.sorted(Comparator.comparing(Tag::getName))
			.map(this::toTag)
			.toList();
	}

	private TagResponse toTag(Tag tag) {
		return new TagResponse(tag.getId(), tag.getName(), tag.getSlug(), tag.getCreatedAt());
	}
}
