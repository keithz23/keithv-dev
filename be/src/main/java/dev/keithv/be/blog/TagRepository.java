package dev.keithv.be.blog;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TagRepository extends JpaRepository<Tag, UUID> {
	boolean existsByName(String name);

	boolean existsBySlug(String slug);

	Optional<Tag> findBySlug(String slug);

	List<Tag> findAllByOrderByNameAsc();

	List<Tag> findAllBySlugIn(Collection<String> slugs);

	@Query("SELECT COUNT(p) FROM Post p JOIN p.tags t WHERE t.id = :tagId")
	long countPostsUsingTag(@Param("tagId") UUID tagId);
}
