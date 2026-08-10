package dev.keithv.be.portfolio;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkExperienceRepository extends JpaRepository<WorkExperience, UUID> {
	List<WorkExperience> findAllByOrderByDisplayOrderAsc();
}
