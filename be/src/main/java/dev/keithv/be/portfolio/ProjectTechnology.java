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
@Table(name = "project_technologies")
public class ProjectTechnology {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "project_id", nullable = false)
	private Project project;

	@Column(nullable = false)
	private String name;

	@Column(nullable = false)
	private int displayOrder;

	protected ProjectTechnology() {
	}

	ProjectTechnology(Project project, String name, int displayOrder) {
		this.project = project;
		this.name = name;
		this.displayOrder = displayOrder;
	}

	public UUID getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public int getDisplayOrder() {
		return displayOrder;
	}
}
