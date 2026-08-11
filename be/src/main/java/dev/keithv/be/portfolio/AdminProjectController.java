package dev.keithv.be.portfolio;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import java.util.UUID;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/projects")
@SecurityRequirement(name = "bearerAuth")
public class AdminProjectController {
	private final ProjectService projectService;

	public AdminProjectController(ProjectService projectService) {
		this.projectService = projectService;
	}

	@GetMapping
	public List<ProjectResponse> projects() {
		return projectService.getProjects();
	}

	@GetMapping("/{id}")
	public ProjectResponse project(@PathVariable UUID id) {
		return projectService.getProject(id);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public ProjectResponse create(@Valid @RequestBody ProjectCreateRequest request) {
		return projectService.createProject(request);
	}

	@PatchMapping("/{id}")
	public ProjectResponse patch(@PathVariable UUID id, @Valid @RequestBody ProjectPatchRequest request) {
		return projectService.patchProject(id, request);
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void delete(@PathVariable UUID id) {
		projectService.deleteProject(id);
	}
}
