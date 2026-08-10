package dev.keithv.be.blog;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Clock;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "tags")
public class Tag {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;

	@Column(nullable = false, unique = true)
	private String name;

	@Column(nullable = false, unique = true)
	private String slug;

	@Column(nullable = false, updatable = false)
	private OffsetDateTime createdAt;

	protected Tag() {
	}

	public Tag(String name, String slug) {
		this.name = name;
		this.slug = slug;
	}

	@PrePersist
	void onCreate() {
		createdAt = OffsetDateTime.now(Clock.systemUTC());
	}

	public UUID getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public String getSlug() {
		return slug;
	}

	public OffsetDateTime getCreatedAt() {
		return createdAt;
	}
}
