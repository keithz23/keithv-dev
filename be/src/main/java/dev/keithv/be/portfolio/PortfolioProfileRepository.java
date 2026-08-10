package dev.keithv.be.portfolio;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PortfolioProfileRepository extends JpaRepository<PortfolioProfile, UUID> {
	Optional<PortfolioProfile> findByProfileKey(String profileKey);
}
