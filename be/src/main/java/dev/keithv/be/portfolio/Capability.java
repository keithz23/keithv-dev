package dev.keithv.be.portfolio;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;

@Entity
@Table(name = "capabilities")
public class Capability {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;

	@Column(nullable = false)
	private String itemIndex;

	@Column(nullable = false)
	private String title;

	@Column(nullable = false, columnDefinition = "TEXT")
	private String detail;

	@Column(nullable = false)
	private int displayOrder;

	protected Capability() {
	}

	public UUID getId() {
		return id;
	}

	public String getItemIndex() {
		return itemIndex;
	}

	public String getTitle() {
		return title;
	}

	public String getDetail() {
		return detail;
	}

	public int getDisplayOrder() {
		return displayOrder;
	}
}
