package dev.keithv.be.portfolio;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;

@Entity
@Table(name = "hero_principles")
public class HeroPrinciple {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;

	@Column(nullable = false)
	private String text;

	@Column(nullable = false)
	private int displayOrder;

	protected HeroPrinciple() {
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
