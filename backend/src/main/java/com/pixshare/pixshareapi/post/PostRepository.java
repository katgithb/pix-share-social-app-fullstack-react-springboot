package com.pixshare.pixshareapi.post;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {

    @Query("SELECT p FROM Post p WHERE p.id = :postId AND p.user.role.roleName = :roleName")
    Optional<Post> findByIdAndUser_Role(@Param("postId") Long postId,
                                        @Param("roleName") String roleName);

    List<Post> findAllPostsByUserId(Long userId);

    @Query("SELECT p FROM Post p WHERE p.user.id = :userId AND p.user.role.roleName = :roleName")
    Page<Post> findAllPostsByUserIdAndUser_Role(
            @Param("userId") Long userId,
            @Param("roleName") String roleName,
            Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.user.id IN :userIds AND p.user.role.roleName = :roleName")
    Page<Post> findAllPostsByUserIdsAndUser_Role(
            @Param("userIds") List<Long> userIds,
            @Param("roleName") String roleName,
            Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.user.role.roleName = :roleName")
    Page<Post> findAllPostsByUser_Role(@Param("roleName") String roleName,
                                       Pageable pageable);

    @Query("SELECT DISTINCT p FROM Post p JOIN p.likedByUsers u WHERE u.id = :userId")
    List<Post> findLikedPostsByUserId(@Param("userId") Long userId);

    @Query("SELECT DISTINCT p FROM Post p JOIN p.likedByUsers u WHERE u.id = :userId AND p.user.role.roleName = :roleName")
    List<Post> findLikedPostsByUserIdAndUser_Role(@Param("userId") Long userId,
                                                  @Param("roleName") String roleName);

    @Query("SELECT DISTINCT p FROM Post p JOIN p.savedByUsers u WHERE u.id = :userId AND p.user.role.roleName = :roleName")
    Page<Post> findSavedPostsByUserIdAndUser_Role(
            @Param("userId") Long userId,
            @Param("roleName") String roleName,
            Pageable pageable);

    @Query("SELECT COUNT(p) > 0 FROM Post p JOIN p.likedByUsers u WHERE p.id = :postId AND u.id = :userId AND p.user.role.roleName = :roleName")
    Boolean isPostLikedByUserAndUser_Role(
            @Param("postId") Long postId,
            @Param("userId") Long userId,
            @Param("roleName") String roleName);

    @Query("SELECT COUNT(p) > 0 FROM Post p JOIN p.savedByUsers u WHERE p.id = :postId AND u.id = :userId AND p.user.role.roleName = :roleName")
    Boolean isPostSavedByUserAndUser_Role(
            @Param("postId") Long postId,
            @Param("userId") Long userId,
            @Param("roleName") String roleName);

    void deleteByUserId(Long userId);

    /**
     * Counts the number of posts created within a specified date range.
     */
    @Query("SELECT COUNT(p) FROM Post p WHERE p.createdAt BETWEEN :startDate AND :endDate")
    Long countPostsCreatedBetween(
            @Param("startDate") ZonedDateTime startDate,
            @Param("endDate") ZonedDateTime endDate);

    /**
     * Get post counts by day within a date range
     */
    @Query(value = "SELECT TO_CHAR(p.created_at, 'YYYY-MM-DD') AS day, COUNT(p.id) AS post_count " +
            "FROM post p " +
            "WHERE p.created_at BETWEEN :startDate AND :endDate " +
            "GROUP BY day " +
            "ORDER BY day", nativeQuery = true)
    List<Object[]> getPostCountsByDay(
            @Param("startDate") ZonedDateTime startDate,
            @Param("endDate") ZonedDateTime endDate);

    /**
     * Get post counts by month for a specific year
     */
    @Query(value = "SELECT EXTRACT(MONTH FROM p.created_at) AS month, COUNT(p.id) AS post_count " +
            "FROM post p " +
            "WHERE EXTRACT(YEAR FROM p.created_at) = :year " +
            "AND p.created_at BETWEEN :startDate AND :endDate " +
            "GROUP BY month " +
            "ORDER BY month", nativeQuery = true)
    List<Object[]> getPostCountsByMonth(
            @Param("year") int year,
            @Param("startDate") ZonedDateTime startDate,
            @Param("endDate") ZonedDateTime endDate);

    /**
     * Get post counts by month within a date range
     */
    @Query(value = "SELECT TO_CHAR(p.created_at, 'YYYY-MM') AS month, COUNT(p.id) AS post_count " +
            "FROM post p " +
            "WHERE p.created_at BETWEEN :startDate AND :endDate " +
            "GROUP BY month " +
            "ORDER BY month", nativeQuery = true)
    List<Object[]> getPostCountsByMonthInRange(
            @Param("startDate") ZonedDateTime startDate,
            @Param("endDate") ZonedDateTime endDate);

    /**
     * Get post by ID while excluding posts belonging to a specific role
     */
    Optional<Post> findByIdAndUser_Role_RoleNameNot(Long id, String roleName);

    /**
     * Get all posts created by users excluding a specific role
     */
    Page<Post> findAllByUser_Role_RoleNameNot(String roleName, Pageable pageable);

    /**
     * Find posts created by a specific user and exclude those belonging to a certain role
     */
    Page<Post> findAllByUser_IdAndUser_Role_RoleNameNot(Long userId, String roleName, Pageable pageable);

    /**
     * Find posts created between two dates with pagination
     */
    Page<Post> findAllByCreatedAtBetweenAndUser_Role_RoleNameNot(
            ZonedDateTime startDate,
            ZonedDateTime endDate,
            String roleName,
            Pageable pageable);

    /**
     * Search posts by caption or location containing the query string
     */
    @Query("SELECT DISTINCT p FROM Post p WHERE (LOWER(p.caption) LIKE %:query% OR LOWER(p.location) LIKE %:query%) AND p.user.role.roleName <> :roleName")
    Page<Post> searchByCaptionOrLocationAndUser_Role_RoleNameNot(@Param("query") String query, @Param("roleName") String roleName, Pageable pageable);

}