package dev.keithv.be.portfolio;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HeroPrincipleRepository extends JpaRepository<HeroPrinciple, UUID> {
	List<HeroPrinciple> findAllByOrderByDisplayOrderAsc();
}
