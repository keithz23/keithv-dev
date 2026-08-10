package dev.keithv.be.portfolio;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "projects")
public class Project {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;

	@Column(nullable = false)
	private String number;

	@Column(nullable = false)
	private String title;

	@Column(nullable = false)
	private String label;

	@Column(nullable = false, columnDefinition = "TEXT")
	private String description;

	private String githubUrl;

	private String visualKey;

	@Column(nullable = false)
	private String iconKey;

	@Column(nullable = false)
	private boolean isFeatured;

	@Column(nullable = false)
	private int displayOrder;

	@OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
	@OrderBy("displayOrder ASC")
	private List<ProjectHighlight> highlights = new ArrayList<>();

	@OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
	@OrderBy("displayOrder ASC")
	private List<ProjectTechnology> technologies = new ArrayList<>();

	protected Project() {
	}

	public UUID getId() {
		return id;
	}

	public String getNumber() {
		return number;
	}

	public String getTitle() {
		return title;
	}

	public String getLabel() {
		return label;
	}

	public String getDescription() {
		return description;
	}

	public String getGithubUrl() {
		return githubUrl;
	}

	public String getVisualKey() {
		return visualKey;
	}

	public String getIconKey() {
		return iconKey;
	}

	public boolean isFeatured() {
		return isFeatured;
	}

	public int getDisplayOrder() {
		return displayOrder;
	}

	public List<ProjectHighlight> getHighlights() {
		return highlights;
	}

	public List<ProjectTechnology> getTechnologies() {
		return technologies;
	}
}
