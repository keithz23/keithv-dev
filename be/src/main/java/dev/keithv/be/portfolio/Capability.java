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
	public Capability(String itemIndex, String title, String detail, int displayOrder) {
		this.itemIndex = itemIndex; this.title = title; this.detail = detail; this.displayOrder = displayOrder;
	}
	public void update(String itemIndex, String title, String detail, Integer displayOrder) {
		if (itemIndex != null) this.itemIndex = itemIndex;
		if (title != null) this.title = title;
		if (detail != null) this.detail = detail;
		if (displayOrder != null) this.displayOrder = displayOrder;
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
