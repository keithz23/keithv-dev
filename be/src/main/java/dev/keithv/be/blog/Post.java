package dev.keithv.be.blog;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.Clock;
import java.time.OffsetDateTime;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "posts")
public class Post {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;

	@Column(nullable = false)
	private String title;

	@Column(nullable = false, unique = true)
	private String slug;

	@Column(nullable = false)
	private String excerpt;

	@Column(nullable = false, columnDefinition = "TEXT")
	private String content;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private PostStatus status;

	private OffsetDateTime publishedAt;

	@Column(nullable = false)
	private OffsetDateTime createdAt;

	@Column(nullable = false)
	private OffsetDateTime updatedAt;

	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(
		name = "post_tags",
		joinColumns = @JoinColumn(name = "post_id"),
		inverseJoinColumns = @JoinColumn(name = "tag_id")
	)
	private Set<Tag> tags = new LinkedHashSet<>();

	protected Post() {
	}

	public Post(
		String title,
		String slug,
		String excerpt,
		String content,
		PostStatus status,
		OffsetDateTime publishedAt,
		Set<Tag> tags
	) {
		this.title = title;
		this.slug = slug;
		this.excerpt = excerpt;
		this.content = content;
		this.status = status;
		this.publishedAt = publishedAt;
		this.tags = new LinkedHashSet<>(tags);
	}

	@PrePersist
	void onCreate() {
		OffsetDateTime now = OffsetDateTime.now(Clock.systemUTC());
		createdAt = now;
		updatedAt = now;
	}

	@PreUpdate
	void onUpdate() {
		updatedAt = OffsetDateTime.now(Clock.systemUTC());
	}

	public void update(
		String title,
		String slug,
		String excerpt,
		String content,
		PostStatus status,
		OffsetDateTime publishedAt,
		Set<Tag> tags
	) {
		if (title != null) this.title = title;
		if (slug != null) this.slug = slug;
		if (excerpt != null) this.excerpt = excerpt;
		if (content != null) this.content = content;
		if (status != null) this.status = status;
		if (publishedAt != null || status == PostStatus.DRAFT) this.publishedAt = publishedAt;
		if (tags != null) this.tags = new LinkedHashSet<>(tags);
	}

	public UUID getId() {
		return id;
	}

	public String getTitle() {
		return title;
	}

	public String getSlug() {
		return slug;
	}

	public String getExcerpt() {
		return excerpt;
	}

	public String getContent() {
		return content;
	}

	public PostStatus getStatus() {
		return status;
	}

	public OffsetDateTime getPublishedAt() {
		return publishedAt;
	}

	public OffsetDateTime getCreatedAt() {
		return createdAt;
	}

	public OffsetDateTime getUpdatedAt() {
		return updatedAt;
	}

	public Set<Tag> getTags() {
		return tags;
	}
}
