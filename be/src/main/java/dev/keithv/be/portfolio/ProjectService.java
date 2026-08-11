package dev.keithv.be.portfolio;

import dev.keithv.be.common.BadRequestException;
import dev.keithv.be.common.ConflictException;
import dev.keithv.be.common.ResourceNotFoundException;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProjectService {
	private final ProjectRepository projectRepository;
	private final ProjectMapper projectMapper;

	public ProjectService(ProjectRepository projectRepository, ProjectMapper projectMapper) {
		this.projectRepository = projectRepository;
		this.projectMapper = projectMapper;
	}

	@Transactional(readOnly = true)
	public List<ProjectResponse> getProjects() {
		return projectRepository.findAllByOrderByDisplayOrderAsc().stream()
			.map(projectMapper::toResponse)
			.toList();
	}

	@Transactional(readOnly = true)
	public List<ProjectResponse> getFeaturedProjects() {
		return projectRepository.findAllByIsFeaturedTrueOrderByDisplayOrderAsc().stream()
			.map(projectMapper::toResponse)
			.toList();
	}

	@Transactional(readOnly = true)
	public ProjectResponse getProject(String slug) {
		return projectRepository.findBySlug(slug)
			.map(projectMapper::toResponse)
			.orElseThrow(() -> new ResourceNotFoundException("Project not found"));
	}

	@Transactional(readOnly = true)
	public ProjectResponse getProject(UUID id) {
		return projectRepository.findById(id)
			.map(projectMapper::toResponse)
			.orElseThrow(() -> new ResourceNotFoundException("Project not found"));
	}

	@Transactional
	public ProjectResponse createProject(ProjectCreateRequest request) {
		String slug = request.slug().trim();
		if (projectRepository.existsBySlug(slug)) {
			throw new ConflictException("Project slug already exists");
		}
		Project project = new Project(
			request.number().trim(),
			slug,
			request.title().trim(),
			request.label().trim(),
			request.description().trim(),
			normalizeNullable(request.github()),
			normalizeNullable(request.visualKey()),
			request.iconKey().trim(),
			request.isFeatured(),
			request.displayOrder(),
			normalizeList(request.highlights()),
			normalizeList(request.tech())
		);
		return projectMapper.toResponse(projectRepository.save(project));
	}

	@Transactional
	public ProjectResponse patchProject(UUID id, ProjectPatchRequest request) {
		if (isEmpty(request)) {
			throw new BadRequestException("At least one project field is required");
		}
		Project project = projectRepository.findById(id)
			.orElseThrow(() -> new ResourceNotFoundException("Project not found"));
		String slug = normalizeNullable(request.slug());
		if (slug != null && projectRepository.existsBySlugAndIdNot(slug, id)) {
			throw new ConflictException("Project slug already exists");
		}
		project.update(
			normalizeNullable(request.number()),
			slug,
			normalizeNullable(request.title()),
			normalizeNullable(request.label()),
			normalizeNullable(request.description()),
			normalizeNullable(request.github()),
			normalizeNullable(request.visualKey()),
			normalizeNullable(request.iconKey()),
			request.isFeatured(),
			request.displayOrder(),
			request.highlights() == null ? null : normalizeList(request.highlights()),
			request.tech() == null ? null : normalizeList(request.tech())
		);
		return projectMapper.toResponse(project);
	}

	@Transactional
	public void deleteProject(UUID id) {
		if (!projectRepository.existsById(id)) {
			throw new ResourceNotFoundException("Project not found");
		}
		projectRepository.deleteById(id);
	}

	private String normalizeNullable(String value) {
		return value == null ? null : value.trim();
	}

	private List<String> normalizeList(List<String> values) {
		return values.stream().map(String::trim).toList();
	}

	private boolean isEmpty(ProjectPatchRequest request) {
		return request.number() == null
			&& request.slug() == null
			&& request.title() == null
			&& request.label() == null
			&& request.description() == null
			&& request.github() == null
			&& request.visualKey() == null
			&& request.iconKey() == null
			&& request.isFeatured() == null
			&& request.displayOrder() == null
			&& request.highlights() == null
			&& request.tech() == null;
	}
}
