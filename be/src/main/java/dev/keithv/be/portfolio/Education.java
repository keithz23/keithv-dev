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
