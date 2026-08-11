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

	@Column(nullable = false, unique = true)
	private String slug;

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

	public Project(
		String number,
		String slug,
		String title,
		String label,
		String description,
		String githubUrl,
		String visualKey,
		String iconKey,
		boolean isFeatured,
		int displayOrder,
		List<String> highlights,
		List<String> technologies
	) {
		this.number = number;
		this.slug = slug;
		this.title = title;
		this.label = label;
		this.description = description;
		this.githubUrl = githubUrl;
		this.visualKey = visualKey;
		this.iconKey = iconKey;
		this.isFeatured = isFeatured;
		this.displayOrder = displayOrder;
		replaceHighlights(highlights);
		replaceTechnologies(technologies);
	}

	public void update(
		String number,
		String slug,
		String title,
		String label,
		String description,
		String githubUrl,
		String visualKey,
		String iconKey,
		Boolean isFeatured,
		Integer displayOrder,
		List<String> highlights,
		List<String> technologies
	) {
		if (number != null) this.number = number;
		if (slug != null) this.slug = slug;
		if (title != null) this.title = title;
		if (label != null) this.label = label;
		if (description != null) this.description = description;
		if (githubUrl != null) this.githubUrl = githubUrl;
		if (visualKey != null) this.visualKey = visualKey;
		if (iconKey != null) this.iconKey = iconKey;
		if (isFeatured != null) this.isFeatured = isFeatured;
		if (displayOrder != null) this.displayOrder = displayOrder;
		if (highlights != null) replaceHighlights(highlights);
		if (technologies != null) replaceTechnologies(technologies);
	}

	private void replaceHighlights(List<String> values) {
		highlights.clear();
		for (int index = 0; index < values.size(); index++) {
			highlights.add(new ProjectHighlight(this, values.get(index), index + 1));
		}
	}

	private void replaceTechnologies(List<String> values) {
		technologies.clear();
		for (int index = 0; index < values.size(); index++) {
			technologies.add(new ProjectTechnology(this, values.get(index), index + 1));
		}
	}

	public UUID getId() {
		return id;
	}

	public String getNumber() {
		return number;
	}

	public String getSlug() {
		return slug;
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
