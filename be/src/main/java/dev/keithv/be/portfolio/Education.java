package dev.keithv.be.portfolio;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;

@Entity
@Table(name = "educations")
public class Education {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;

	@Column(nullable = false)
	private String degree;

	@Column(nullable = false)
	private String institution;

	@Column(nullable = false)
	private String focus;

	@Column(nullable = false)
	private int displayOrder;

	protected Education() {
	}
	public Education(String degree, String institution, String focus, int displayOrder) {
		this.degree = degree; this.institution = institution; this.focus = focus; this.displayOrder = displayOrder;
	}
	public void update(String degree, String institution, String focus, Integer displayOrder) {
		if (degree != null) this.degree = degree;
		if (institution != null) this.institution = institution;
		if (focus != null) this.focus = focus;
		if (displayOrder != null) this.displayOrder = displayOrder;
	}

	public UUID getId() {
		return id;
	}

	public String getDegree() {
		return degree;
	}

	public String getInstitution() {
		return institution;
	}

	public String getFocus() {
		return focus;
	}

	public int getDisplayOrder() {
		return displayOrder;
	}
}
