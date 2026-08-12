package dev.keithv.be.blog;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PostRepository extends JpaRepository<Post, UUID> {
	boolean existsBySlug(String slug);

	boolean existsBySlugAndIdNot(String slug, UUID id);

	Optional<Post> findBySlugAndStatus(String slug, PostStatus status);

	Page<Post> findAllByOrderByUpdatedAtDesc(Pageable pageable);

	Page<Post> findAllByStatusOrderByUpdatedAtDesc(PostStatus status, Pageable pageable);

	@Query(
		value = """
			SELECT p FROM Post p
			WHERE p.status = :status
			ORDER BY p.publishedAt DESC
			""",
		countQuery = "SELECT COUNT(p) FROM Post p WHERE p.status = :status"
	)
	Page<Post> findPublicPosts(@Param("status") PostStatus status, Pageable pageable);

	@Query(
		value = """
			SELECT DISTINCT p FROM Post p
			JOIN p.tags t
			WHERE p.status = :status AND t.slug = :tagSlug
			ORDER BY p.publishedAt DESC
			""",
		countQuery = """
			SELECT COUNT(DISTINCT p) FROM Post p
			JOIN p.tags t
			WHERE p.status = :status AND t.slug = :tagSlug
			"""
	)
	Page<Post> findPublicPostsByTag(
		@Param("status") PostStatus status,
		@Param("tagSlug") String tagSlug,
		Pageable pageable
	);
}
