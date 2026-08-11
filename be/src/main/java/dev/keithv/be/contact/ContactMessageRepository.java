package dev.keithv.be.contact;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, UUID> {
	Page<ContactMessage> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
