package dev.keithv.be.portfolio;

import org.springframework.stereotype.Component;

@Component
public class ProjectMapper {
	public ProjectResponse toResponse(Project project) {
		return new ProjectResponse(
			project.getId(),
			project.getNumber(),
			project.getSlug(),
			project.getTitle(),
			project.getLabel(),
			project.getDescription(),
			project.getHighlights().stream().map(ProjectHighlight::getText).toList(),
			project.getTechnologies().stream().map(ProjectTechnology::getName).toList(),
			project.getGithubUrl(),
			project.getVisualKey(),
			project.getIconKey(),
			project.isFeatured(),
			project.getDisplayOrder()
		);
	}
}
