package dev.keithv.be.portfolio;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, UUID> {
	List<Project> findAllByOrderByDisplayOrderAsc();

	List<Project> findAllByIsFeaturedTrueOrderByDisplayOrderAsc();

	Optional<Project> findBySlug(String slug);

	boolean existsBySlug(String slug);

	boolean existsBySlugAndIdNot(String slug, UUID id);
}
