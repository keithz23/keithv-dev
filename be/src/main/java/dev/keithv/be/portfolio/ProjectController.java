package dev.keithv.be.portfolio;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/projects")
public class ProjectController {
	private final ProjectService projectService;

	public ProjectController(ProjectService projectService) {
		this.projectService = projectService;
	}

	@GetMapping
	public List<ProjectResponse> projects() {
		return projectService.getProjects();
	}

	@GetMapping("/featured")
	public List<ProjectResponse> featuredProjects() {
		return projectService.getFeaturedProjects();
	}

	@GetMapping("/{slug}")
	public ProjectResponse project(@PathVariable String slug) {
		return projectService.getProject(slug);
	}
}
