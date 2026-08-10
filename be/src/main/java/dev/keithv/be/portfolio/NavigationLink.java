package dev.keithv.be.portfolio;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;

@Entity
@Table(name = "navigation_links")
public class NavigationLink {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;

	@Column(nullable = false)
	private String label;

	@Column(nullable = false)
	private String targetId;

	@Column(nullable = false)
	private int displayOrder;

	protected NavigationLink() {
	}

	public UUID getId() {
		return id;
	}

	public String getLabel() {
		return label;
	}

	public String getTargetId() {
		return targetId;
	}

	public int getDisplayOrder() {
		return displayOrder;
	}
}
