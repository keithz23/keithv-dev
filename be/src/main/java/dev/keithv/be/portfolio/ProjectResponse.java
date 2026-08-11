package dev.keithv.be.portfolio;

import java.util.List;
import java.util.UUID;

public record ProjectResponse(
	UUID id,
	String number,
	String slug,
	String title,
	String label,
	String description,
	List<String> highlights,
	List<String> tech,
	String github,
	String visualKey,
	String iconKey,
	boolean isFeatured,
	int displayOrder
) {
}
