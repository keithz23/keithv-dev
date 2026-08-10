package dev.keithv.be.portfolio;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SocialLinkRepository extends JpaRepository<SocialLink, UUID> {
	List<SocialLink> findAllByOrderByDisplayOrderAsc();
}
