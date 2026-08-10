package dev.keithv.be.portfolio;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;

@Entity
@Table(name = "social_links")
public class SocialLink {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;

	@Column(nullable = false)
	private String label;

	@Column(nullable = false)
	private String url;

	@Column(nullable = false)
	private int displayOrder;

	protected SocialLink() {
	}

	public UUID getId() {
		return id;
	}

	public String getLabel() {
		return label;
	}

	public String getUrl() {
		return url;
	}

	public int getDisplayOrder() {
		return displayOrder;
	}
}
