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
@Table(name = "work_experiences")
public class WorkExperience {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;

	@Column(nullable = false)
	private String role;

	@Column(nullable = false)
	private String company;

	@Column(nullable = false)
	private String location;

	@Column(nullable = false)
	private String period;

	@Column(nullable = false)
	private String detailLinkLabel;

	@Column(nullable = false)
	private String detailLinkUrl;

	@Column(nullable = false)
	private int displayOrder;

	@OneToMany(mappedBy = "experience", cascade = CascadeType.ALL, orphanRemoval = true)
	@OrderBy("displayOrder ASC")
	private List<WorkExperienceHighlight> highlights = new ArrayList<>();

	protected WorkExperience() {
	}
	public WorkExperience(String role, String company, String location, String period, String detailLinkLabel, String detailLinkUrl, int displayOrder, List<String> highlights) {
		this.role = role; this.company = company; this.location = location; this.period = period;
		this.detailLinkLabel = detailLinkLabel; this.detailLinkUrl = detailLinkUrl; this.displayOrder = displayOrder;
		replaceHighlights(highlights);
	}
	public void update(String role, String company, String location, String period, String detailLinkLabel, String detailLinkUrl, Integer displayOrder, List<String> highlights) {
		if (role != null) this.role = role;
		if (company != null) this.company = company;
		if (location != null) this.location = location;
		if (period != null) this.period = period;
		if (detailLinkLabel != null) this.detailLinkLabel = detailLinkLabel;
		if (detailLinkUrl != null) this.detailLinkUrl = detailLinkUrl;
		if (displayOrder != null) this.displayOrder = displayOrder;
		if (highlights != null) replaceHighlights(highlights);
	}
	private void replaceHighlights(List<String> values) {
		highlights.clear();
		for (int index = 0; index < values.size(); index++) highlights.add(new WorkExperienceHighlight(this, values.get(index), index + 1));
	}

	public UUID getId() {
		return id;
	}

	public String getRole() {
		return role;
	}

	public String getCompany() {
		return company;
	}

	public String getLocation() {
		return location;
	}

	public String getPeriod() {
		return period;
	}

	public String getDetailLinkLabel() {
		return detailLinkLabel;
	}

	public String getDetailLinkUrl() {
		return detailLinkUrl;
	}

	public int getDisplayOrder() {
		return displayOrder;
	}

	public List<WorkExperienceHighlight> getHighlights() {
		return highlights;
	}
}
