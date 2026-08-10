package dev.keithv.be.portfolio;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.util.UUID;

@Entity
@Table(name = "project_highlights")
public class ProjectHighlight {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "project_id", nullable = false)
	private Project project;

	@Column(nullable = false, columnDefinition = "TEXT")
	private String text;

	@Column(nullable = false)
	private int displayOrder;

	protected ProjectHighlight() {
	}

	public UUID getId() {
		return id;
	}

	public String getText() {
		return text;
	}

	public int getDisplayOrder() {
		return displayOrder;
	}
}
